import type { RequestStatus } from '../lib/types'
import { REQUEST_STATUS_LABEL, REQUEST_STATUS_STYLE } from '../lib/format'

export function StatusChip({ status }: { status: RequestStatus }) {
  return (
    <span className={`chip ${REQUEST_STATUS_STYLE[status]}`}>
      {status === 'playing' && (
        <span className="size-1.5 animate-pulse-glow rounded-full bg-current" />
      )}
      {REQUEST_STATUS_LABEL[status]}
    </span>
  )
}
