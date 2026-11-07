import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import type { Study as StudyT } from '../data/types'
import { studies } from '../data/studies'
import { buildScenes } from '../lib/scenes'
import { loadProgress, saveProgress } from '../lib/progress'
import { prefs } from '../lib/prefs'
import { sound } from '../lib/sound'
import { navigate } from '../lib/router'
import { reducedMotion } from '../lib/media'
import { rig } from '../three/rig'
import { enterScene, resetScene } from './reveal'
import HUD, { type Toast } from './HUD'
import Minimap from './Minimap'
import Notes from './Notes'
import SceneView from './scenes'
import { StudyContext, type Ctx } from './ctx'

gsap.registerPlugin(ScrollTrigger)

const fromHash = (n: number) => {
  const m = location.hash.match(/cena-(\d+)/)
  return m ? Math.min(n - 1, Math.max(0, Number(m[1]) - 1)) : 0
}

export default function Study({ study, onReady }: { study: StudyT; onReady: () => void }) {
  const scenes = useMemo(() => buildScenes(study), [study])
  const n = scenes.length
  const [index, setIndex] = useState(() => fromHash(n))
  const [map, setMap] = useState(false)
  const [notes, setNotes] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const saved = useMemo(() => loadProgress(study.slug), [study.slug])
  const [visited, setVisited] = useState(() => new Set(saved.visited))
  const [unlocked, setUnlocked] = useState(() => new Set(saved.insights))
  const unlockedRef = useRef(unlocked)
  unlockedRef.current = unlocked

  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const hud = useRef<HTMLDivElement>(null)
  const els = useRef<(HTMLElement | null)[]>([])
  const lenisRef = useRef<Lenis | null>(null)
  const idx = useRef(index)
  const t0 = useRef(performance.now())
  const base = useRef(saved.timeMs)

  const elapsed = useCallback(() => base.current + performance.now() - t0.current, [])
  const next = studies[(studies.findIndex((s) => s.slug === study.slug) + 1) % studies.length]

  const goTo = useCallback(
    (i: number, immediate = false) => {
      const c = Math.max(0, Math.min(n - 1, i))
      const l = lenisRef.current
      if (!l) return
      if (c !== idx.current && !immediate) sound.click()
      l.scrollTo(c * innerHeight, {
        immediate: immediate || reducedMotion(),
        duration: 1.25,
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
    document.title = `${study.title} · PJK Invest`
    window.scrollTo(0, 0)
    const entered = new Array(n).fill(false)
    els.current.forEach((el) => el && resetScene(el))

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
      const pos = p * (n - 1)
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

    // snap suave (próprio, via Lenis, para não brigar com a suavização)
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

    // mantém a cena atual após resize
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

    // deep link
    const start = fromHash(n)
    els.current.forEach((el, i) => i !== start && el?.setAttribute('inert', ''))
    // o Lenis mede a página de forma assíncrona; força a medição depois do pin
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
  }, [n, study, goTo, onReady])

  /* ── hash, visitas e insights ── */
  useEffect(() => {
    history.replaceState(null, '', `${location.pathname}#cena-${index + 1}`)
    const s = scenes[index]
    const t = window.setTimeout(() => {
      setVisited((v) => (v.has(index) ? v : new Set(v).add(index)))
      if (s.insight && !unlockedRef.current.has(s.id)) {
        sound.unlock()
        setToast({ id: s.id + Date.now(), value: s.insight.value, label: s.insight.label })
        setUnlocked((u) => new Set(u).add(s.id))
      }
    }, 700)
    return () => clearTimeout(t)
  }, [index, scenes])

  useEffect(() => {
    saveProgress(study.slug, { visited: [...visited], insights: [...unlocked], timeMs: elapsed() })
  }, [visited, unlocked, study.slug, elapsed])

  useEffect(() => {
    const save = () => saveProgress(study.slug, { visited: [...visited], insights: [...unlocked], timeMs: elapsed() })
    const iv = window.setInterval(save, 5000)
    return () => {
      clearInterval(iv)
      save()
    }
  }, [visited, unlocked, study.slug, elapsed])

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
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) goTo(idx.current + (dx < 0 ? 1 : -1))
    }
    const onHash = () => goTo(fromHash(n))
    addEventListener('hashchange', onHash)
    addEventListener('keydown', down)
    addEventListener('keyup', up)
    addEventListener('touchstart', ts, { passive: true })
    addEventListener('touchend', te, { passive: true })
    return () => {
      removeEventListener('hashchange', onHash)
      removeEventListener('keydown', down)
      removeEventListener('keyup', up)
      removeEventListener('touchstart', ts)
      removeEventListener('touchend', te)
      prefs.set({ presenter: false })
    }
  }, [goTo, goHome, n])

  /* ── easter egg: 100% ── */
  const insightTotal = scenes.filter((s) => s.insight).length
  const complete = visited.size >= n && unlocked.size >= insightTotal
  useEffect(() => {
    rig.celebrate = complete && index === n - 1 ? 1 : 0
  }, [complete, index, n])

  // parallax de ponteiro para os gráficos 3D
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

  const ctx: Ctx = { study, scenes, index, goTo, visited, unlocked, elapsed, next, goHome }

  return (
    <StudyContext.Provider value={ctx}>
      <div ref={pin} className="relative h-[100dvh] w-screen overflow-hidden">
        <div ref={track} className="flex h-full will-change-transform" style={{ width: `${n * 100}vw` }}>
          {scenes.map((s, i) => (
            <section
              key={s.id}
              data-scene={i + 1}
              ref={(el) => (els.current[i] = el)}
              className="scene"
              aria-roledescription="cena"
              aria-label={`Cena ${i + 1} de ${n}: ${s.title}`}
              aria-hidden={i !== index}
            >
              <SceneView scene={s} i={i} complete={complete} />
            </section>
          ))}
        </div>
      </div>
      <HUD ref={hud} onMap={() => setMap(true)} toast={toast} insightTotal={insightTotal} />
      <Minimap open={map} onClose={() => setMap(false)} />
      <Notes open={notes} />
    </StudyContext.Provider>
  )
}
