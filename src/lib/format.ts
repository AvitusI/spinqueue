import type { RequestStatus } from './types'

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'Pending',
  queued: 'Queued',
  playing: 'Now playing',
  played: 'Played',
  rejected: 'Rejected',
}

export const REQUEST_STATUS_STYLE: Record<RequestStatus, string> = {
  pending: 'bg-white/10 text-haze-200',
  queued: 'bg-grape-500/20 text-grape-400',
  playing: 'bg-neon-500/20 text-neon-300',
  played: 'bg-white/5 text-haze-400',
  rejected: 'bg-red-500/15 text-red-300',
}

/** Legal DJ-driven transitions, mirroring the backend state machine. */
export const NEXT_REQUEST_STATUS: Record<RequestStatus, RequestStatus[]> = {
  pending: ['queued', 'rejected'],
  queued: ['playing', 'rejected'],
  playing: ['played'],
  played: [],
  rejected: [],
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}
