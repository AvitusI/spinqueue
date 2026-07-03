export type UserRole = 'dj' | 'patron'

export type RequestStatus =
  | 'pending'
  | 'queued'
  | 'playing'
  | 'played'
  | 'rejected'

export interface User {
  id: number
  email: string
  display_name: string
  role: UserRole
  created_at: string
}

export interface Session {
  id: number
  name: string
  venue_name: string
  join_code: string
  is_active: boolean
  dj_id: number
  created_at: string
  ended_at: string | null
}

export interface QueueItem {
  id: number
  title: string
  artist: string
  note: string | null
  status: RequestStatus
  requester_id: number
  requester_name: string
  vote_count: number
  has_voted: boolean
  created_at: string
}

export interface VoteResult {
  request_id: number
  vote_count: number
}

export interface QueueMessage {
  type: 'queue_update'
  session_code: string
  queue: QueueItem[]
}
