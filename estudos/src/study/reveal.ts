import gsap from 'gsap'
import { formatBy, type Fmt } from '../lib/format'
import { reducedMotion } from '../lib/media'

/**
 * Motor de entrada das cenas.
 * Marque elementos no JSX e a cena anima sozinha quando entra:
 *   data-reveal="up|z|fade|line|word|draw"   data-delay="0.2"
 *   data-count="45896.16" data-fmt="brl"      (contador)
 *   data-grow="y|x"                           (barras que se constroem)
 */

const hidden = (el: HTMLElement) => {
  const k = el.dataset.reveal
  switch (k) {
    case 'z':
      return { z: -600, opacity: 0, filter: 'blur(12px)' }
    case 'fade':
      return { opacity: 0 }
    case 'line':
      return { scaleX: 0, transformOrigin: '0% 50%' }
    case 'word':
      return { yPercent: 115 }
    case 'draw':
      return { strokeDashoffset: 1 }
    default:
      return { y: 40, opacity: 0, filter: 'blur(6px)' }
  }
}
const counters = new WeakMap<HTMLElement, gsap.core.Tween>()
const shownFor = (k?: string) => {
  switch (k) {
    case 'z':
      return { z: 0, opacity: 1, filter: 'blur(0px)' }
    case 'fade':
      return { opacity: 1 }
    case 'line':
      return { scaleX: 1 }
    case 'word':
      return { yPercent: 0 }
    case 'draw':
      return { strokeDashoffset: 0 }
    default:
      return { y: 0, opacity: 1, filter: 'blur(0px)' }
  }
}

export function resetScene(root: HTMLElement) {
  if (reducedMotion()) return
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.killTweensOf(el)
    gsap.set(el, hidden(el))
  })
  root.querySelectorAll<HTMLElement>('[data-grow]').forEach((el) => {
    gsap.killTweensOf(el)
    gsap.set(el, el.dataset.grow === 'x' ? { scaleX: 0, transformOrigin: '0% 50%' } : { scaleY: 0, transformOrigin: '50% 100%' })
  })
  root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    counters.get(el)?.kill()
    el.textContent = formatBy((el.dataset.fmt as Fmt) || 'int', 0)
  })
}

export function enterScene(root: HTMLElement) {
  const rm = reducedMotion()
  const base = 0.15
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
    const d = el.dataset.delay !== undefined ? Number(el.dataset.delay) : i * 0.06
    if (rm) return void gsap.set(el, shownFor(el.dataset.reveal))
    const k = el.dataset.reveal
    gsap.to(el, {
      ...shownFor(k),
      duration: k === 'z' ? 1.5 : k === 'draw' ? 1.2 : k === 'line' ? 1.4 : 1.1,
      ease: k === 'draw' ? 'power2.inOut' : 'expo.out',
      delay: base + d,
      ...(k === 'z' || k === 'up' || !k ? { clearProps: 'filter' } : {}),
    })
  })
  root.querySelectorAll<HTMLElement>('[data-grow]').forEach((el, i) => {
    const d = el.dataset.delay !== undefined ? Number(el.dataset.delay) : 0.3 + i * 0.08
    if (rm) return void gsap.set(el, { scaleX: 1, scaleY: 1 })
    gsap.to(el, { scaleX: 1, scaleY: 1, duration: 1.4, ease: 'expo.out', delay: base + d })
  })
  root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const v = Number(el.dataset.count)
    const fmt = (el.dataset.fmt as Fmt) || 'int'
    if (rm) return void (el.textContent = formatBy(fmt, v))
    const o = { v: 0 }
    const d = el.dataset.delay !== undefined ? Number(el.dataset.delay) : 0.25
    counters.get(el)?.kill()
    // nunca deixa um valor "quase certo" parado na tela: perto do fim, crava o valor exato
    const tw: gsap.core.Tween = gsap.to(o, {
      v,
      duration: 1.3,
      ease: 'power3.out',
      delay: base + d,
      onUpdate: () => {
        el.textContent = formatBy(fmt, tw.progress() > 0.9 ? v : o.v)
      },
      onComplete: () => {
        el.textContent = formatBy(fmt, v)
      },
    })
    counters.set(el, tw)
  })
}
