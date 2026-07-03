import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api'
import type { Session } from '../lib/types'
import { relativeTime } from '../lib/format'
import { TopBar } from '../components/TopBar'
import { Field } from '../components/ui/Field'
import { Icon } from '../components/ui/Icon'
import { PageLoader } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

export function DjSessions() {
  const toast = useToast()
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [name, setName] = useState('')
  const [venue, setVenue] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    setSessions(await api.get<Session[]>('/sessions'))
  }
  useEffect(() => {
    void load()
  }, [])

  async function create(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await api.post<Session>('/sessions', { name, venue_name: venue })
      toast.success('Session opened')
      setName('')
      setVenue('')
      await load()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not create')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-svh">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-white">
          Your sessions
        </h1>
        <p className="mt-1 text-haze-300">
          Open a room, share the code, and work the queue.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
          {/* List */}
          <div>
            {!sessions && <PageLoader label="Loading sessions" />}
            {sessions && sessions.length === 0 && (
              <div className="card grid place-items-center gap-2 py-16 text-center text-haze-300">
                <div className="grid size-14 place-items-center rounded-2xl bg-white/5 text-haze-400">
                  <Icon name="disc" size={26} />
                </div>
                <p className="font-semibold text-white">No sessions yet</p>
                <p className="text-sm">Open your first one to get started.</p>
              </div>
            )}
            {sessions && sessions.length > 0 && (
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <Link
                      to={`/dj/${s.join_code}`}
                      className="flex items-center gap-4 rounded-2xl border border-white/8 bg-surface-900/80 p-4 transition-colors hover:border-neon-500/30"
                    >
                      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-neon-500/20 to-grape-500/20 text-neon-300">
                        <Icon name="music" size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white">
                          {s.name}
                        </p>
                        <p className="truncate text-sm text-haze-300">
                          {s.venue_name} · opened {relativeTime(s.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-display text-lg font-bold tracking-widest text-neon-300">
                          {s.join_code}
                        </span>
                        <p className="mt-0.5 text-xs">
                          {s.is_active ? (
                            <span className="text-emerald-400">● Live</span>
                          ) : (
                            <span className="text-haze-400">Closed</span>
                          )}
                        </p>
                      </div>
                      <Icon
                        name="arrowRight"
                        size={16}
                        className="shrink-0 text-haze-400"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Create form */}
          <form onSubmit={create} className="card-glow h-fit space-y-4 p-5">
            <h2 className="font-display font-semibold text-white">
              Open a session
            </h2>
            <Field
              label="Session name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Friday Night Set"
              required
            />
            <Field
              label="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Club Bongo"
              required
            />
            <button disabled={busy} className="btn btn-primary w-full">
              <Icon name="plus" size={16} /> Open session
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
