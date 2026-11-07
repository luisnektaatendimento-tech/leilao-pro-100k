import { useEffect, useState } from 'react'

const mq = (q: string) => (typeof window !== 'undefined' ? window.matchMedia(q) : null)

export function useMedia(q: string) {
  const [v, setV] = useState(() => !!mq(q)?.matches)
  useEffect(() => {
    const m = mq(q)
    if (!m) return
    const on = () => setV(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return v
}

export const reducedMotion = () => !!mq('(prefers-reduced-motion: reduce)')?.matches
export const isCoarse = () => !!mq('(pointer: coarse)')?.matches
/** Celular/tablet ou movimento reduzido: 3D vira fallback 2D. */
export const lite = () => reducedMotion() || isCoarse() || window.innerWidth < 820
