// In dev, VITE_API_URL is unset → requests go to '/api/v1' (+ '/ws') and Vite
// proxies them to the local backend. In a production build, VITE_API_URL (see
// .env.production) points at the deployed Railway API.
export const API_ORIGIN =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''
const API_BASE = `${API_ORIGIN}/api/v1`
const TOKEN_KEY = 'spinqueue_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  form?: Record<string, string>
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  const init: RequestInit = { method: opts.method ?? 'GET', headers }

  if (opts.auth !== false) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  if (opts.form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    init.body = new URLSearchParams(opts.form).toString()
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(opts.body)
  }

  const res = await fetch(`${API_BASE}${path}`, init)
  if (res.status === 401) clearToken()

  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const data = await res.json()
      if (typeof data.detail === 'string') detail = data.detail
      else if (Array.isArray(data.detail) && data.detail[0]?.msg)
        detail = data.detail[0].msg
    } catch {
      /* ignore non-JSON */
    }
    throw new ApiError(res.status, detail)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  postForm: <T>(path: string, form: Record<string, string>) =>
    request<T>(path, { method: 'POST', form, auth: false }),
}
