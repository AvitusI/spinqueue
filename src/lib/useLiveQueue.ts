import { useEffect, useRef, useState } from 'react'
import { API_ORIGIN } from './api'
import type { QueueItem, QueueMessage } from './types'

export type ConnStatus = 'connecting' | 'live' | 'closed'

/**
 * Subscribe to a session's live queue over WebSocket.
 * The server pushes a full `queue_update` on connect and after every change,
 * so we simply replace local state on each message. Auto-reconnects on drop.
 */
export function useLiveQueue(code: string | undefined) {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [status, setStatus] = useState<ConnStatus>('connecting')
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!code) return
    let closedByUs = false
    let retry: ReturnType<typeof setTimeout>

    const connect = () => {
      // Prod: derive wss:// from the API origin. Dev: same-origin via Vite proxy.
      const wsBase = API_ORIGIN
        ? API_ORIGIN.replace(/^http/, 'ws')
        : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`
      const ws = new WebSocket(`${wsBase}/ws/sessions/${code}`)
      wsRef.current = ws
      setStatus('connecting')

      ws.onopen = () => setStatus('live')
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as QueueMessage
          if (msg.type === 'queue_update') setQueue(msg.queue)
        } catch {
          /* ignore malformed frames */
        }
      }
      ws.onclose = () => {
        setStatus('closed')
        if (!closedByUs) retry = setTimeout(connect, 1500)
      }
      ws.onerror = () => ws.close()
    }

    connect()
    return () => {
      closedByUs = true
      clearTimeout(retry)
      wsRef.current?.close()
    }
  }, [code])

  return { queue, status }
}
