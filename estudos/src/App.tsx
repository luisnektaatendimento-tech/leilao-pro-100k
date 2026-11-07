import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import Cursor from './components/Cursor'
import HelpOverlay from './components/HelpOverlay'
import Home from './home/Home'
import DiveOverlay, { type Dive } from './home/DiveOverlay'
import { getStudy } from './data/studies'
import { lite } from './lib/media'
import { prefs, usePrefs } from './lib/prefs'
import { useRoute } from './lib/router'
import { ACCENTS, rig } from './three/rig'

const Backdrop = lazy(() => import('./three/Backdrop'))
const Study = lazy(() => import('./study/Study'))

export default function App() {
  const route = useRoute()
  const p = usePrefs()
  const [dive, setDive] = useState<Dive | null>(null)
  const [diveDone, setDiveDone] = useState(false)
  const [help, setHelp] = useState(false)
  const [use3D] = useState(() => !lite())

  useEffect(() => {
    rig.accent = ACCENTS[p.accent]
  }, [p.accent])

  // atalhos globais
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.target as HTMLElement)?.closest?.('input,textarea')) return
      const k = e.key.toLowerCase()
      if (k === 't') prefs.cycleAccent()
      else if (k === 'a') prefs.toggle('sound')
      else if (e.key === '?') setHelp((h) => !h)
      else if (k === 'f') {
        if (document.fullscreenElement) document.exitFullscreen?.()
        else document.documentElement.requestFullscreen?.().catch(() => {})
      }
    }
    const onMove = (e: PointerEvent) => {
      rig.mouse.x = (e.clientX / innerWidth) * 2 - 1
      rig.mouse.y = (e.clientY / innerHeight) * 2 - 1
    }
    addEventListener('keydown', onKey)
    addEventListener('pointermove', onMove, { passive: true })
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('pointermove', onMove)
    }
  }, [])

  useEffect(() => {
    rig.mode = route.name === 'study' ? 'study' : 'home'
    if (route.name === 'home') {
      rig.celebrate = 0
      document.title = 'Estudos · PJK Invest'
    }
  }, [route])

  const onReady = useCallback(() => setDiveDone(true), [])
  const study = route.name === 'study' ? getStudy(route.slug) : undefined

  return (
    <>
      {use3D ? (
        <Suspense fallback={<div className="backdrop-2d" />}>
          <Backdrop />
        </Suspense>
      ) : (
        <div className="backdrop-2d" aria-hidden />
      )}
      <div className="vignette" aria-hidden />

      <main className="relative z-10">
        {study ? (
          <Suspense fallback={null}>
            <Study key={study.slug} study={study} onReady={onReady} />
          </Suspense>
        ) : (
          <Home
            diving={!!dive}
            onOpen={(d) => {
              setDiveDone(false)
              setDive(d)
            }}
            onHelp={() => setHelp(true)}
          />
        )}
      </main>

      {dive && <DiveOverlay dive={dive} release={diveDone} onGone={() => setDive(null)} />}
      <HelpOverlay open={help} onClose={() => setHelp(false)} />
      <div className="grain" aria-hidden />
      <Cursor />
    </>
  )
}
