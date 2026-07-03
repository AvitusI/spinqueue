import { useParams } from 'react-router-dom'
import { useLiveQueue } from '../lib/useLiveQueue'
import { Logo } from '../components/Logo'
import { ConnDot } from '../components/ConnDot'
import { Icon } from '../components/ui/Icon'

export function BigScreen() {
  const { code } = useParams()
  const { queue, status } = useLiveQueue(code)

  const nowPlaying = queue.find((q) => q.status === 'playing')
  const upNext = queue.filter((q) => q.status !== 'playing').slice(0, 8)

  return (
    <div className="relative min-h-svh overflow-hidden bg-surface-950">
      <div className="grid-glow absolute inset-0" />
      <div className="absolute -left-40 top-0 size-[36rem] rounded-full bg-neon-600/20 blur-3xl" />
      <div className="absolute -right-40 bottom-0 size-[32rem] rounded-full bg-grape-600/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-svh max-w-5xl flex-col px-6 py-8 sm:px-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Logo />
          <ConnDot status={status} />
        </div>

        {/* Join prompt */}
        <div className="mt-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-haze-400">
            Request a song — join at this code
          </p>
          <p className="font-display text-6xl font-bold tracking-[0.3em] text-gradient sm:text-8xl">
            {code}
          </p>
        </div>

        {/* Now playing */}
        <div className="mt-10">
          {nowPlaying ? (
            <div className="flex items-center gap-6 rounded-3xl border border-neon-500/40 bg-neon-500/10 p-8 shadow-glow">
              <div className="grid size-20 shrink-0 place-items-center rounded-full bg-neon-500/20 text-neon-300">
                <Icon name="radio" size={40} className="animate-pulse-glow" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neon-400">
                  Now playing
                </p>
                <p className="truncate font-display text-4xl font-bold text-white sm:text-5xl">
                  {nowPlaying.title}
                </p>
                <p className="truncate text-xl text-haze-200">
                  {nowPlaying.artist}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-haze-300">
              <Icon name="disc" size={40} className="mx-auto text-haze-400" />
              <p className="mt-3 font-display text-2xl font-bold text-white">
                Waiting for the next track…
              </p>
            </div>
          )}
        </div>

        {/* Up next */}
        <div className="mt-10 flex-1">
          <h2 className="font-display text-xl font-bold text-haze-200">
            Up next{' '}
            <span className="text-haze-400">· voted by the crowd</span>
          </h2>
          <ol className="mt-5 space-y-3">
            {upNext.map((item, i) => (
              <li
                key={item.id}
                className="flex items-center gap-5 rounded-2xl border border-white/8 bg-surface-900/70 px-6 py-4"
              >
                <span className="font-display text-3xl font-bold text-haze-500">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-xl font-bold text-white">
                    {item.title}
                  </p>
                  <p className="truncate text-haze-300">{item.artist}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-neon-300">
                  <Icon name="chevronUp" size={22} />
                  <span className="font-display text-2xl font-bold">
                    {item.vote_count}
                  </span>
                </div>
              </li>
            ))}
            {upNext.length === 0 && (
              <li className="rounded-2xl border border-white/8 bg-surface-900/70 px-6 py-8 text-center text-haze-400">
                No requests yet — be the first!
              </li>
            )}
          </ol>
        </div>
      </div>
    </div>
  )
}
