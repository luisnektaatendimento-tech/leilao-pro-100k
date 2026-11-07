import { useEffect, useRef } from 'react'
import { isCoarse } from '../lib/media'

/** Cursor minimalista: ponto + anel com inércia, cresce sobre elementos interativos. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isCoarse()) return
    document.documentElement.classList.add('has-cursor')
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0, shown = false
    const sel = 'a,button,[role="button"],[data-cursor],input,label'
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!shown) {
        shown = true
        rx = x
        ry = y
        dot.current!.style.opacity = ring.current!.style.opacity = '1'
      }
      const t = e.target as Element | null
      ring.current!.classList.toggle('is-hover', !!t?.closest?.(sel))
    }
    const down = () => ring.current!.classList.add('is-down')
    const up = () => ring.current!.classList.remove('is-down')
    const leave = () => {
      shown = false
      dot.current!.style.opacity = ring.current!.style.opacity = '0'
    }
    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      dot.current!.style.transform = `translate3d(${x}px,${y}px,0)`
      ring.current!.style.transform = `translate3d(${rx}px,${ry}px,0)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    addEventListener('pointermove', move)
    addEventListener('pointerdown', down)
    addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', move)
      removeEventListener('pointerdown', down)
      removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])
  if (typeof window !== 'undefined' && isCoarse()) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" style={{ opacity: 0 }} aria-hidden />
      <div ref={dot} className="cursor-dot" style={{ opacity: 0 }} aria-hidden />
    </>
  )
}
