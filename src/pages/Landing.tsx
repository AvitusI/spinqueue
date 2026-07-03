import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Icon, type IconName } from '../components/ui/Icon'

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'headphones',
    title: 'Open a session',
    body: 'DJs spin up a room in one tap and get a short code to put on the screen.',
  },
  {
    icon: 'music',
    title: 'Request tracks',
    body: 'The crowd sends song requests straight from their phones — no app install.',
  },
  {
    icon: 'chevronUp',
    title: 'Vote it up',
    body: 'Everyone upvotes their favourites. The queue reorders by popularity, live.',
  },
  {
    icon: 'radio',
    title: 'Realtime everywhere',
    body: 'A WebSocket feed keeps the DJ booth, every phone and the big screen in sync.',
  },
]

export function Landing() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  return (
    <div className="min-h-svh bg-surface-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link to="/login" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-glow absolute inset-0" />
        <div className="absolute -left-40 top-0 size-[30rem] rounded-full bg-neon-600/20 blur-3xl" />
        <div className="absolute -right-40 top-20 size-[26rem] rounded-full bg-grape-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center sm:py-28">
          <span className="badge border border-white/10 bg-white/5 text-neon-300">
            <Icon name="sparkles" size={14} /> Live requests for bars &amp; clubs
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl">
            Request a song.
            <br />
            <span className="text-gradient">Let the crowd decide.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-haze-300">
            SpinQueue turns any room into a shared playlist. Patrons request and
            upvote tracks; the DJ works a live, vote-ranked queue.
          </p>

          {/* Join box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const c = code.trim().toUpperCase()
              if (c) navigate(`/session/${c}`)
            }}
            className="mx-auto mt-9 flex max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur"
          >
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter a session code"
              className="flex-1 bg-transparent px-3 py-2 text-center font-display text-lg font-semibold uppercase tracking-widest text-white placeholder-haze-400 outline-none"
              maxLength={6}
            />
            <button className="btn btn-primary">
              Join <Icon name="arrowRight" size={16} />
            </button>
          </form>
          <p className="mt-4 text-sm text-haze-400">
            Are you the DJ?{' '}
            <Link to="/register" className="font-semibold text-neon-400 hover:underline">
              Start a session →
            </Link>
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card p-6">
              <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-neon-500/20 to-grape-500/20 text-neon-300">
                <Icon name={f.icon} />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-display text-xs font-bold text-haze-400">
                  0{i + 1}
                </span>
                <h3 className="font-semibold text-white">{f.title}</h3>
              </div>
              <p className="mt-1.5 text-sm text-haze-300">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neon-600/20 via-surface-900 to-grape-600/20 px-8 py-14 text-center">
          <div className="grid-glow absolute inset-0" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white">
              Get the party in sync
            </h2>
            <p className="mx-auto mt-3 max-w-md text-haze-300">
              Spin up a session in seconds and drop the code on the screen.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn btn-primary">
                Start as a DJ <Icon name="headphones" size={16} />
              </Link>
              <Link to="/login" className="btn btn-glass">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo size="sm" />
          <p className="text-sm text-haze-400">
            Built with FastAPI + WebSockets + React. A portfolio project.
          </p>
        </div>
      </footer>
    </div>
  )
}
