import { useRef } from 'react'
import type { Study } from '../data/types'
import type { Status } from '../lib/progress'
import { brl, dateShort, pad2, pct } from '../lib/format'
import { hero } from '../lib/derive'
import { Icon } from '../components/Icon'

interface Props {
  study: Study
  scenes: number
  minutes: number
  status: Status
  index: number
  width: number
  onOpen: (rect: DOMRect) => void
  onHover: () => void
}

function StatusChip({ status }: { status: Status }) {
  if (status.state === 'novo')
    return (
      <span className="label flex items-center gap-1.5 !text-ink">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--acc)' }} />
        Novo
      </span>
    )
  if (status.state === 'explorado')
    return (
      <span className="label flex items-center gap-1 !text-[var(--acc)]">
        <Icon name="check" size={12} stroke={2} /> Explorado
      </span>
    )
  return (
    <span className="label flex items-center gap-2 !text-ink-2">
      <span className="relative block h-[2px] w-8 overflow-hidden rounded bg-white/15">
        <span className="absolute inset-y-0 left-0" style={{ width: `${status.pct}%`, background: 'var(--acc)' }} />
      </span>
      {status.pct}%
    </span>
  )
}

/** Carta/monólito: tilt físico no hover, brilho de borda e metadados. */
export default function StudyCard({ study, scenes, minutes, status, index, onOpen, onHover }: Props) {
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
        aria-label={`Abrir estudo ${study.fullTitle}: ${scenes} cenas, cerca de ${minutes} minutos`}
      >
        <div ref={face} className="card-face" style={{ transform: 'translateZ(0)' }}>
          <div className="photo-duo relative aspect-[4/3.4]">
            <img src={study.images.thumb} alt="" loading="lazy" draggable={false} />
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
              <span className="mono text-[11px] text-ink-2">{pad2(index + 1)}</span>
              <StatusChip status={status} />
            </div>
          </div>
          <div className="relative z-10 -mt-10 p-5 pt-0">
            <p className="label">{study.sale.modality}{study.sale.date ? ` · ${dateShort(study.sale.date)}` : ''}</p>
            <h2 className="display mt-2 text-[34px] leading-[0.95]">{study.title}</h2>
            <div className="card-meta">
              <div className="overflow-hidden">
                <div className="mt-4 hairline" />
                <dl className="mt-4 grid grid-cols-2 gap-y-3 text-[12px]">
                  <dt className="text-mute">Lance inicial</dt>
                  <dd className="mono text-right text-ink">{brl(study.minimumBid)}</dd>
                  <dt className="text-mute">{study.roiLabel} · {h.months}m</dt>
                  <dd className="mono text-right acc">{pct(h.netRoi)}</dd>
                  <dt className="text-mute">Apresentação</dt>
                  <dd className="mono text-right text-ink-2">{scenes} cenas · ~{minutes} min</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}
