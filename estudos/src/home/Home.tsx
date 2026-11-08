import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { company, studies } from '../data/studies'
import { statusOf, type Status } from '../lib/progress'
import { isCoarse, reducedMotion } from '../lib/media'
import { sound } from '../lib/sound'
import { Brand } from '../components/Brand'
import { HelpButton, SoundButton } from '../components/Prefs'
import { Icon } from '../components/Icon'
import StudyCard from './StudyCard'
import type { Dive } from './DiveOverlay'

export default function Home({ diving, onOpen, onHelp }: { diving: boolean; onOpen: (d: Dive) => void; onHelp: () => void }) {
  const items = useMemo(
    () =>
      studies.map((s) => {
        return { study: s, status: statusOf(s.slug, 1) as Status }
      }),
    [],
  )
  const [focus, setFocus] = useState(0)
  const [w, setW] = useState(() => innerWidth)
  const pos = useRef({ f: 0 })
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const root = useRef<HTMLDivElement>(null)
  const touch = isCoarse() || w < 820
  const keyed = useRef(false)

  useEffect(() => {
    const r = () => setW(innerWidth)
    addEventListener('resize', r)
    window.scrollTo(0, 0)
    return () => removeEventListener('resize', r)
  }, [])

  // layout em arco (desktop)
  const cardW = Math.min(300, Math.max(220, w * 0.18))
  const layout = (f: number) => {
    if (touch) return
    const R = 1600
    const step = (cardW * 1.24) / R
    cards.current.forEach((el, i) => {
      if (!el) return
      const o = i - f
      const a = o * step
      const x = Math.sin(a) * R
      const z = (Math.cos(a) - 1) * R
      const fade = Math.max(0, 1 - Math.max(0, Math.abs(o) - 2.2) * 0.8)
      el.style.transform = `translate3d(calc(-50% + ${x}px), -50%, ${z}px) rotateY(${(-a * 180) / Math.PI}deg)`
      el.style.opacity = String(fade)
      el.style.zIndex = String(100 - Math.round(Math.abs(o) * 10))
    })
  }

  // centra o arco nos estudos
  const center = (items.length - 1) / 2
  useLayoutEffect(() => {
    pos.current.f = center
    layout(center)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, touch])

  useEffect(() => {
    if (touch) return
    const target = !keyed.current ? center : items.length <= 5 ? center + (focus - center) * 0.35 : focus
    const t = gsap.to(pos.current, { f: target, duration: reducedMotion() ? 0 : 1.1, ease: 'expo.out', onUpdate: () => layout(pos.current.f) })
    return () => {
      t.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, touch, w])

  // entrada
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-in]', { y: 30, opacity: 0, filter: 'blur(8px)', duration: 1.4, ease: 'expo.out', stagger: 0.07, delay: 0.15 })
      gsap.from('.mono-card .float, .card-row > *', { y: 120, rotateX: -18, opacity: 0, duration: 1.6, ease: 'expo.out', stagger: 0.09, delay: 0.35 })
    }, root)
    return () => ctx.revert()
  }, [])

  // teclado
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (diving) return
      if (e.key === 'ArrowRight') setFocus((f) => Math.min(items.length - 1, f + 1))
      else if (e.key === 'ArrowLeft') setFocus((f) => Math.max(0, f - 1))
      else return
      sound.click()
      keyed.current = true
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [diving, items.length])

  useEffect(() => {
    if (!keyed.current) return
    document.querySelectorAll<HTMLButtonElement>('[data-card-btn]')[focus]?.focus({ preventScroll: true })
  }, [focus])

  const open = (i: number, rect: DOMRect) => {
    if (diving) return
    sound.click()
    onOpen({ slug: items[i].study.slug, photo: items[i].study.images.photo, thumb: items[i].study.images.thumb, rect })
  }

  return (
    <div ref={root} className="touch relative min-h-[100dvh] overflow-hidden">
      <header className="m-bar fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 md:px-10 md:py-4" style={{ opacity: diving ? 0 : 1, transition: 'opacity .6s' }}>
        <span data-in>
          <Brand />
        </span>
        <div className="flex items-center gap-2" data-in>
          <span className="fx-pill fx-gray mr-1 hidden h-9 px-3.5 text-[13px] sm:inline-flex">
            <span className="h-2 w-2 rounded-full" style={{ background: 'var(--acc)', boxShadow: '0 0 0 3px rgb(var(--acc-rgb) / .2)' }} />
            <b className="mono font-bold">{items.length}</b> <span className="font-normal text-ink-2">estudos</span>
          </span>
          <SoundButton />
          <HelpButton onClick={onHelp} />
        </div>
      </header>

      <section
        className="relative z-10 flex min-h-[100dvh] flex-col"
        style={{ opacity: diving ? 0 : 1, transition: 'opacity .7s cubic-bezier(.16,1,.3,1)' }}
        aria-label="Estudos"
      >
        <div className="px-4 pt-24 md:px-10 md:pt-[17vh]">
          <p className="label flex items-center gap-2 !text-ink-2" data-in>
            <span className="acc"><Icon name="bolt" size={12} stroke={2} /></span> Estudos de oportunidade · Fortaleza, CE
          </p>
          <h1 className="display mt-4 text-[clamp(3.2rem,min(7.4vw,13vh),8rem)]" data-in>
            Ver <span className="text-ink-2">estudos.</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-2" data-in>
            {company.tagline}. Escolha um estudo para começar a apresentação.
          </p>
        </div>

        {/* grade de estudos: escala para qualquer quantidade */}
        <div className="card-row mt-8 grid gap-4 px-4 pb-14 sm:grid-cols-2 md:mt-12 md:gap-5 md:px-10 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it, i) => (
            <div key={it.study.slug}>
              <StudyCard {...it} index={i} width={0} onOpen={(r) => open(i, r)} onHover={() => setFocus(i)} />
            </div>
          ))}
        </div>

        {!touch && (
          <footer className="flex items-center justify-between px-10 pb-8" data-in>
            <span className="label flex items-center gap-2">
              <kbd className="kbd">Tab</kbd> navegar
              <kbd className="kbd ml-3">Enter</kbd> abrir
              <kbd className="kbd ml-3">?</kbd> atalhos
            </span>
            <span className="label">Confidencial · uso exclusivo do destinatário</span>
          </footer>
        )}
      </section>
    </div>
  )
}
