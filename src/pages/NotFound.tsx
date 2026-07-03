import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'

export function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center bg-surface-950 px-6 text-center">
      <div>
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <p className="font-display text-6xl font-bold text-white">404</p>
        <p className="mt-2 text-haze-300">This track isn't in the crate.</p>
        <Link to="/" className="btn btn-primary mt-6">
          Back home
        </Link>
      </div>
    </div>
  )
}
