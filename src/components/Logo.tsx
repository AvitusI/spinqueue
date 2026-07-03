import { Icon } from './ui/Icon'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'size-8' : 'size-9'
  const text = size === 'sm' ? 'text-lg' : 'text-xl'
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`grid ${box} place-items-center rounded-xl bg-gradient-to-br from-neon-500 to-grape-600 text-white shadow-lg shadow-neon-500/30`}
      >
        <Icon name="disc" size={size === 'sm' ? 18 : 20} />
      </div>
      <span className={`${text} font-display font-bold tracking-tight text-white`}>
        Spin<span className="text-gradient">Queue</span>
      </span>
    </div>
  )
}
