import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { initials } from '../lib/format'
import { Logo } from './Logo'
import { Icon } from './ui/Icon'

export function TopBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-surface-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/home">
          <Logo size="sm" />
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-neon-500 to-grape-600 text-xs font-bold text-white">
                {initials(user.display_name)}
              </div>
              <span className="text-sm font-medium text-haze-200">
                {user.display_name}
              </span>
            </div>
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="btn btn-glass btn-sm"
            >
              <Icon name="logout" size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
