import { company } from '../data/studies'
import { asset } from '../lib/asset'

export function Brand({ name = company.name, compact = false }: { name?: string; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-ink">
      <span className="brand-mark h-6 w-3.5" style={{ WebkitMaskImage: `url(${asset('img/pjk-mark.png')})`, maskImage: `url(${asset('img/pjk-mark.png')})` }} aria-hidden />
      {!compact && <span className="text-[13px] font-medium tracking-[0.02em]">{name}</span>}
    </span>
  )
}
