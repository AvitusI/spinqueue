import type { ConnStatus } from '../lib/useLiveQueue'

const MAP: Record<ConnStatus, { label: string; dot: string; text: string }> = {
  connecting: { label: 'Connecting', dot: 'bg-amber-400', text: 'text-amber-300' },
  live: { label: 'Live', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  closed: { label: 'Offline', dot: 'bg-red-400', text: 'text-red-300' },
}

export function ConnDot({ status }: { status: ConnStatus }) {
  const s = MAP[status]
  return (
    <span
      className={`badge border border-white/10 bg-white/5 ${s.text}`}
      title={`Realtime: ${s.label}`}
    >
      <span
        className={`size-1.5 rounded-full ${s.dot} ${status === 'live' ? 'animate-pulse-glow' : ''}`}
      />
      {s.label}
    </span>
  )
}
