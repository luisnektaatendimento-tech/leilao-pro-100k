import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStudy } from './ctx'
import { studies } from '../data/studies'
import { brl, pad2, pct } from '../lib/format'
import { hero } from '../lib/derive'
import { Icon } from '../components/Icon'

/** Mapa dos estudos (tecla M): os imóveis lado a lado, com onde o espectador está. */
export default function Minimap({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { index, goTo, visited } = useStudy()
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
      gsap.from('[data-mm]', { y: 16, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.02 })
    }, root)
    root.current?.querySelector<HTMLButtonElement>('[aria-current="step"]')?.focus({ preventScroll: true })
    return () => {
      removeEventListener('keydown', k, true)
      ctx.revert()
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div ref={root} className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[rgb(0_0_0/.88)] py-16 backdrop-blur-xl" role="dialog" aria-modal aria-label="Mapa dos estudos" onClick={onClose}>
      <div className="absolute right-6 top-6">
        <button className="icon-btn" onClick={onClose} aria-label="Fechar mapa">
          <Icon name="close" />
        </button>
      </div>
      <p className="label px-4 md:px-12" data-mm>
        Mapa dos estudos · {pad2(visited.size)}/{pad2(studies.length)} vistos
      </p>
      <div className="mt-6 grid grid-cols-1 gap-3 px-4 pb-10 sm:grid-cols-2 md:px-12 lg:grid-cols-3 xl:grid-cols-4" onClick={(e) => e.stopPropagation()}>
        {studies.map((s, i) => {
          const cur = i === index
          const h = hero(s)
          return (
            <button
              key={s.slug}
              data-mm
              aria-current={cur ? 'step' : undefined}
              onClick={() => {
                goTo(i)
                onClose()
              }}
              className="relative flex overflow-hidden rounded-2xl border text-left transition-colors duration-500 hover:border-white/40"
              style={{ borderColor: cur ? 'var(--acc)' : 'rgb(237 234 228 / .12)' }}
            >
              <div className="photo-duo relative w-28 flex-none">
                <img src={s.images.thumb} alt="" />
                <span className="mono absolute left-3 top-3 z-10 text-[11px] text-ink">{pad2(i + 1)}</span>
                {visited.has(s.slug) && (
                  <span className="label absolute right-3 top-3 z-10 flex items-center gap-1 !text-[var(--acc)]">
                    <Icon name="check" size={12} stroke={2} /> visto
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[15px] font-semibold tracking-tight text-ink">{s.title}</p>
                <p className="mono mt-2 text-[12px] text-ink-2">{brl(h.netResult)}</p>
                <p className="mono text-[12px] acc">{pct(h.netRoi)}</p>
              </div>
              {cur && <span className="label absolute bottom-4 right-4 !text-[var(--acc)]">Você está aqui</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
