import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Icon } from './Icon'

type ToastKind = 'success' | 'error' | 'info'
interface Toast {
  id: number
  kind: ToastKind
  message: string
}
interface ToastApi {
  success: (m: string) => void
  error: (m: string) => void
  info: (m: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)
let counter = 0

const STYLES: Record<ToastKind, string> = {
  success: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
  error: 'border-red-400/30 bg-red-500/15 text-red-200',
  info: 'border-white/10 bg-surface-800 text-haze-100',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])
  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = ++counter
      setToasts((t) => [...t, { id, kind, message }])
      setTimeout(() => remove(id), 4000)
    },
    [remove],
  )
  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m),
    }),
    [push],
  )

  return (
    <ToastContext value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium backdrop-blur ${STYLES[t.kind]}`}
          >
            <Icon
              name={t.kind === 'error' ? 'ban' : t.kind === 'success' ? 'check' : 'bolt'}
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100"
              aria-label="Dismiss"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
