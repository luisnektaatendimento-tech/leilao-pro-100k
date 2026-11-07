import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStudy } from './ctx'
import { CHAPTERS } from '../lib/scenes'
import { pad2 } from '../lib/format'
import { Icon } from '../components/Icon'

const KIND: Record<string, string> = {
  cover: 'Capa', discount: 'Big number', chapter: 'Capítulo', property: 'Ficha', ruler: 'Gráfico', composition: 'Gráfico',
  financing: 'Comparativo', period: 'Insight', compare: 'Comparativo', profit: 'Big number', validation: 'Checklist', conclusion: 'Conclusão',
}

/** Minimapa horizontal dos capítulos ("níveis"). Tecla M. */
export default function Minimap({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { scenes, index, goTo, visited, unlocked } = useStudy()
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'm') {
        e.stopImmediatePropagation()
        e.preventDefault()
        onClose()
      }
    }
    addEventListener('keydown', k, true)
    const ctx = gsap.context(() => {
      gsap.from('[data-mm]', { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.025 })
    }, root)
    root.current?.querySelector<HTMLButtonElement>('[aria-current="step"]')?.focus({ preventScroll: true })
    return () => {
      removeEventListener('keydown', k, true)
      ctx.revert()
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div ref={root} className="fixed inset-0 z-[70] flex flex-col justify-center bg-[rgb(10_10_11/.86)] backdrop-blur-xl" role="dialog" aria-modal aria-label="Mapa de capítulos" onClick={onClose}>
      <div className="absolute right-6 top-6">
        <button className="icon-btn" onClick={onClose} aria-label="Fechar mapa">
          <Icon name="close" />
        </button>
      </div>
      <p className="label px-6 md:px-12" data-mm>
        Mapa do estudo · você está na cena {pad2(index + 1)}
      </p>
      <div className="mt-8 flex gap-8 overflow-x-auto px-6 pb-6 md:px-12 [scrollbar-width:thin]" onClick={(e) => e.stopPropagation()}>
        {CHAPTERS.map((name, c) => {
          const items = scenes.map((s, i) => ({ s, i })).filter((x) => x.s.chapter === c)
          if (!items.length) return null
          return (
            <div key={name} className="flex-none">
              <p className="label mb-3" data-mm>
                Nível {c + 1} · <span className="text-ink">{name}</span>
              </p>
              <div className="flex gap-2">
                {items.map(({ s, i }) => {
                  const cur = i === index
                  return (
                    <button
                      key={s.id}
                      data-mm
                      aria-current={cur ? 'step' : undefined}
                      onClick={() => {
                        goTo(i)
                        onClose()
                      }}
                      className="relative flex h-[132px] w-[150px] flex-col justify-between rounded-xl border p-3 text-left transition-colors duration-500 hover:border-white/40"
                      style={{ borderColor: cur ? 'var(--acc)' : 'rgb(237 234 228 / .12)', background: cur ? 'rgb(var(--acc-rgb) / .07)' : 'rgb(255 255 255 / .02)' }}
                    >
                      <span className="flex items-center justify-between">
                        <span className="mono text-[11px] text-mute">{pad2(i + 1)}</span>
                        {visited.has(i) && <span className="h-1.5 w-1.5 rounded-full bg-white/50" aria-label="visitada" />}
                      </span>
                      <span>
                        <span className="block text-[13px] leading-snug text-ink">{s.title}</span>
                        <span className="label mt-1 block !text-[9px]">
                          {KIND[s.kind]}
                          {s.insight ? (unlocked.has(s.id) ? ' · insight ✓' : ' · insight') : ''}
                        </span>
                      </span>
                      {cur && <span className="label absolute -bottom-6 left-0 !text-[var(--acc)]">Você está aqui</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
