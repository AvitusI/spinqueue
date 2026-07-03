import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../lib/api'
import { useLiveQueue } from '../lib/useLiveQueue'
import type { QueueItem, RequestStatus, Session } from '../lib/types'
import { TopBar } from '../components/TopBar'
import { QueueList } from '../components/QueueList'
import { Icon } from '../components/ui/Icon'
import { PageLoader } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'
import { ConnDot } from '../components/ConnDot'

export function DjConsole() {
  const { code } = useParams()
  const toast = useToast()
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { queue, status: conn } = useLiveQueue(code)

  const loadSession = useCallback(async () => {
    try {
      setSession(await api.get<Session>(`/sessions/${code}`))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load session')
    }
  }, [code])

  useEffect(() => {
    void loadSession()
  }, [loadSession])

  async function setStatus(item: QueueItem, next: RequestStatus) {
    try {
      await api.patch(`/requests/${item.id}`, { status: next })
      // The WebSocket broadcast refreshes the queue for us.
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Update failed')
    }
  }

  async function toggleSession() {
    if (!session) return
    try {
      const updated = await api.patch<Session>(`/sessions/${code}`, {
        is_active: !session.is_active,
      })
      setSession(updated)
      toast.success(updated.is_active ? 'Session reopened' : 'Session closed')
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not update')
    }
  }

  if (error)
    return (
      <div className="min-h-svh">
        <TopBar />
        <div className="mx-auto max-w-lg px-6 py-16 text-center text-haze-300">
          {error} ·{' '}
          <Link to="/dj" className="font-semibold text-neon-400 underline">
            Back to sessions
          </Link>
        </div>
      </div>
    )
  if (!session) return <PageLoader label="Loading console" />

  const nowPlaying = queue.find((q) => q.status === 'playing')
  const pending = queue.filter((q) => q.status === 'pending').length

  return (
    <div className="min-h-svh">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          to="/dj"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-haze-400 hover:text-white"
        >
          <Icon name="arrowRight" size={15} className="rotate-180" /> All sessions
        </Link>

        {/* Session header */}
        <div className="card-glow overflow-hidden">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-bold text-white">
                  {session.name}
                </h1>
                <ConnDot status={conn} />
              </div>
              <p className="mt-1 text-haze-300">{session.venue_name}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-haze-300">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="music" size={15} /> {queue.length} in queue
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="clock" size={15} /> {pending} pending
                </span>
              </div>
            </div>

            {/* Join code card */}
            <div className="rounded-2xl border border-white/10 bg-surface-950 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-haze-400">
                Join code
              </p>
              <p className="font-display text-4xl font-bold tracking-[0.25em] text-gradient">
                {session.join_code}
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(session.join_code)
                    toast.success('Code copied')
                  }}
                  className="btn btn-glass btn-sm"
                >
                  <Icon name="copy" size={14} /> Copy
                </button>
                <Link
                  to={`/screen/${session.join_code}`}
                  className="btn btn-glass btn-sm"
                  target="_blank"
                >
                  <Icon name="share" size={14} /> Big screen
                </Link>
              </div>
            </div>
          </div>

          {!session.is_active && (
            <div className="flex items-center gap-2 border-t border-white/8 bg-red-500/10 px-6 py-3 text-sm text-red-200">
              <Icon name="ban" size={15} /> This session is closed — patrons can't
              add requests.
            </div>
          )}
        </div>

        {/* Now playing */}
        {nowPlaying && (
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-neon-500/40 bg-neon-500/10 p-5 shadow-glow">
            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-neon-500/20 text-neon-300">
              <Icon name="radio" size={24} className="animate-pulse-glow" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-neon-400">
                Now playing
              </p>
              <p className="truncate font-display text-lg font-bold text-white">
                {nowPlaying.title}{' '}
                <span className="font-sans font-normal text-haze-300">
                  — {nowPlaying.artist}
                </span>
              </p>
            </div>
            <button
              onClick={() => setStatus(nowPlaying, 'played')}
              className="btn btn-glass btn-sm shrink-0"
            >
              <Icon name="check" size={14} /> Done
            </button>
          </div>
        )}

        {/* Controls + queue */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Request queue
          </h2>
          <button onClick={toggleSession} className="btn btn-glass btn-sm">
            {session.is_active ? (
              <>
                <Icon name="ban" size={14} /> Close session
              </>
            ) : (
              <>
                <Icon name="radio" size={14} /> Reopen
              </>
            )}
          </button>
        </div>
        <div className="mt-4">
          <QueueList items={queue} mode="dj" onStatus={setStatus} />
        </div>
      </main>
    </div>
  )
}
