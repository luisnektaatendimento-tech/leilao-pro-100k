import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { studies } from '../data/studies'
import { loadProgress, saveProgress } from '../lib/progress'
import { prefs } from '../lib/prefs'
import { sound } from '../lib/sound'
import { navigate, replacePath } from '../lib/router'
import { reducedMotion } from '../lib/media'
import { brl, pct } from '../lib/format'
import { hero } from '../lib/derive'
import { rig } from '../three/rig'
import { enterScene, resetScene } from './reveal'
import HUD, { type Toast } from './HUD'
import Minimap from './Minimap'
import Notes from './Notes'
import PropertyPanel, { PanelBackdrop } from './PropertyPanel'
import { StudyContext, type Ctx } from './ctx'

const seen = () => new Set(studies.filter((s) => loadProgress(s.slug).visited.length > 0).map((s) => s.slug))

/** O elemento (ou um ancestral até o painel) ainda pode rolar nessa direção? */
function canScroll(target: EventTarget | null, dy: number) {
  let el = target as HTMLElement | null
  while (el && !el.classList?.contains('panel-shell')) {
    const st = getComputedStyle(el)
    if (/(auto|scroll)/.test(st.overflowY) && el.scrollHeight > el.clientHeight + 1) {
      if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true
    }
    el = el.parentElement
  }
  return false
}

/**
 * Painel único: um display grande e fixo; ao trocar de imóvel o conteúdo sai e entra
 * com uma transição cinematográfica (nada desliza para os lados).
 */
export default function Study({ slug, onReady }: { slug: string; onReady: () => void }) {
  const n = studies.length
  const [index, setIndex] = useState(() => Math.max(0, studies.findIndex((s) => s.slug === slug)))
  const [map, setMap] = useState(false)
  const [notes, setNotes] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [visited, setVisited] = useState(seen)
  const visitedRef = useRef(visited)
  visitedRef.current = visited

  const stage = useRef<HTMLDivElement>(null)
  const hud = useRef<HTMLDivElement>(null)
  const idx = useRef(index)
  const busy = useRef(false)
  const dir = useRef(1)
  const first = useRef(true)

  const goTo = useCallback(
    (i: number) => {
      const c = Math.max(0, Math.min(n - 1, i))
      if (c === idx.current || busy.current) return
      busy.current = true
      dir.current = c > idx.current ? 1 : -1
      sound.click()
      const el = stage.current
      const done = () => {
        idx.current = c
        setIndex(c)
      }
      if (!el || reducedMotion()) return done()
      gsap.to(el, { opacity: 0, x: -40 * dir.current, scale: 0.985, filter: 'blur(10px)', duration: 0.32, ease: 'power2.in', onComplete: done })
    },
    [n],
  )

  const goHome = useCallback(() => {
    sound.click()
    navigate('/')
  }, [])

  /* ── entrada do painel a cada troca de imóvel ── */
  useLayoutEffect(() => {
    const el = stage.current!
    const s = studies[index]
    rig.progress = index / Math.max(1, n - 1)
    replacePath(`/estudo/${s.slug}`)
    document.title = `${s.title} · PJK Invest`
    el.scrollTop = 0
    el.querySelector('.panel')?.scrollTo?.(0, 0)
    resetScene(el)
    if (reducedMotion()) {
      gsap.set(el, { opacity: 1, x: 0, scale: 1, filter: 'none' })
      enterScene(el)
      busy.current = false
    } else {
      gsap.fromTo(
        el,
        { opacity: 0, x: first.current ? 0 : 50 * dir.current, scale: first.current ? 1 : 1.015, filter: 'blur(10px)' },
        { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: 0.75, ease: 'expo.out', clearProps: 'filter', onComplete: () => (busy.current = false) },
      )
      enterScene(el)
    }
    if (first.current) {
      first.current = false
      requestAnimationFrame(() => onReady())
    }
  }, [index, n, onReady])

  useEffect(() => {
    document.documentElement.classList.add('study-mode')
    return () => document.documentElement.classList.remove('study-mode')
  }, [])

  /* ── visita e "desbloqueio" ── */
  useEffect(() => {
    const s = studies[index]
    const t = window.setTimeout(() => {
      if (visitedRef.current.has(s.slug)) return
      const p = loadProgress(s.slug)
      saveProgress(s.slug, { ...p, visited: [0] })
      sound.unlock()
      const h = hero(s)
      setToast({ id: s.slug + Date.now(), value: s.title, label: `Lucro líquido ${brl(h.netResult)} · ${s.roiLabel} ${pct(h.netRoi)}` })
      setVisited((v) => new Set(v).add(s.slug))
    }, 900)
    return () => clearTimeout(t)
  }, [index])

  /* ── teclado, roda do mouse e swipe ── */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      const i = idx.current
      if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) {
        e.preventDefault()
        goTo(i + 1)
      } else if (k === 'ArrowLeft' || k === 'PageUp' || (k === ' ' && e.shiftKey)) {
        e.preventDefault()
        goTo(i - 1)
      } else if (k === 'Home') goTo(0)
      else if (k === 'End') goTo(n - 1)
      else if (k.toLowerCase() === 'm') setMap((m) => !m)
      else if (k.toLowerCase() === 'p') prefs.toggle('presenter')
      else if (k.toLowerCase() === 'n') setNotes(true)
      else if (k === 'Escape' || k.toLowerCase() === 'h') goHome()
    }
    const up = (e: KeyboardEvent) => e.key.toLowerCase() === 'n' && setNotes(false)

    // roda/trackpad: um gesto = um imóvel
    let acc = 0
    let lockUntil = 0
    let resetT = 0
    const wheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && canScroll(e.target, e.deltaY)) return
      e.preventDefault()
      const now = performance.now()
      clearTimeout(resetT)
      resetT = window.setTimeout(() => (acc = 0), 180)
      if (now < lockUntil) return
      acc += d
      if (Math.abs(acc) > 60) {
        goTo(idx.current + (acc > 0 ? 1 : -1))
        acc = 0
        lockUntil = now + 900
      }
    }

    let sx = 0, sy = 0
    const ts = (e: TouchEvent) => {
      sx = e.touches[0].clientX
      sy = e.touches[0].clientY
    }
    const te = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) goTo(idx.current + (dx < 0 ? 1 : -1))
    }
    addEventListener('keydown', down)
    addEventListener('keyup', up)
    addEventListener('wheel', wheel, { passive: false })
    addEventListener('touchstart', ts, { passive: true })
    addEventListener('touchend', te, { passive: true })
    return () => {
      removeEventListener('keydown', down)
      removeEventListener('keyup', up)
      removeEventListener('wheel', wheel)
      removeEventListener('touchstart', ts)
      removeEventListener('touchend', te)
      clearTimeout(resetT)
      prefs.set({ presenter: false })
    }
  }, [goTo, goHome, n])

  /* ── easter egg: todos os imóveis vistos ── */
  const complete = visited.size >= n
  useEffect(() => {
    rig.celebrate = complete ? 1 : 0
  }, [complete])

  const ctx: Ctx = { index, goTo, visited, complete, goHome }
  const s = studies[index]

  return (
    <StudyContext.Provider value={ctx}>
      <PanelBackdrop key={s.slug} study={s} />
      <div
        ref={stage}
        className="fixed inset-0 z-10"
        role="region"
        aria-roledescription="imóvel"
        aria-label={`Imóvel ${index + 1} de ${n}: ${s.fullTitle}`}
        aria-live="polite"
      >
        <PropertyPanel key={s.slug} study={s} no={index + 1} total={n} />
      </div>
      <HUD ref={hud} onMap={() => setMap(true)} toast={toast} />
      <Minimap open={map} onClose={() => setMap(false)} />
      <Notes open={notes} />
    </StudyContext.Provider>
  )
}
