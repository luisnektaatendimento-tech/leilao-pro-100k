import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { navigate } from '../lib/router'
import { reducedMotion } from '../lib/media'
import { rig } from '../three/rig'

export interface Dive {
  slug: string
  photo: string
  thumb: string
  rect: DOMRect
}

/**
 * Transição cinematográfica: a carta se expande até virar a capa do estudo
 * enquanto a câmera 3D "mergulha". A capa usa a mesma foto e tratamento,
 * então o corte é invisível.
 */
export default function DiveOverlay({ dive, release, onGone }: { dive: Dive; release: boolean; onGone: () => void }) {
  const el = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const r = dive.rect
    const node = el.current!
    const rm = reducedMotion()
    gsap.set(node, { left: r.left, top: r.top, width: r.width, height: r.height, borderRadius: 18 })
    const tl = gsap.timeline({ onComplete: () => navigate(`/estudo/${dive.slug}`) })
    tl.to(rig, { dive: 1, duration: rm ? 0 : 1.25, ease: 'expo.inOut' }, 0)
    // destino: a coluna da foto na tela do imóvel (esquerda no desktop, topo no celular)
    const wide = innerWidth >= 768
    const target = wide ? { width: innerWidth * 0.42, height: innerHeight } : { width: innerWidth, height: innerHeight * 0.34 }
    tl.to(node, { left: 0, top: 0, ...target, borderRadius: 0, duration: rm ? 0.2 : 1.15, ease: 'expo.inOut' }, rm ? 0 : 0.1)
    tl.fromTo(node.querySelectorAll('img'), { scale: 1.12 }, { scale: 1, duration: 1.25, ease: 'expo.inOut' }, 0)
    return () => {
      tl.kill()
    }
  }, [dive])

  useEffect(() => {
    if (!release) return
    rig.dive = 0
    const t = gsap.to(el.current, { opacity: 0, duration: 0.9, delay: 0.15, ease: 'power2.out', onComplete: onGone })
    return () => {
      t.kill()
    }
  }, [release, onGone])

  return (
    <div ref={el} className="photo-duo z-50" style={{ position: 'fixed', pointerEvents: 'none' }} aria-hidden>
      {/* a miniatura já está em cache; a foto em alta entra por cima assim que carrega */}
      <img src={dive.thumb} alt="" />
      <img src={dive.photo} alt="" className="absolute inset-0 opacity-0 transition-opacity duration-500" onLoad={(e) => (e.currentTarget.style.opacity = '1')} />
    </div>
  )
}
