import { useRef } from 'react'
import type { Study } from '../data/types'
import type { Status } from '../lib/progress'
import { brl, dateShort, pct } from '../lib/format'
import { discountPct, hero } from '../lib/derive'
import { Icon } from '../components/Icon'

interface Props {
  study: Study
  status: Status
  index: number
  width: number
  onOpen: (rect: DOMRect) => void
  onHover: () => void
}

function StatusChip({ status }: { status: Status }) {
  if (status.state === 'explorado')
    return (
      <span className="fx-pill fx-tinted px-2.5 py-1 text-[11px]">
        <Icon name="check" size={12} stroke={2.2} /> Explorado
      </span>
    )
  return (
    <span className="fx-pill fx-dark px-2.5 py-1 text-[11px]">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--acc)' }} />
      {status.state === 'novo' ? 'Novo' : `${status.pct}%`}
    </span>
  )
}

/** Carta/monólito: tilt físico no hover, brilho de borda e metadados. */
export default function StudyCard({ study, status, onOpen, onHover }: Props) {
  const tilt = useRef<HTMLDivElement>(null)
  const face = useRef<HTMLDivElement>(null)
  const h = hero(study)

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = tilt.current!.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const t = tilt.current!
    t.classList.add('is-hover')
    t.style.setProperty('--ry', `${(px - 0.5) * 16}deg`)
    t.style.setProperty('--rx', `${(0.5 - py) * 12}deg`)
    t.style.setProperty('--gx', `${px * 100}%`)
    t.style.setProperty('--gy', `${py * 100}%`)
  }
  const preload = () => {
    const im = new Image()
    im.src = study.images.photo
  }
  const leave = () => {
    const t = tilt.current!
    t.classList.remove('is-hover')
    t.style.setProperty('--rx', '0deg')
    t.style.setProperty('--ry', '0deg')
  }

  return (
    <div ref={tilt} className="tilt" onPointerMove={move} onPointerEnter={() => (onHover(), preload())} onPointerLeave={leave}>
      <button
        data-card-btn
        className="block w-full text-left"
        onClick={() => onOpen((face.current!.querySelector('.photo-duo') as HTMLElement).getBoundingClientRect())}
        onFocus={() => (onHover(), preload())}
        aria-label={`Abrir estudo ${study.fullTitle}`}
      >
        <div ref={face} className="card-face" style={{ transform: 'translateZ(0)' }}>
          <div className="photo-duo relative aspect-[4/3]">
            <img src={study.images.thumb} alt="" loading="lazy" draggable={false} />
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 p-3">
              <span className="fx-pill fx-dark px-2.5 py-1 text-[11px]">{study.sale.modality}</span>
              <StatusChip status={status} />
            </div>
          </div>
          <div className="relative z-10 p-4 pt-3.5">
            <h2 className="truncate text-[18px] font-semibold tracking-[-0.02em] text-ink">{study.title}</h2>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-mute">
              <Icon name="pin" size={12} /> {study.property.address.split(' · ').pop()}
              {study.sale.date ? ` · ${dateShort(study.sale.date)}` : ''}
            </p>
            <p className="mt-3 text-[11px] text-mute">Lance inicial</p>
            <p className="num text-[22px]">{brl(study.minimumBid)}</p>
            <span className="fx-pill fx-tinted mt-2.5 px-2.5 py-1 text-[12px]">
              <Icon name="bolt" size={12} stroke={2} /> {pct(discountPct(study), 1)} abaixo da avaliação
            </span>
            <div className="card-meta">
              <div className="overflow-hidden">
                <dl className="mt-3.5 grid grid-cols-2 gap-y-2 border-t border-white/[.08] pt-3 text-[12px]">
                  <dt className="text-mute">Lucro líquido · {h.months}m</dt>
                  <dd className="mono text-right font-semibold text-ink">{brl(h.netResult)}</dd>
                  <dt className="text-mute">{study.roiLabel.replace(' s/ capital próprio', '*')}</dt>
                  <dd className="mono text-right font-semibold acc">{pct(h.netRoi)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}
