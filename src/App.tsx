import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './lib/auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PageLoader } from './components/ui/Spinner'
import { Landing } from './pages/Landing'
import { Auth } from './pages/Auth'
import { DjSessions } from './pages/DjSessions'
import { DjConsole } from './pages/DjConsole'
import { JoinSession } from './pages/JoinSession'
import { PatronSession } from './pages/PatronSession'
import { BigScreen } from './pages/BigScreen'
import { NotFound } from './pages/NotFound'

/** Sends a freshly-authenticated user to the right home for their role. */
function RoleRedirect() {
  const { user, loading } = useAuth()
  if (loading)
    return (
      <div className="grid min-h-svh place-items-center">
        <PageLoader />
      </div>
    )
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'dj' ? '/dj' : '/join'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route path="/home" element={<RoleRedirect />} />

      {/* Public — no login needed to watch or join */}
      <Route path="/session/:code" element={<PatronSession />} />
      <Route path="/screen/:code" element={<BigScreen />} />

      {/* DJ */}
      <Route element={<ProtectedRoute role="dj" />}>
        <Route path="/dj" element={<DjSessions />} />
        <Route path="/dj/:code" element={<DjConsole />} />
      </Route>

      {/* Patron */}
      <Route element={<ProtectedRoute role="patron" />}>
        <Route path="/join" element={<JoinSession />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
