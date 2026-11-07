import { useState } from 'react'
import type { Study } from '../data/types'
import { brl, brlK, dateBR, num, pad2, pct } from '../lib/format'
import { costItems, discountPct, hero } from '../lib/derive'
import { Count, Words } from './primitives'
import { Icon } from '../components/Icon'

/**
 * Uma tela por imóvel: foto + ficha à esquerda; à direita o resultado,
 * a régua de mercado, a composição do investimento, os cenários e a validação.
 * Todos os números vêm de `studies.ts`; derivados são marcados como "calculado".
 */
export default function PropertyScreen({ study: s, no, total }: { study: Study; no: number; total: number }) {
  const h = hero(s)
  const p = s.property
  const specs = [
    `${num(p.area, 2)} m²`,
    p.bedrooms !== undefined ? `${p.bedrooms} quartos` : null,
    p.bathrooms !== undefined ? `${p.bathrooms} ${p.bathrooms > 1 ? 'banheiros' : 'banheiro'}` : null,
    p.parking !== undefined ? `${p.parking} vaga` : null,
    `Cond. ${brl(p.condoFee)}`,
  ].filter(Boolean) as string[]

  return (
    <div className="relative grid h-full grid-rows-[34dvh_1fr] md:grid-cols-[42vw_minmax(0,1fr)] md:grid-rows-1">
      {/* ── foto + ficha ── */}
      <div className="relative overflow-hidden">
        <div className="layer-back absolute inset-0">
          <div className="photo-duo absolute inset-0">
            <img src={s.images.photo} alt={`Fachada do ${s.fullTitle}`} />
          </div>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-[3vw] md:pb-28">
          <p className="label !text-ink-2" data-reveal="fade" data-delay="0.1">
            Estudo {pad2(no)}/{pad2(total)} · {s.sale.modality}
            {s.sale.date ? ` · ${dateBR(s.sale.date)} ${s.sale.time}` : ''}
          </p>
          <h1 className="display mt-2 text-[clamp(2rem,min(4.4vw,8vh),4.8rem)] md:mt-3">
            <Words text={s.title} delay={0.12} step={0.08} />
          </h1>
          <p className="mt-2 hidden text-[14px] text-ink md:block" data-reveal="up" data-delay="0.35">
            {p.unit} · {p.address}
          </p>
          <p className="hidden text-[13px] text-ink-2 md:block" data-reveal="up" data-delay="0.4">
            {p.city}
          </p>
          <ul className="mt-4 hidden flex-wrap gap-1.5 md:flex">
            {specs.map((x, i) => (
              <li key={x} className="mono rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[12px] text-ink backdrop-blur-md" data-reveal="up" data-delay={0.45 + i * 0.04}>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── números ── */}
      <div className="relative z-10 flex min-h-0 min-w-0 flex-col justify-center gap-[clamp(12px,2.2vh,24px)] px-5 pb-24 pt-5 md:px-[3.6vw] md:pb-28 md:pt-24">

        {/* resultado */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <div>
            <p className="label" data-reveal="fade" data-delay="0.2">
              Lucro líquido · cenário {h.months} meses
            </p>
            <div style={{ perspective: 900 }}>
              <p className="num mt-2 whitespace-nowrap text-[clamp(2.2rem,min(4.2vw,8vh),4.8rem)]" data-reveal="z" data-delay="0.25">
                <Count value={h.netResult} fmt="brl" delay={0.35} />
              </p>
            </div>
          </div>
          <div className="md:text-right">
            <p className="label" data-reveal="fade" data-delay="0.3">
              {s.roiLabel}
            </p>
            <p className="num acc mt-2 text-[clamp(2rem,min(3.4vw,7vh),4rem)]" data-reveal="z" data-delay="0.35">
              <Count value={h.netRoi} fmt="pct" delay={0.45} />
            </p>
          </div>
        </div>

        {/* indicadores */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-4">
          {[
            { k: 'Desconto s/ avaliação', v: pct(discountPct(s), 1), note: 'calculado' },
            { k: 'Lance inicial', v: brl(s.minimumBid) },
            { k: 'Investimento total', v: brl(s.costs.total) },
            { k: `Venda projetada · ${h.months}m`, v: brl(h.sale) },
          ].map((m, i) => (
            <div key={m.k} className="min-w-0 bg-[#0c0c0e]/90 px-4 py-[clamp(8px,1.3vh,14px)]" data-reveal="up" data-delay={0.45 + i * 0.05}>
              <dt className="label truncate !text-[11px]">{m.k}</dt>
              <dd className="mono mt-1 whitespace-nowrap text-[clamp(14px,1.25vw,18px)] text-ink">
                {m.v}
                {m.note && <span className="ml-1.5 font-sans text-[10px] text-mute">{m.note}</span>}
              </dd>
            </div>
          ))}
        </dl>

        <MarketStrip s={s} />

        <div className="hidden min-h-0 gap-[3vw] md:grid md:grid-cols-2">
          <Costs s={s} />
          <Scenarios s={s} />
        </div>

        {/* validação */}
        <div className="flex min-w-0 items-center gap-3" data-reveal="fade" data-delay="1" title={s.validation.join(' · ')}>
          <span className="label whitespace-nowrap">Validação do valor de mercado</span>
          <span className="flex gap-1 acc" aria-hidden>
            {s.validation.map((v) => (
              <Icon key={v} name="check" size={13} stroke={2} />
            ))}
          </span>
          <span className="mono text-[12px] text-ink">
            {s.validation.length}/{s.validation.length}
          </span>
          <span className="hidden min-w-0 truncate text-[11px] text-mute xl:inline">{s.validation.join(' · ')}</span>
        </div>
      </div>
    </div>
  )
}

/* ───────────── régua de mercado compacta ───────────── */
function MarketStrip({ s }: { s: Study }) {
  const [tip, setTip] = useState<{ x: number; label: string; detail: string } | null>(null)
  const L = s.market.listings
  const [s6, s12] = s.scenarios
  const prices = L.map((l) => l.price)
  const minL = Math.min(...prices)
  const maxL = Math.max(...prices)
  const all = [s.minimumBid, s.appraisal.value, s6.sale, s12.sale, ...prices]
  const step = 25000
  const lo = Math.floor((Math.min(...all) * 0.95) / step) * step
  const hi = Math.ceil((Math.max(...all) * 1.02) / step) * step
  const x = (v: number) => ((v - lo) / (hi - lo)) * 100
  const sale = s6.sale === s12.sale ? [{ v: s6.sale, k: '6 e 12 meses' }] : [{ v: s6.sale, k: '6 meses' }, { v: s12.sale, k: '12 meses' }]
  const show = (v: number, label: string, detail: string) => () => setTip({ x: x(v), label, detail })

  return (
    <figure className="relative hidden md:[@media(min-height:820px)]:block" aria-label="Régua de mercado: lance, avaliação, anúncios e venda projetada">
      <figcaption className="mb-3 flex items-baseline justify-between">
        <span className="label">Posição de mercado</span>
        <span className="flex items-center gap-4 text-[11px] text-mute">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/70" /> anúncios</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rotate-45 bg-ink" /> venda projetada</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: 'var(--acc)' }} /> lance</span>
          <span>{s.market.from ? `· similares a partir de ${brl(s.market.from)} (PDF)` : `· ${L.length} anúncios no PDF`}</span>
        </span>
      </figcaption>
      <div className="relative mb-5 h-[72px]" data-reveal="fade" data-delay="0.6">
        {/* eixo */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
        {/* faixa de anúncios */}
        <div className="absolute top-[calc(50%_-_22px)] h-3 rounded-full bg-white/10" style={{ left: `${x(minL)}%`, width: `${Math.max(0.6, x(maxL) - x(minL))}%` }} />
        {L.map((l, i) => (
          <button
            key={i}
            className="absolute top-[calc(50%_-_16px)] -translate-x-1/2 -translate-y-1/2 p-1.5"
            style={{ left: `${x(l.price)}%` }}
            onMouseEnter={show(l.price, brl(l.price), [l.title, l.area, l.where].filter(Boolean).join(' · '))}
            onFocus={show(l.price, brl(l.price), l.title)}
            onMouseLeave={() => setTip(null)}
            onBlur={() => setTip(null)}
            aria-label={`Anúncio: ${l.title}, ${brl(l.price)}`}
          >
            <span className="block h-2 w-2 rounded-full bg-white/70 ring-2 ring-[#0a0a0b]" />
          </button>
        ))}
        <span
          className={`mono absolute top-[calc(50%_-_42px)] whitespace-nowrap text-[11px] text-ink-2 ${(x(minL) + x(maxL)) / 2 > 72 ? '' : '-translate-x-1/2'}`}
          style={(x(minL) + x(maxL)) / 2 > 72 ? { right: `${100 - x(maxL)}%` } : { left: `${(x(minL) + x(maxL)) / 2}%` }}
        >
          anúncios {brlK(minL)}–{brlK(maxL)}
        </span>
        {/* venda projetada (acima) */}
        {sale.map((m, i) => (
          <button
            key={m.k}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5"
            style={{ left: `${x(m.v)}%` }}
            onMouseEnter={show(m.v, brl(m.v), `Venda projetada · ${m.k}`)}
            onMouseLeave={() => setTip(null)}
            aria-label={`Venda projetada ${m.k}: ${brl(m.v)}`}
            data-index={i}
          >
            <span className="block h-3 w-3 rotate-45 bg-ink ring-2 ring-[#0a0a0b]" />
          </button>
        ))}
        {/* referências (abaixo) */}
        {[
          { v: s.minimumBid, k: 'Lance inicial', acc: true },
          { v: s.appraisal.value, k: `Avaliação ${s.appraisal.source}`, acc: false },
        ].map((m) => (
          <div key={m.k} className="absolute top-1/2 -translate-x-1/2" style={{ left: `${x(m.v)}%` }}>
            <span className="mx-auto block h-3 w-3 -translate-y-1/2 rounded-full ring-2 ring-[#0a0a0b]" style={{ background: m.acc ? 'var(--acc)' : 'var(--color-ink)' }} />
            <span className={`mono mt-0.5 block whitespace-nowrap text-center text-[11px] ${m.acc ? 'acc' : 'text-ink'}`}>{brl(m.v)}</span>
            <span className="label block text-center !text-[10px] !font-normal">{m.k}</span>
          </div>
        ))}
        {tip && (
          <div className="tip" style={{ left: `${tip.x}%`, top: 6 }} role="tooltip">
            <p className="mono text-[12px] text-ink">{tip.label}</p>
            <p className="mt-0.5 text-[11px] text-ink-2">{tip.detail}</p>
          </div>
        )}
      </div>
    </figure>
  )
}

/* ───────────── composição do investimento ───────────── */
function Costs({ s }: { s: Study }) {
  const parts = costItems(s).filter((r) => r.value > 0)
  const maxV = Math.max(...parts.map((r) => r.value))
  const f = s.financing
  return (
    <div className="min-h-0">
      <p className="label mb-3">Composição do investimento</p>
      <div className="flex h-2 gap-[2px]" role="img" aria-label="Participação de cada custo no investimento total">
        {parts.map((r) => (
          <span key={r.label} className="h-full rounded-[2px]" style={{ flexGrow: r.value, background: r.value === maxV ? 'var(--acc)' : 'rgb(237 234 228 / .4)' }} data-grow="x" />
        ))}
      </div>
      <table className="mt-2 w-full border-collapse">
        <caption className="sr-only">Estimativa de custos</caption>
        <tbody>
          {s.costs.items.map((r, i) => (
            <tr key={r.label} className="border-b border-white/[.06]" data-reveal="up" data-delay={0.6 + i * 0.03}>
              <td className={`py-[clamp(2px,0.42vh,5px)] pr-3 text-[12px] leading-[1.35] ${r.value === 0 ? 'text-mute' : 'text-ink-2'}`}>
                {r.label}
                {r.ref && <span className="ml-1 text-[10px] text-mute">(fora do total)</span>}
              </td>
              <td className={`mono whitespace-nowrap text-right text-[12px] ${r.value === 0 ? 'text-mute' : 'text-ink'}`}>{brl(r.value)}</td>
            </tr>
          ))}
          <tr>
            <td className="pt-2 text-[12px] font-semibold text-ink">Investimento total</td>
            <td className="mono whitespace-nowrap pt-2 text-right text-[12px] acc">{brl(s.costs.total)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-[11px] leading-snug text-mute">
        Custo operacional {brl(s.period.op6)} (6m) · {brl(s.period.op12)} (12m)
        {f && ` · parcela ${brl(f.installment)}/mês`}
      </p>
    </div>
  )
}

/* ───────────── cenários 6 × 12 ───────────── */
function Scenarios({ s }: { s: Study }) {
  const [a, b] = s.scenarios
  const rows: { k: string; a: string; b: string; strong?: boolean; acc?: boolean }[] = [
    { k: 'Venda final', a: brl(a.sale), b: brl(b.sale) },
    ...(a.balance !== undefined ? [{ k: 'Saldo devedor', a: `−${brl(a.balance)}`, b: `−${brl(b.balance!)}` }] : []),
    { k: a.brokerageLabel, a: `−${brl(a.brokerage)}`, b: `−${brl(b.brokerage)}` },
    { k: 'Investimento', a: brl(a.investment), b: brl(b.investment) },
    { k: 'Resultado bruto', a: brl(a.grossResult), b: brl(b.grossResult) },
    { k: 'ROI bruto', a: pct(a.grossRoi), b: pct(b.grossRoi) },
    { k: `Líquido (IRGC ${a.taxPct}%)`, a: brl(a.netResult), b: brl(b.netResult), strong: true },
    { k: s.roiLabel.replace(' s/ capital próprio', '*'), a: pct(a.netRoi), b: pct(b.netRoi), strong: true, acc: true },
  ]
  return (
    <div className="min-h-0">
      <table className="w-full border-collapse">
        <caption className="sr-only">Projeção de venda em 6 e 12 meses</caption>
        <thead>
          <tr>
            <th className="label pb-2 text-left">Projeção de venda</th>
            <th className="label pb-2 text-right">6 meses</th>
            <th className="label pb-2 text-right">12 meses</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.k} className={`border-b ${r.strong ? 'border-white/15' : 'border-white/[.06]'}`} data-reveal="up" data-delay={0.65 + i * 0.03}>
              <td className={`py-[clamp(2px,0.42vh,5px)] pr-3 text-[12px] leading-[1.35] ${r.strong ? 'font-semibold text-ink' : 'text-ink-2'}`}>{r.k}</td>
              <td className={`mono whitespace-nowrap pl-2 text-right text-[12px] ${r.acc ? 'acc' : 'text-ink'}`}>{r.a}</td>
              <td className={`mono whitespace-nowrap pl-2 text-right text-[12px] ${r.acc ? 'acc' : 'text-ink'}`}>{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {s.financing && <p className="mt-2 text-[11px] text-mute">* ROI sobre o capital próprio (compra financiada).</p>}
    </div>
  )
}
