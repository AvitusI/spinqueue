import type { QueueItem, RequestStatus } from '../lib/types'
import { NEXT_REQUEST_STATUS, REQUEST_STATUS_LABEL } from '../lib/format'
import { Icon } from './ui/Icon'
import { StatusChip } from './StatusChip'

type Mode = 'patron' | 'dj' | 'display'

interface QueueListProps {
  items: QueueItem[]
  mode: Mode
  votedIds?: Set<number>
  currentUserId?: number
  onVote?: (item: QueueItem) => void
  onUnvote?: (item: QueueItem) => void
  onStatus?: (item: QueueItem, status: RequestStatus) => void
}

const STATUS_ACTION_LABEL: Record<RequestStatus, string> = {
  pending: 'Pending',
  queued: 'Queue it',
  playing: 'Play now',
  played: 'Mark played',
  rejected: 'Reject',
}

export function QueueList({
  items,
  mode,
  votedIds,
  currentUserId,
  onVote,
  onUnvote,
  onStatus,
}: QueueListProps) {
  if (items.length === 0) {
    return (
      <div className="card grid place-items-center gap-3 py-16 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-white/5 text-haze-400">
          <Icon name="music" size={26} />
        </div>
        <div>
          <p className="font-semibold text-white">The queue is empty</p>
          <p className="text-sm text-haze-400">
            {mode === 'dj'
              ? 'Requests from the crowd will appear here.'
              : 'Be the first to request a track!'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const isPlaying = item.status === 'playing'
        const voted = votedIds?.has(item.id) ?? item.has_voted
        return (
          <li
            key={item.id}
            className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
              isPlaying
                ? 'border-neon-500/40 bg-neon-500/10 shadow-glow'
                : 'border-white/8 bg-surface-900/80'
            }`}
          >
            {/* Rank */}
            <div className="w-6 shrink-0 text-center">
              {isPlaying ? (
                <Icon name="radio" size={20} className="mx-auto text-neon-400" />
              ) : (
                <span className="font-display text-lg font-bold text-haze-400">
                  {i + 1}
                </span>
              )}
            </div>

            {/* Vote (patron) */}
            {mode === 'patron' && (
              <button
                onClick={() => (voted ? onUnvote?.(item) : onVote?.(item))}
                className={`flex w-14 shrink-0 flex-col items-center rounded-xl border py-1.5 transition-all active:scale-95 ${
                  voted
                    ? 'border-neon-500/50 bg-neon-500/20 text-neon-300'
                    : 'border-white/10 bg-white/5 text-haze-200 hover:border-neon-500/40 hover:text-white'
                }`}
                aria-label={voted ? 'Remove vote' : 'Upvote'}
              >
                <Icon name="chevronUp" size={18} />
                <span className="text-sm font-bold">{item.vote_count}</span>
              </button>
            )}

            {/* Vote count (dj / display) */}
            {mode !== 'patron' && (
              <div className="flex w-12 shrink-0 flex-col items-center text-neon-300">
                <Icon name="chevronUp" size={16} />
                <span className="font-display text-lg font-bold">
                  {item.vote_count}
                </span>
              </div>
            )}

            {/* Track */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{item.title}</p>
              <p className="truncate text-sm text-haze-300">{item.artist}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-haze-400">
                <span className="inline-flex items-center gap-1">
                  <Icon name="user" size={12} />
                  {item.requester_name}
                  {currentUserId === item.requester_id && (
                    <span className="text-neon-400"> · you</span>
                  )}
                </span>
                {item.note && (
                  <span className="truncate italic">“{item.note}”</span>
                )}
              </div>
            </div>

            {/* Status + DJ controls */}
            <div className="flex shrink-0 flex-col items-end gap-2">
              {(mode !== 'dj' || item.status === 'playing') && (
                <StatusChip status={item.status} />
              )}
              {mode === 'dj' && (
                <div className="flex flex-wrap justify-end gap-1.5">
                  {NEXT_REQUEST_STATUS[item.status].map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatus?.(item, s)}
                      className={`btn btn-sm ${
                        s === 'rejected' ? 'btn-danger' : 'btn-primary'
                      }`}
                      title={STATUS_ACTION_LABEL[s]}
                    >
                      {s === 'played' && <Icon name="check" size={14} />}
                      {s === 'playing' && <Icon name="play" size={14} />}
                      {s === 'queued' && <Icon name="plus" size={14} />}
                      {s === 'rejected' ? '' : STATUS_ACTION_LABEL[s]}
                      {s === 'rejected' && <Icon name="x" size={14} />}
                    </button>
                  ))}
                  {NEXT_REQUEST_STATUS[item.status].length === 0 && (
                    <span className="text-xs text-haze-400">
                      {REQUEST_STATUS_LABEL[item.status]}
                    </span>
                  )}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
