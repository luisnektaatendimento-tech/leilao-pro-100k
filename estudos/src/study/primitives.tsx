import type { ReactNode } from 'react'
import { formatBy, type Fmt } from '../lib/format'

/** Título dividido em palavras que sobem de uma máscara. */
export function Words({ text, delay = 0, step = 0.06, className = '' }: { text: string; delay?: number; step?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="word" aria-hidden>
          <span data-reveal="word" data-delay={delay + i * step}>
            {w}
          </span>
          {' '}
        </span>
      ))}
    </span>
  )
}

/** Número com contador animado. O valor final fica no aria-label. */
export function Count({ value, fmt, delay, className = '' }: { value: number; fmt: Fmt; delay?: number; className?: string }) {
  const final = formatBy(fmt, value)
  return (
    <span className={className} role="text" aria-label={final}>
      <span aria-hidden data-count={value} data-fmt={fmt} data-delay={delay}>
        {final}
      </span>
    </span>
  )
}

export function Label({ children, className = '', delay }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <p className={`label ${className}`} data-reveal="fade" data-delay={delay}>
      {children}
    </p>
  )
}

/** Prisma 3D em CSS (frente, topo e lateral). */
export function Prism({ h, w = 64, depth = 36, acc = false, delay }: { h: number; w?: number; depth?: number; acc?: boolean; delay?: number }) {
  return (
    <div
      className={`prism ${acc ? 'is-acc' : ''}`}
      style={{ height: h, width: w, ['--depth' as string]: `${depth}px` }}
      data-grow="y"
      data-delay={delay}
    >
      <i className="pf" />
      <i className="pt" />
      <i className="ps" />
    </div>
  )
}

export function SceneShell({ children, label, className = '' }: { children: ReactNode; label: string; className?: string }) {
  return (
    <div className={`relative h-full w-full ${className}`} aria-label={label}>
      {children}
    </div>
  )
}
