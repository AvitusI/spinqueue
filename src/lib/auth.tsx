import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, clearToken, getToken, setToken } from './api'
import type { User, UserRole } from './types'

interface AuthState {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    displayName: string,
    password: string,
    role: UserRole,
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMe = useCallback(async () => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    try {
      setUser(await api.get<User>('/auth/me'))
    } catch {
      clearToken()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMe()
  }, [loadMe])

  const login = useCallback(async (email: string, password: string) => {
    const { access_token } = await api.postForm<{ access_token: string }>(
      '/auth/login',
      { username: email, password },
    )
    setToken(access_token)
    setUser(await api.get<User>('/auth/me'))
  }, [])

  const register = useCallback(
    async (
      email: string,
      displayName: string,
      password: string,
      role: UserRole,
    ) => {
      await api.post('/auth/register', {
        email,
        display_name: displayName,
        password,
        role,
      })
      await login(email, password)
    },
    [login],
  )

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
