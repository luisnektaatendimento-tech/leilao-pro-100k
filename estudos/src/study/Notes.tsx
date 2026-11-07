import { useStudy } from './ctx'
import { studies } from '../data/studies'
import { notesFor } from '../lib/notes'

/** Notas do apresentador — aparecem só enquanto N estiver pressionado. */
export default function Notes({ open }: { open: boolean }) {
  const { index } = useStudy()
  if (!open) return null
  const s = studies[index]
  const next = studies[index + 1]
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[75] md:inset-x-auto md:right-8 md:w-[480px]" role="note" aria-live="polite">
      <div className="glass rounded-2xl p-6" style={{ background: 'rgb(14 14 16 / .94)' }}>
        <p className="label">Notas · {s.title}</p>
        <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-ink-2">
          {notesFor(s).map((n, i) => (
            <li key={i} className={n.startsWith('⚠') ? 'text-[#e8c48a]' : ''}>
              {n}
            </li>
          ))}
        </ul>
        {next && <p className="label mt-5 border-t border-white/10 pt-4">A seguir: {next.title}</p>}
      </div>
    </div>
  )
}
