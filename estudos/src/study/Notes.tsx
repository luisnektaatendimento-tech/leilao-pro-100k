import { useStudy } from './ctx'
import { pad2 } from '../lib/format'

/** Notas do apresentador — aparecem só enquanto N estiver pressionado. */
export default function Notes({ open }: { open: boolean }) {
  const { scenes, index } = useStudy()
  if (!open) return null
  const s = scenes[index]
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[75] md:inset-x-auto md:right-8 md:w-[460px]" role="note" aria-live="polite">
      <div className="glass rounded-2xl p-6" style={{ background: 'rgb(14 14 16 / .92)' }}>
        <p className="label">Notas · cena {pad2(index + 1)} · {s.title}</p>
        <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-ink-2">
          {s.notes.map((n, i) => (
            <li key={i} className={n.startsWith('⚠') ? 'text-[#e8c48a]' : ''}>
              {n}
            </li>
          ))}
        </ul>
        {index < scenes.length - 1 && <p className="label mt-5 border-t border-white/10 pt-4">A seguir: {scenes[index + 1].title}</p>}
      </div>
    </div>
  )
}
