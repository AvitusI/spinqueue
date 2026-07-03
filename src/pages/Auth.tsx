import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { ApiError } from '../lib/api'
import type { UserRole } from '../lib/types'
import { Logo } from '../components/Logo'
import { Field } from '../components/ui/Field'
import { Icon } from '../components/ui/Icon'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

const DEMO = [
  { label: 'DJ', email: 'dj@spinqueue.io', password: 'password1', icon: 'headphones' as const },
  { label: 'Patron', email: 'alice@spinqueue.io', password: 'password1', icon: 'user' as const },
]

export function Auth({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const isLogin = mode === 'login'

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('patron')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      if (isLogin) await login(email, password)
      else await register(email, name, password, role)
      navigate('/home')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  async function quickLogin(d: (typeof DEMO)[number]) {
    setBusy(true)
    try {
      await login(d.email, d.password)
      navigate('/home')
    } catch {
      toast.error('Demo login failed — is the API seeded and running?')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative grid min-h-svh place-items-center overflow-hidden bg-surface-950 px-6 py-10">
      <div className="grid-glow absolute inset-0" />
      <div className="absolute -left-32 top-10 size-96 rounded-full bg-neon-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 size-96 rounded-full bg-grape-600/20 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="card-glow p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold text-white">
            {isLogin ? 'Welcome back' : 'Join the party'}
          </h1>
          <p className="mt-1 text-sm text-haze-300">
            {isLogin
              ? 'Sign in to your SpinQueue account.'
              : 'Create an account to request songs or host a room.'}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {!isLogin && (
              <>
                <div>
                  <span className="label">I'm here to…</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['patron', 'dj'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition ${
                          role === r
                            ? 'border-neon-500/50 bg-neon-500/15 text-white'
                            : 'border-white/10 bg-white/5 text-haze-300 hover:text-white'
                        }`}
                      >
                        <Icon name={r === 'dj' ? 'headphones' : 'music'} size={16} />
                        {r === 'dj' ? 'Host (DJ)' : 'Request songs'}
                      </button>
                    ))}
                  </div>
                </div>
                <Field
                  label="Display name"
                  name="display_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="DJ Zawadi"
                  required
                />
              </>
            )}
            <Field
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Field
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              hint={isLogin ? undefined : 'At least 8 characters'}
              required
            />
            <button disabled={busy} className="btn btn-primary w-full">
              {busy ? <Spinner size={16} /> : <Icon name="arrowRight" size={16} />}
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-haze-300">
            {isLogin ? 'New here? ' : 'Already have an account? '}
            <Link
              to={isLogin ? '/register' : '/login'}
              className="font-semibold text-neon-400 hover:underline"
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </Link>
          </p>

          {isLogin && (
            <div className="mt-7">
              <div className="mb-3 flex items-center gap-3 text-xs font-medium text-haze-400">
                <span className="h-px flex-1 bg-white/10" />
                TRY A DEMO
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO.map((d) => (
                  <button
                    key={d.email}
                    onClick={() => quickLogin(d)}
                    disabled={busy}
                    className="btn btn-glass btn-sm"
                  >
                    <Icon name={d.icon} size={15} /> {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
