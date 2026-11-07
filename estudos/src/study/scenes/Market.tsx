import { useState } from 'react'
import { useStudy } from '../ctx'
import { brl, brlK, num, pad2 } from '../../lib/format'
import { Count, Label, Words } from '../primitives'
import { PAD } from './Opening'

/* ───────────────────────── Ficha do imóvel ───────────────────────── */
export function Property() {
  const { study: s } = useStudy()
  const p = s.property
  const specs: { k: string; v: string; mono?: boolean }[] = [
    { k: 'Metragem', v: `${num(p.area, 2)} m²` },
    ...(p.bedrooms !== undefined ? [{ k: 'Quartos', v: pad2(p.bedrooms) }] : []),
    ...(p.bathrooms !== undefined ? [{ k: 'Banheiros', v: pad2(p.bathrooms) }] : []),
    ...(p.parking !== undefined ? [{ k: 'Vaga de garagem', v: pad2(p.parking) }] : []),
    { k: 'Condomínio', v: brl(p.condoFee) },
  ]
  return (
    <div className={`relative z-10 grid h-full items-center gap-8 md:grid-cols-[1.05fr_1fr] md:gap-[5vw] ${PAD}`}>
      <div className="relative hidden md:block" style={{ perspective: 1400 }}>
        <div className="tilt3d relative">
          <div className="photo-duo relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10" data-reveal="up" data-delay="0.1">
            <img src={s.images.photo} alt={`Fachada do ${s.fullTitle}`} className="!brightness-90" />
          </div>
          <figure
            className="absolute -bottom-[8%] -right-[6%] w-[46%] overflow-hidden rounded-xl border border-white/15 shadow-[0_30px_60px_-20px_#000]"
            style={{ transform: 'translateZ(70px)' }}
            data-reveal="up"
            data-delay="0.35"
          >
            <img src={s.images.map} alt="Mapa de satélite da região do imóvel" className="aspect-[16/10] w-full object-cover grayscale-[.6] contrast-[1.1] brightness-[.8]" />
            <figcaption className="label absolute bottom-2 left-3 !text-[9px] !text-ink">Localização · satélite</figcaption>
          </figure>
        </div>
      </div>
      <div>
        <Label>Ficha do imóvel</Label>
        <h2 className="display mt-4 text-[clamp(2.2rem,min(4.2vw,9vh),4.8rem)]">
          <Words text={p.unit} delay={0.1} />
        </h2>
        <p className="mt-5 text-[clamp(1rem,1.3vw,1.2rem)] text-ink" data-reveal="up" data-delay="0.3">
          {p.address}
        </p>
        <p className="mt-1 text-[14px] text-ink-2" data-reveal="up" data-delay="0.36">
          {p.city}
        </p>
        <dl className="mt-10 grid grid-cols-2 border-l border-t border-white/10 sm:grid-cols-3">
          {specs.map((x, i) => (
            <div key={x.k} className="border-b border-r border-white/10 bg-white/[.015] p-4 md:p-5" data-reveal="up" data-delay={0.45 + i * 0.06}>
              <dt className="label !text-[10px]">{x.k}</dt>
              <dd className="mono mt-2 text-[clamp(1rem,1.5vw,1.35rem)] text-ink">{x.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

/* ───────────────────── Régua de valor (strip plot) ───────────────────── */
type Mark = { key: string; v: number; label: string; detail: string; acc?: boolean }

export function Ruler() {
  const { study: s } = useStudy()
  const [tip, setTip] = useState<{ x: number; lane: number; m: Mark } | null>(null)
  const L = s.market.listings
  const [s6, s12] = s.scenarios
  const prices = L.map((l) => l.price)
  const minL = Math.min(...prices)
  const maxL = Math.max(...prices)
  const all = [s.minimumBid, s.appraisal.value, s6.sale, s12.sale, ...prices, s.market.from ?? minL]
  const step = 25000
  const lo = Math.floor((Math.min(...all) * 0.94) / step) * step
  const hi = Math.ceil((Math.max(...all) * 1.03) / step) * step
  const x = (v: number) => ((v - lo) / (hi - lo)) * 100
  const ticks: number[] = []
  for (let t = lo; t <= hi; t += step) ticks.push(t)
  const samePrice = s6.sale === s12.sale
  /** Rótulo ao lado do grupo: à direita, ou à esquerda se não couber. */
  const side = (a: number, b: number) =>
    x(Math.max(a, b)) > 66
      ? { right: `${100 - x(Math.min(a, b))}%`, marginRight: 18 }
      : { left: `${x(Math.max(a, b))}%`, marginLeft: 18 }

  const lanes: { name: string; marks: Mark[] }[] = [
    {
      name: 'Mercado',
      marks: L.map((l, i) => ({ key: `l${i}`, v: l.price, label: brl(l.price), detail: [l.title, l.area, l.where].filter(Boolean).join(' · ') })),
    },
    {
      name: 'Projeção',
      marks: samePrice
        ? [{ key: 'p', v: s6.sale, label: brl(s6.sale), detail: 'Venda final projetada · 6 e 12 meses' }]
        : [
            { key: 'p6', v: s6.sale, label: brl(s6.sale), detail: 'Venda final projetada · 6 meses' },
            { key: 'p12', v: s12.sale, label: brl(s12.sale), detail: 'Venda final projetada · 12 meses' },
          ],
    },
    {
      name: 'Referência',
      marks: [
        { key: 'b', v: s.minimumBid, label: brl(s.minimumBid), detail: 'Lance inicial', acc: true },
        { key: 'a', v: s.appraisal.value, label: brl(s.appraisal.value), detail: `Avaliação ${s.appraisal.source}` },
      ],
    },
  ]

  return (
    <div className={`relative z-10 flex h-full flex-col justify-center ${PAD}`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label>Análise de mercado</Label>
          <h2 className="display mt-3 text-[clamp(2.4rem,min(5vw,9vh),5.4rem)]">
            <Words text="Onde o lance se posiciona" delay={0.1} />
          </h2>
        </div>
        <div className="text-right" data-reveal="up" data-delay="0.3">
          <p className="label">Imóveis similares na região</p>
          <p className="num mt-2 text-[clamp(2rem,4vw,3.6rem)]">
            {s.market.from ? (
              <>
                <span className="text-[0.4em] tracking-normal text-ink-2">a partir de </span>
                <Count value={s.market.from} fmt="brl0" />
              </>
            ) : (
              <span>
                {brlK(minL)} – {brlK(maxL)}
              </span>
            )}
          </p>
          <p className="label mt-1 !normal-case !tracking-normal">
            {s.market.from ? 'conforme o PDF' : `${L.length} anúncios no PDF`}
          </p>
        </div>
      </div>

      <figure className="relative mt-[6vh]" aria-label="Régua de valores: anúncios, projeção de venda, lance e avaliação">
        <div className="relative ml-0 md:ml-[110px]">
          {lanes.map((lane, li) => (
            <div key={lane.name} className="relative h-[clamp(56px,10vh,96px)] border-t border-white/[.06]">
              <span className="label absolute -left-[110px] top-1/2 hidden -translate-y-1/2 md:block">{lane.name}</span>
              <span className="label absolute left-0 top-1 md:hidden !text-[9px]">{lane.name}</span>
              {li === 0 && (
                <div
                  className="absolute top-1/2 h-[18px] -translate-y-1/2 rounded-full bg-white/[.07]"
                  style={{ left: `${x(minL)}%`, width: `${Math.max(0.6, x(maxL) - x(minL))}%` }}
                  data-grow="x"
                  data-delay="0.5"
                />
              )}
              {lane.marks.map((m, mi) => (
                <button
                  key={m.key}
                  className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-3"
                  style={{ left: `${x(m.v)}%` }}
                  onMouseEnter={() => setTip({ x: x(m.v), lane: li, m })}
                  onMouseLeave={() => setTip(null)}
                  onFocus={() => setTip({ x: x(m.v), lane: li, m })}
                  onBlur={() => setTip(null)}
                  aria-label={`${m.detail}: ${m.label}`}
                  data-reveal="z"
                  data-delay={0.6 + li * 0.18 + mi * 0.06}
                >
                  <span
                    className="block rounded-full ring-2 ring-[#0a0a0b] transition-transform duration-500 group-hover:scale-150"
                    style={{ width: li === 0 ? 9 : 13, height: li === 0 ? 9 : 13, background: m.acc ? 'var(--acc)' : li === 0 ? 'rgb(237 234 228 / .7)' : 'var(--color-ink)' }}
                  />
                </button>
              ))}
              {/* rótulos diretos (exceto anúncios, que usam tooltip + faixa) */}
              {li === 0 ? (
                <span className="mono absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[12px] text-ink-2" style={side(minL, maxL)} data-reveal="fade" data-delay="1">
                  {brlK(minL)} – {brlK(maxL)} · {L.length} anúncios
                </span>
              ) : li === 1 ? (
                <span className="mono absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[12px] text-ink" style={side(s6.sale, s12.sale)} data-reveal="fade" data-delay="1.1">
                  {samePrice ? `${brl(s6.sale)} · 6 e 12 meses` : `6m ${brlK(s6.sale)} · 12m ${brlK(s12.sale)}`}
                </span>
              ) : (
                lane.marks.map((m) => (
                  <span
                    key={m.key + 'l'}
                    className={`absolute top-[calc(50%_+_14px)] -translate-x-1/2 whitespace-nowrap text-center ${m.acc ? 'acc' : 'text-ink'}`}
                    style={{ left: `${x(m.v)}%` }}
                    data-reveal="fade"
                    data-delay="1.2"
                  >
                    <span className="mono block text-[12px]">{m.label}</span>
                    <span className="label block !text-[9px]">{m.detail}</span>
                  </span>
                ))
              )}
            </div>
          ))}
          {/* eixo */}
          <div className="relative mt-10 h-6 border-t border-white/20" data-reveal="fade" data-delay="0.4">
            {ticks.map((t) => (
              <span key={t} className="absolute top-0 -translate-x-1/2" style={{ left: `${x(t)}%` }}>
                <span className="mx-auto block h-1.5 w-px bg-white/25" />
                <span className="mono mt-1.5 block text-[10px] text-mute">{brlK(t).replace('R$ ', '')}</span>
              </span>
            ))}
          </div>
          {tip && (
            <div className="tip" style={{ left: `${tip.x}%`, top: `calc(${tip.lane} * clamp(56px,10vh,96px) + clamp(56px,10vh,96px) / 2 - 8px)` }} role="tooltip">
              <p className="mono text-[13px] text-ink">{tip.m.label}</p>
              <p className="mt-0.5 text-[11px] text-ink-2">{tip.m.detail}</p>
            </div>
          )}
        </div>
      </figure>
    </div>
  )
}
