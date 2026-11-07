import { company } from '../data/studies'

export function Brand({ name = company.name, compact = false }: { name?: string; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-ink">
      <span className="brand-mark h-6 w-3.5" aria-hidden />
      {!compact && <span className="text-[13px] font-medium tracking-[0.02em]">{name}</span>}
    </span>
  )
}
