import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useLiveQueue } from '../lib/useLiveQueue'
import type { QueueItem, Session } from '../lib/types'
import { TopBar } from '../components/TopBar'
import { QueueList } from '../components/QueueList'
import { ConnDot } from '../components/ConnDot'
import { Field } from '../components/ui/Field'
import { Icon } from '../components/ui/Icon'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

export function PatronSession() {
  const { code } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const { queue, status: conn } = useLiveQueue(code)

  const [session, setSession] = useState<Session | null>(null)
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set())

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  // Logged-in patrons get session meta + their existing votes.
  useEffect(() => {
    if (!user || !code) return
    api.get<Session>(`/sessions/${code}`).then(setSession).catch(() => {})
    api
      .get<QueueItem[]>(`/sessions/${code}/requests`)
      .then((items) =>
        setVotedIds(new Set(items.filter((i) => i.has_voted).map((i) => i.id))),
      )
      .catch(() => {})
  }, [user, code])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await api.post(`/sessions/${code}/requests`, {
        title,
        artist,
        note: note || null,
      })
      toast.success('Request sent to the DJ 🎶')
      setTitle('')
      setArtist('')
      setNote('')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not send')
    } finally {
      setBusy(false)
    }
  }

  async function vote(item: QueueItem) {
    setVotedIds((s) => new Set(s).add(item.id))
    try {
      await api.post(`/requests/${item.id}/vote`)
    } catch (err) {
      setVotedIds((s) => {
        const n = new Set(s)
        n.delete(item.id)
        return n
      })
      toast.error(err instanceof ApiError ? err.message : 'Vote failed')
    }
  }

  async function unvote(item: QueueItem) {
    setVotedIds((s) => {
      const n = new Set(s)
      n.delete(item.id)
      return n
    })
    try {
      await api.del(`/requests/${item.id}/vote`)
    } catch {
      setVotedIds((s) => new Set(s).add(item.id))
    }
  }

  return (
    <div className="min-h-svh">
      <TopBar />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Session header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-sm tracking-widest text-neon-300">
              {code}
            </p>
            <h1 className="font-display text-2xl font-bold text-white">
              {session?.name ?? 'Live queue'}
            </h1>
            {session && (
              <p className="text-sm text-haze-300">{session.venue_name}</p>
            )}
          </div>
          <ConnDot status={conn} />
        </div>

        {/* Request form or sign-in prompt */}
        {user ? (
          <form onSubmit={submit} className="card-glow mt-6 space-y-4 p-5">
            <h2 className="font-display font-semibold text-white">
              Request a track
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Jibebe"
                required
              />
              <Field
                label="Artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Mbosso"
                required
              />
            </div>
            <Field
              label="Note for the DJ (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="For the birthday crew!"
            />
            <button disabled={busy} className="btn btn-primary w-full">
              {busy ? <Spinner size={16} /> : <Icon name="music" size={16} />}
              Send request
            </button>
          </form>
        ) : (
          <div className="card mt-6 flex flex-col items-center gap-3 p-6 text-center">
            <p className="text-haze-200">
              Sign in to request songs and vote.
            </p>
            <Link to="/login" className="btn btn-primary">
              Sign in <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        )}

        {/* Live queue */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Up next
          </h2>
          <span className="text-sm text-haze-400">
            {queue.length} in the queue
          </span>
        </div>
        <div className="mt-4">
          <QueueList
            items={queue}
            mode={user ? 'patron' : 'display'}
            votedIds={votedIds}
            currentUserId={user?.id}
            onVote={vote}
            onUnvote={unvote}
          />
        </div>
      </main>
    </div>
  )
}
