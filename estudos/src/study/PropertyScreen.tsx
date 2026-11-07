import { useState } from 'react'
import type { Study } from '../data/types'
import { brl, brlK, dateBR, num, pad2, pct } from '../lib/format'
import { costItems, discountPct, hero } from '../lib/derive'
import { Count, Words } from './primitives'
import { Icon } from '../components/Icon'

/**
 * Uma tela por imóvel, no design system Fexô (tema escuro, acento amarelo):
 * à esquerda foto, título, ficha e posição de mercado; à direita o card de valor,
 * "Quanto você vai investir" e "Calculadora de lucro".
 * Números vêm de `studies.ts`; derivados são marcados como "calculado".
 */
export default function PropertyScreen({ study: s, no, total }: { study: Study; no: number; total: number }) {
  const h = hero(s)
  const p = s.property
  const specs = [
    { icon: 'area', v: `${num(p.area, 2)} m²`, k: 'Área' },
    p.bedrooms !== undefined && { icon: 'bed', v: String(p.bedrooms), k: p.bedrooms > 1 ? 'Quartos' : 'Quarto' },
    p.bathrooms !== undefined && { icon: 'bath', v: String(p.bathrooms), k: p.bathrooms > 1 ? 'Banheiros' : 'Banheiro' },
    p.parking !== undefined && { icon: 'car', v: String(p.parking), k: p.parking > 1 ? 'Vagas' : 'Vaga' },
    { icon: 'coin', v: brl(p.condoFee), k: 'Condomínio' },
  ].filter(Boolean) as { icon: string; v: string; k: string }[]

  return (
    <div className="relative z-10 grid h-full grid-cols-[minmax(0,1fr)] content-start gap-3 overflow-hidden px-4 pb-[84px] pt-[72px] md:content-stretch md:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] md:grid-rows-1 md:gap-[2.2vw] md:px-[3vw] md:pb-[92px] md:pt-[88px]">
      {/* ───────── esquerda: foto + ficha ───────── */}
      <div className="flex min-h-0 flex-col gap-[clamp(10px,1.8vh,18px)]">
        <div data-photo className="layer-back relative h-[26dvh] overflow-hidden rounded-[24px] border border-white/10 md:h-auto md:min-h-0 md:flex-1">
          <div className="photo-duo absolute inset-0">
            <img src={s.images.photo} alt={`Fachada do ${s.fullTitle}`} />
          </div>
          <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
            <span className="fx-pill fx-dark px-3 py-1.5 text-[12px]">
              {s.sale.modality}
              {s.sale.date ? ` · ${dateBR(s.sale.date)} ${s.sale.time}` : ''}
            </span>
            <span className="fx-pill fx-dark px-3 py-1.5 text-[12px] tnum">
              Estudo {pad2(no)}/{pad2(total)}
            </span>
          </div>
          {s.financing && (
            <span className="fx-pill absolute bottom-3 left-3 z-10 bg-[var(--color-blue)] px-3 py-1.5 text-[12px] text-white">
              <Icon name="coin" size={13} stroke={1.8} /> Compra financiada
            </span>
          )}
        </div>

        <div>
          <span className="fx-pill bg-white px-2.5 py-1 text-[11px] text-[#0b0c0e]" data-reveal="fade" data-delay="0.15">
            {p.unit}
          </span>
          <h1 className="display mt-2 text-[clamp(1.9rem,min(3vw,5.4vh),3.2rem)]">
            <Words text={s.title} delay={0.12} step={0.07} />
          </h1>
          <p className="mt-1 flex items-center gap-1.5 truncate text-[13px] text-ink-2" data-reveal="up" data-delay="0.3">
            <Icon name="pin" size={14} /> {p.address} · {p.city}
          </p>
        </div>

        <ul className="hidden gap-x-5 gap-y-3 overflow-x-auto border-y md:flex border-white/[.08] py-[clamp(8px,1.4vh,14px)] [scrollbar-width:none]">
          {specs.map((x, i) => (
            <li key={x.k} className="flex flex-none items-center gap-2.5" data-reveal="up" data-delay={0.35 + i * 0.04}>
              <span className="fx-ico">
                <Icon name={x.icon} size={16} />
              </span>
              <span className="leading-tight">
                <span className="mono block text-[14px] font-semibold text-ink">{x.v}</span>
                <span className="block text-[12px] text-mute">{x.k}</span>
              </span>
            </li>
          ))}
        </ul>

        <MarketStrip s={s} />
      </div>

      {/* ───────── direita: valores ───────── */}
      <div className="flex min-h-0 min-w-0 flex-col justify-center gap-[clamp(10px,1.8vh,18px)]">
        {/* card de valor */}
        <div className="fx-card p-[clamp(14px,2.2vh,24px)]" data-reveal="up" data-delay="0.2">
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            <div className="min-w-0">
              <p className="label">Lance inicial</p>
              <p className="num mt-2 whitespace-nowrap text-[19px] md:text-[clamp(1.5rem,min(2.3vw,4.4vh),2.5rem)]">{brl(s.minimumBid)}</p>
              <p className="mt-1 truncate text-[11px] text-ink-2 md:text-[13px]">
                Avaliado em <span className="line-through decoration-white/50">{brl(s.appraisal.value)}</span> · {s.appraisal.source}
              </p>
              <span className="fx-pill fx-acc mt-3 px-2.5 py-1 text-[11px] font-bold md:px-3 md:py-1.5 md:text-[13px]">
                <Icon name="bolt" size={13} stroke={2} />
                {pct(discountPct(s), 1)} abaixo da avaliação
              </span>
              <span className="mt-1 block text-[10px] text-mute md:ml-2 md:mt-0 md:inline">calculado</span>
            </div>
            <div className="min-w-0 border-l border-white/[.08] pl-3 md:pl-5">
              <p className="label">Lucro líquido · {h.months} meses</p>
              <div style={{ perspective: 900 }}>
                <p className="num mt-2 whitespace-nowrap text-[19px] md:text-[clamp(1.5rem,min(2.3vw,4.4vh),2.5rem)]" data-reveal="z" data-delay="0.3">
                  <Count value={h.netResult} fmt="brl" delay={0.4} />
                </p>
              </div>
              <p className="mt-1 truncate text-[11px] text-ink-2 md:text-[13px]">{s.roiLabel}</p>
              <p className="num acc mt-1 text-[28px] md:text-[clamp(1.8rem,min(2.8vw,5.4vh),3rem)]">
                <Count value={h.netRoi} fmt="pct" delay={0.5} />
              </p>
            </div>
          </div>
        </div>

        <div className="hidden min-h-0 gap-[clamp(10px,1.2vw,18px)] md:grid md:grid-cols-2">
          <Costs s={s} />
          <Scenarios s={s} />
        </div>

        {/* validação — faixa de aviso Fexô */}
        <div className="fx-note flex min-w-0 items-center gap-2.5 px-4 py-[clamp(8px,1.3vh,12px)] text-[12px]" data-reveal="fade" data-delay="0.9" title={s.validation.join(' · ')}>
          <Icon name="shield" size={16} />
          <span className="min-w-0 truncate font-semibold md:flex-none md:overflow-visible">
            Valor de mercado validado · {s.validation.length}/{s.validation.length}
          </span>
          <span className="hidden min-w-0 truncate text-[#ffe680]/70 lg:inline">{s.validation.join(' · ')}</span>
        </div>
      </div>
    </div>
  )
}

/* ───────────── posição de mercado ───────────── */
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
  const mid = (x(minL) + x(maxL)) / 2

  return (
    <figure className="fx-card hidden px-5 pb-4 pt-4 md:[@media(min-height:820px)]:block" aria-label="Posição de mercado: lance, avaliação, anúncios e venda projetada" data-reveal="up" data-delay="0.5">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="label !text-ink-2">Posição de mercado</span>
        <span className="truncate text-[11px] text-mute">
          {s.market.from ? `Similares a partir de ${brl(s.market.from)}` : `${L.length} anúncios no PDF`}
        </span>
      </figcaption>
      <div className="relative mb-6 mt-3 h-[64px]">
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
        <div className="absolute top-[calc(50%_-_20px)] h-2.5 rounded-full bg-white/10" style={{ left: `${x(minL)}%`, width: `${Math.max(0.6, x(maxL) - x(minL))}%` }} />
        {L.map((l, i) => (
          <button
            key={i}
            className="absolute top-[calc(50%_-_15px)] -translate-x-1/2 -translate-y-1/2 p-1.5"
            style={{ left: `${x(l.price)}%` }}
            onMouseEnter={show(l.price, brl(l.price), [l.title, l.area, l.where].filter(Boolean).join(' · '))}
            onFocus={show(l.price, brl(l.price), l.title)}
            onMouseLeave={() => setTip(null)}
            onBlur={() => setTip(null)}
            aria-label={`Anúncio: ${l.title}, ${brl(l.price)}`}
          >
            <span className="block h-2 w-2 rounded-full bg-white/80 ring-2 ring-[var(--color-panel)]" />
          </button>
        ))}
        <span
          className={`absolute top-[calc(50%_-_38px)] whitespace-nowrap text-[11px] text-ink-2 tnum ${mid > 72 ? '' : '-translate-x-1/2'}`}
          style={mid > 72 ? { right: `${100 - x(maxL)}%` } : { left: `${mid}%` }}
        >
          anúncios {brlK(minL)}–{brlK(maxL)}
        </span>
        {sale.map((m) => (
          <button
            key={m.k}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5"
            style={{ left: `${x(m.v)}%` }}
            onMouseEnter={show(m.v, brl(m.v), `Venda projetada · ${m.k}`)}
            onMouseLeave={() => setTip(null)}
            aria-label={`Venda projetada ${m.k}: ${brl(m.v)}`}
          >
            <span className="block h-3 w-3 rotate-45 rounded-[2px] bg-white ring-2 ring-[var(--color-panel)]" />
          </button>
        ))}
        {[
          { v: s.minimumBid, k: 'Lance inicial', acc: true },
          { v: s.appraisal.value, k: `Avaliação ${s.appraisal.source}`, acc: false },
        ].map((m) => (
          <div key={m.k} className="absolute top-1/2 -translate-x-1/2" style={{ left: `${x(m.v)}%` }}>
            <span className="mx-auto block h-3 w-3 -translate-y-1/2 rounded-full ring-2 ring-[var(--color-panel)]" style={{ background: m.acc ? 'var(--acc)' : '#fff' }} />
            <span className={`mono block whitespace-nowrap text-center text-[11px] font-semibold ${m.acc ? 'acc' : 'text-ink'}`}>{brl(m.v)}</span>
            <span className="block whitespace-nowrap text-center text-[10px] text-mute">{m.k}</span>
          </div>
        ))}
        {tip && (
          <div className="tip" style={{ left: `${tip.x}%`, top: 4 }} role="tooltip">
            <p className="mono text-[12px] font-semibold text-ink">{tip.label}</p>
            <p className="mt-0.5 text-[11px] text-ink-2">{tip.detail}</p>
          </div>
        )}
      </div>
      <p className="flex gap-4 text-[11px] text-mute">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/80" /> anúncios</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rotate-45 bg-white" /> venda projetada</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: 'var(--acc)' }} /> lance</span>
      </p>
    </figure>
  )
}

/* ───────────── Quanto você vai investir ───────────── */
function Costs({ s }: { s: Study }) {
  const parts = costItems(s).filter((r) => r.value > 0)
  const maxV = Math.max(...parts.map((r) => r.value))
  const f = s.financing
  return (
    <div className="fx-card flex min-h-0 min-w-0 flex-col p-[clamp(12px,1.8vh,18px)]" data-reveal="up" data-delay="0.35">
      <p className="text-[15px] font-semibold tracking-tight text-ink">Quanto você vai investir</p>
      <div className="mt-3 flex h-1.5 gap-[2px]" role="img" aria-label="Participação de cada custo no investimento total">
        {parts.map((r) => (
          <span key={r.label} className="h-full rounded-full" style={{ flexGrow: r.value, background: r.value === maxV ? 'var(--acc)' : 'rgb(255 255 255 / .28)' }} data-grow="x" />
        ))}
      </div>
      <table className="mt-2 w-full border-collapse">
        <caption className="sr-only">Estimativa de custos</caption>
        <tbody>
          {s.costs.items.map((r, i) => {
            const first = i === 0
            return (
              <tr key={r.label} className="border-b border-white/[.06]">
                <td className={`py-[clamp(3px,0.5vh,6px)] pr-2 text-[clamp(11px,0.82vw,12.5px)] leading-[1.3] ${r.value === 0 ? 'text-mute' : 'text-ink-2'}`}>
                  {r.label}
                  {r.ref && <span className="ml-1 text-[10px] text-mute">(fora do total)</span>}
                </td>
                <td className={`mono whitespace-nowrap text-right text-[clamp(11px,0.82vw,12.5px)] font-semibold ${r.value === 0 ? 'text-mute' : 'text-ink'}`}>
                  {first || r.ref ? '' : '+ '}
                  {brl(r.value)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="fx-total mt-auto flex items-center justify-between gap-3 px-3.5 py-2.5">
        <span className="text-[12px] font-semibold text-ink">Investimento total</span>
        <span className="num acc whitespace-nowrap text-[clamp(14px,1.25vw,18px)]">{brl(s.costs.total)}</span>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-mute">
        Custo operacional {brl(s.period.op6)} (6m) · {brl(s.period.op12)} (12m)
        {f && ` · parcela ${brl(f.installment)}/mês`}
      </p>
    </div>
  )
}

/* ───────────── Calculadora de lucro (6 × 12) ───────────── */
function Scenarios({ s }: { s: Study }) {
  const [a, b] = s.scenarios
  const rows: { k: string; a: string; b: string }[] = [
    { k: 'Venda final', a: brl(a.sale), b: brl(b.sale) },
    ...(a.balance !== undefined ? [{ k: 'Saldo devedor', a: `−${brl(a.balance)}`, b: `−${brl(b.balance!)}` }] : []),
    { k: a.brokerageLabel.replace('Corretagem', 'Corretagem'), a: `−${brl(a.brokerage)}`, b: `−${brl(b.brokerage)}` },
    { k: 'Investimento', a: `−${brl(a.investment)}`, b: `−${brl(b.investment)}` },
    { k: 'Resultado bruto', a: brl(a.grossResult), b: brl(b.grossResult) },
    { k: 'ROI bruto', a: pct(a.grossRoi), b: pct(b.grossRoi) },
    { k: `Imposto (IRGC ${a.taxPct}%)`, a: `−${a.taxPct}%`, b: `−${b.taxPct}%` },
  ]
  const V = 'mono whitespace-nowrap pl-2 text-right text-[clamp(11px,0.82vw,12.5px)] font-semibold'
  return (
    <div className="fx-card flex min-h-0 min-w-0 flex-col p-[clamp(12px,1.8vh,18px)]" data-reveal="up" data-delay="0.45">
      <p className="text-[15px] font-semibold tracking-tight text-ink">Calculadora de lucro</p>
      <table className="mt-2 w-full border-collapse">
        <caption className="sr-only">Projeção de venda em 6 e 12 meses</caption>
        <thead>
          <tr>
            <th className="pb-1.5 text-left font-normal" aria-label="Item" />
            <th className="label pb-1.5 text-right !text-[10px]">6 meses</th>
            <th className="label pb-1.5 pl-2 text-right !text-[10px]">12 meses</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.k} className="border-b border-white/[.06]">
              <td className="py-[clamp(3px,0.5vh,6px)] pr-1 text-[clamp(11px,0.82vw,12.5px)] leading-[1.3] text-ink-2">{r.k}</td>
              <td className={V + ' text-ink'}>{r.a}</td>
              <td className={V + ' text-ink'}>{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="fx-total mt-auto px-3 py-2.5">
        <div className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-2.5">
          <span className="whitespace-nowrap text-[12px] font-semibold text-ink">Lucro líquido</span>
          <span className="num acc whitespace-nowrap text-right text-[clamp(12px,1vw,15px)]">{brl(a.netResult)}</span>
          <span className="num whitespace-nowrap text-right text-[clamp(12px,1vw,15px)] text-ink">{brl(b.netResult)}</span>
          <span className="whitespace-nowrap text-[11px] text-mute">{s.roiLabel.replace(' s/ capital próprio', '*')}</span>
          <span className="mono whitespace-nowrap text-right text-[12px] font-semibold acc">{pct(a.netRoi)}</span>
          <span className="mono whitespace-nowrap text-right text-[12px] font-semibold text-ink">{pct(b.netRoi)}</span>
        </div>
      </div>
      {s.financing && <p className="mt-2 text-[11px] text-mute">* sobre o capital próprio (compra financiada).</p>}
    </div>
  )
}
