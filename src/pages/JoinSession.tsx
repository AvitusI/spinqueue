import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, ApiError } from '../lib/api'
import type { Session } from '../lib/types'
import { TopBar } from '../components/TopBar'
import { Icon } from '../components/ui/Icon'
import { Spinner } from '../components/ui/Spinner'

export function JoinSession() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const c = code.trim().toUpperCase()
    if (!c) return
    setBusy(true)
    setError(null)
    try {
      await api.get<Session>(`/sessions/${c}`)
      navigate(`/session/${c}`)
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 404
          ? "That code doesn't match a session."
          : 'Could not find that session.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-svh">
      <TopBar />
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-neon-500/20 to-grape-500/20 text-neon-300">
          <Icon name="music" size={30} />
        </div>
        <h1 className="mt-5 font-display text-3xl font-bold text-white">
          Join a session
        </h1>
        <p className="mt-2 text-haze-300">
          Enter the code shown at the venue to start requesting songs.
        </p>

        <form onSubmit={submit} className="mt-8">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ABC123"
            maxLength={6}
            className="input text-center font-display text-2xl font-bold uppercase tracking-[0.4em]"
            autoFocus
          />
          {error && (
            <p className="mt-3 text-sm text-red-300">{error}</p>
          )}
          <button disabled={busy} className="btn btn-primary mt-5 w-full">
            {busy ? <Spinner size={16} /> : <Icon name="arrowRight" size={16} />}
            Join session
          </button>
        </form>
      </main>
    </div>
  )
}
