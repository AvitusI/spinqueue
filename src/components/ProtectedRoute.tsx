import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { UserRole } from '../lib/types'
import { PageLoader } from './ui/Spinner'

export function ProtectedRoute({ role }: { role?: UserRole }) {
  const { user, loading } = useAuth()
  if (loading)
    return (
      <div className="grid min-h-svh place-items-center">
        <PageLoader label="Loading" />
      </div>
    )
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role)
    return <Navigate to={user.role === 'dj' ? '/dj' : '/join'} replace />
  return <Outlet />
}
