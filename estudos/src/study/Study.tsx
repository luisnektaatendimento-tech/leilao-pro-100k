import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { studies } from '../data/studies'
import { loadProgress, saveProgress } from '../lib/progress'
import { prefs } from '../lib/prefs'
import { sound } from '../lib/sound'
import { navigate, replacePath } from '../lib/router'
import { reducedMotion, useMedia } from '../lib/media'
import { brl, pct } from '../lib/format'
import { hero } from '../lib/derive'
import { rig } from '../three/rig'
import { enterScene, resetScene } from './reveal'
import HUD, { type Toast } from './HUD'
import Minimap from './Minimap'
import Notes from './Notes'
import PropertyScreen from './PropertyScreen'
import { StudyContext, type Ctx } from './ctx'

gsap.registerPlugin(ScrollTrigger)

const seen = () => new Set(studies.filter((s) => loadProgress(s.slug).visited.length > 0).map((s) => s.slug))

/**
 * Passagem horizontal: uma tela por imóvel.
 * A rolagem vertical vira deslocamento horizontal (Lenis + ScrollTrigger com pin).
 */
export default function Study({ slug, onReady }: { slug: string; onReady: () => void }) {
  const n = studies.length
  const startIndex = Math.max(0, studies.findIndex((s) => s.slug === slug))
  const [index, setIndex] = useState(startIndex)
  const [map, setMap] = useState(false)
  const [notes, setNotes] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [visited, setVisited] = useState(seen)
  const visitedRef = useRef(visited)
  visitedRef.current = visited

  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const hud = useRef<HTMLDivElement>(null)
  const els = useRef<(HTMLElement | null)[]>([])
  const lenisRef = useRef<Lenis | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const idx = useRef(index)
  // celular: cada imóvel rola na vertical e o swipe horizontal é nativo (scroll-snap)
  const mobile = useMedia('(max-width: 767px)')
  const mobileRef = useRef(mobile)
  mobileRef.current = mobile

  const goTo = useCallback(
    (i: number) => {
      const c = Math.max(0, Math.min(n - 1, i))
      if (mobileRef.current) {
        const sc = scroller.current
        if (!sc) return
        if (c !== idx.current) sound.click()
        sc.scrollTo({ left: c * sc.clientWidth, behavior: reducedMotion() ? 'auto' : 'smooth' })
        return
      }
      const l = lenisRef.current
      if (!l) return
      if (c !== idx.current) sound.click()
      l.scrollTo(c * innerHeight, {
        immediate: reducedMotion(),
        duration: 1.35,
        easing: (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2),
        force: true,
      })
    },
    [n],
  )

  const goHome = useCallback(() => {
    sound.click()
    navigate('/')
  }, [])

  /* ── motor de rolagem horizontal ── */
  useLayoutEffect(() => {
    document.documentElement.classList.add('study-mode')
    window.scrollTo(0, 0)
    const entered = new Array(n).fill(false)
    els.current.forEach((el) => el && resetScene(el))
    const start = idx.current

    if (mobile) {
      const sc = scroller.current!
      const onScroll = () => {
        const pos = sc.scrollLeft / Math.max(1, sc.clientWidth)
        rig.progress = pos / Math.max(1, n - 1)
        for (let i = 0; i < n; i++) {
          const el = els.current[i]
          if (!el) continue
          const ad = Math.abs(i - pos)
          if (!entered[i] && ad < 0.55) {
            entered[i] = true
            el.removeAttribute('inert')
            enterScene(el)
          } else if (entered[i] && ad > 0.995) {
            entered[i] = false
            el.setAttribute('inert', '')
            el.scrollTop = 0
            resetScene(el)
          }
        }
        const a = Math.round(pos)
        if (a !== idx.current) {
          idx.current = a
          setIndex(a)
        }
      }
      els.current.forEach((el, i) => i !== start && el?.setAttribute('inert', ''))
      sc.scrollLeft = start * sc.clientWidth
      sc.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      const r = requestAnimationFrame(() => onReady())
      return () => {
        cancelAnimationFrame(r)
        sc.removeEventListener('scroll', onScroll)
        document.documentElement.classList.remove('study-mode')
      }
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'both',
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    })
    lenisRef.current = lenis
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const update = (p: number) => {
      const pos = p * Math.max(1, n - 1)
      rig.progress = p
      hud.current?.style.setProperty('--p', String(p))
      for (let i = 0; i < n; i++) {
        const el = els.current[i]
        if (!el) continue
        const d = i - pos
        el.style.setProperty('--d', d.toFixed(4))
        const ad = Math.abs(d)
        if (!entered[i] && ad < 0.55) {
          entered[i] = true
          el.removeAttribute('inert')
          enterScene(el)
        } else if (entered[i] && ad > 0.995) {
          entered[i] = false
          el.setAttribute('inert', '')
          resetScene(el)
        }
      }
      const a = Math.round(pos)
      if (a !== idx.current) {
        idx.current = a
        setIndex(a)
      }
    }

    const tween = gsap.to(track.current, { x: () => -(n - 1) * innerWidth, ease: 'none' })
    const st = ScrollTrigger.create({
      trigger: pin.current,
      pin: true,
      start: 'top top',
      end: () => `+=${(n - 1) * innerHeight}`,
      scrub: true,
      animation: tween,
      invalidateOnRefresh: true,
      onUpdate: (self) => update(self.progress),
    })
    lenis.on('scroll', ScrollTrigger.update)

    // snap suave entre imóveis
    let snapT = 0
    lenis.on('scroll', () => {
      clearTimeout(snapT)
      snapT = window.setTimeout(() => {
        if (!prefs.get().snap || lenis.isScrolling) return
        const pos = window.scrollY / innerHeight
        const target = Math.round(pos)
        if (Math.abs(pos - target) > 0.002) goTo(target)
      }, 160)
    })

    const keep = { i: idx.current }
    const onInit = () => {
      keep.i = idx.current
    }
    const onRefresh = () => {
      lenis.resize()
      lenis.scrollTo(keep.i * innerHeight, { immediate: true, force: true })
    }
    ScrollTrigger.addEventListener('refreshInit', onInit)
    ScrollTrigger.addEventListener('refresh', onRefresh)

    els.current.forEach((el, i) => i !== start && el?.setAttribute('inert', ''))
    lenis.resize()
    window.scrollTo(0, start * innerHeight)
    lenis.scrollTo(start * innerHeight, { immediate: true, force: true })
    ScrollTrigger.update()
    update(start / Math.max(1, n - 1))
    const r = requestAnimationFrame(() => onReady())

    return () => {
      cancelAnimationFrame(r)
      clearTimeout(snapT)
      ScrollTrigger.removeEventListener('refreshInit', onInit)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      st.kill(true)
      tween.kill()
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
      document.documentElement.classList.remove('study-mode')
      window.scrollTo(0, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile])

  /* ── URL por imóvel, visita e "desbloqueio" ── */
  useEffect(() => {
    const s = studies[index]
    replacePath(`/estudo/${s.slug}`)
    document.title = `${s.title} · PJK Invest`
    const t = window.setTimeout(() => {
      if (visitedRef.current.has(s.slug)) return
      const p = loadProgress(s.slug)
      saveProgress(s.slug, { ...p, visited: [0] })
      sound.unlock()
      const h = hero(s)
      setToast({ id: s.slug + Date.now(), value: `${s.title}`, label: `Lucro líquido ${brl(h.netResult)} · ${s.roiLabel} ${pct(h.netRoi)}` })
      setVisited((v) => new Set(v).add(s.slug))
    }, 900)
    return () => clearTimeout(t)
  }, [index])

  /* ── teclado e swipe ── */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      const i = idx.current
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) {
        e.preventDefault()
        goTo(i + 1)
      } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) {
        e.preventDefault()
        goTo(i - 1)
      } else if (k === 'Home') goTo(0)
      else if (k === 'End') goTo(n - 1)
      else if (k.toLowerCase() === 'm') setMap((m) => !m)
      else if (k.toLowerCase() === 'p') prefs.toggle('presenter')
      else if (k.toLowerCase() === 's') prefs.toggle('snap')
      else if (k.toLowerCase() === 'n') setNotes(true)
      else if (k === 'Escape' || k.toLowerCase() === 'h') goHome()
    }
    const up = (e: KeyboardEvent) => e.key.toLowerCase() === 'n' && setNotes(false)
    let sx = 0, sy = 0
    const ts = (e: TouchEvent) => {
      sx = e.touches[0].clientX
      sy = e.touches[0].clientY
    }
    const te = (e: TouchEvent) => {
      if (mobileRef.current) return // no celular o swipe é nativo
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) goTo(idx.current + (dx < 0 ? 1 : -1))
    }
    addEventListener('keydown', down)
    addEventListener('keyup', up)
    addEventListener('touchstart', ts, { passive: true })
    addEventListener('touchend', te, { passive: true })
    return () => {
      removeEventListener('keydown', down)
      removeEventListener('keyup', up)
      removeEventListener('touchstart', ts)
      removeEventListener('touchend', te)
      prefs.set({ presenter: false })
    }
  }, [goTo, goHome, n])

  /* ── easter egg: todos os imóveis vistos ── */
  const complete = visited.size >= n
  useEffect(() => {
    rig.celebrate = complete ? 1 : 0
  }, [complete])

  // parallax de ponteiro
  useEffect(() => {
    let raf = 0
    const mv = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        pin.current?.style.setProperty('--px', ((e.clientX / innerWidth) * 2 - 1).toFixed(3))
        pin.current?.style.setProperty('--py', ((e.clientY / innerHeight) * 2 - 1).toFixed(3))
      })
    }
    addEventListener('pointermove', mv, { passive: true })
    return () => removeEventListener('pointermove', mv)
  }, [])

  const ctx: Ctx = { index, goTo, visited, complete, goHome }

  return (
    <StudyContext.Provider value={ctx}>
      {mobile ? (
        <div ref={scroller} className="fixed inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none]">
          {studies.map((s, i) => (
            <section
              key={s.slug}
              ref={(el) => (els.current[i] = el)}
              className={mobile ? 'scene-m' : 'scene'}
              aria-roledescription="imóvel"
              aria-label={`Imóvel ${i + 1} de ${n}: ${s.fullTitle}`}
              aria-hidden={i !== index}
            >
              <PropertyScreen study={s} no={i + 1} total={n} />
            </section>
          ))}
        </div>
      ) : (
        <div ref={pin} className="relative h-[100dvh] w-screen overflow-hidden">
          <div ref={track} className="flex h-full will-change-transform" style={{ width: `${n * 100}vw` }}>
            {studies.map((s, i) => (
              <section
                key={s.slug}
                ref={(el) => (els.current[i] = el)}
                className={mobile ? 'scene-m' : 'scene'}
                aria-roledescription="imóvel"
                aria-label={`Imóvel ${i + 1} de ${n}: ${s.fullTitle}`}
                aria-hidden={i !== index}
              >
                <PropertyScreen study={s} no={i + 1} total={n} />
              </section>
            ))}
          </div>
        </div>
      )}
      <HUD ref={hud} onMap={() => setMap(true)} toast={toast} />
      <Minimap open={map} onClose={() => setMap(false)} />
      <Notes open={notes} />
    </StudyContext.Provider>
  )
}
