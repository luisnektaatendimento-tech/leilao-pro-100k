import { useState } from 'react'
import type { Study } from '../data/types'
import { brl, brlK, dateBR, num, pad2, pct } from '../lib/format'
import { appraisalLabel, costItems, discountPct, hero, marketPrices, placeLine } from '../lib/derive'
import { Count, Words } from './primitives'
import { Icon } from '../components/Icon'
import { useStudy } from './ctx'
import Timeline from './Timeline'

/**
 * Painel único por imóvel: um display grande, em tela cheia, com identidade própria
 * (fundo com a foto do imóvel, cor de luz tirada da foto, nome em marca d'água e o
 * destaque em que o imóvel lidera o portfólio). Números vêm de `studies.ts`.
 */
export default function PropertyPanel({ study: s, no, total }: { study: Study; no: number; total: number }) {
  const { timeline, setTimeline } = useStudy()
  const h = hero(s)
  const p = s.property
  const specs = [
    { icon: 'area', v: `${num(p.area, 2)} m²`, k: 'Área' },
    p.bedrooms !== undefined && { icon: 'bed', v: String(p.bedrooms), k: p.bedrooms > 1 ? 'Quartos' : 'Quarto' },
    p.bathrooms !== undefined && { icon: 'bath', v: String(p.bathrooms), k: p.bathrooms > 1 ? 'Banheiros' : 'Banheiro' },
    p.parking !== undefined && { icon: 'car', v: String(p.parking), k: p.parking > 1 ? 'Vagas' : 'Vaga' },
    { icon: 'coin', v: brl(p.condoFee), k: 'Condomínio' },
  ].filter(Boolean) as { icon: string; v: string; k: string }[]

  const validation = s.validation.length === 0 ? null : (
    <div className="fx-note flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-2 px-4 py-3 text-[12px] md:flex-nowrap md:py-[clamp(8px,1.3vh,12px)]" data-reveal="fade" data-delay="0.9" title={s.validation.join(' · ')}>
      <Icon name="shield" size={16} />
      <span className="font-semibold md:flex-none md:whitespace-nowrap">
        Valor de mercado validado · {s.validation.length}/{s.validation.length}
      </span>
      <ul className="basis-full space-y-1 pl-[26px] text-[12px] text-ink-2 md:hidden">
        {s.validation.map((v) => (
          <li key={v} className="flex gap-1.5">
            <Icon name="check" size={13} stroke={2} /> {v}
          </li>
        ))}
      </ul>
      <span className="hidden min-w-0 truncate text-ink-2 lg:inline">{s.validation.join(' · ')}</span>
    </div>
  )

  return (
    <div className="panel-shell" style={{ ['--tint' as string]: s.theme.tint }}>
      <div className="panel">
        {/* marca d'água com o nome do condomínio */}
        <span className="panel-mark" aria-hidden>
          {s.title}
        </span>

        {timeline ? (
          <div className="mode-in relative z-10 md:h-full">
            <Timeline study={s} onClose={() => setTimeline(false)} />
          </div>
        ) : (
        <div className="mode-in relative z-10 flex flex-col gap-5 md:grid md:h-full md:min-h-0 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:gap-[clamp(18px,2vw,34px)]">
          {/* ───────── esquerda: a vista do imóvel ───────── */}
          <div className="flex min-h-0 flex-col gap-[clamp(12px,1.8vh,18px)]">
            <div data-photo className="relative aspect-[4/3] overflow-hidden rounded-[20px] md:aspect-auto md:min-h-0 md:flex-1" style={{ boxShadow: '0 0 0 1px rgb(255 255 255 / .08), 0 30px 60px -30px #000' }}>
              <div className="photo-duo absolute inset-0">
                <img src={s.images.photo} alt={`Fachada do ${s.fullTitle}`} />
              </div>
              <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
                <span className="fx-pill fx-dark min-w-0 px-3 py-1.5 text-[12px]">
                  <span className="truncate">
                    {s.sale.modality}
                    {s.sale.date ? ` · ${dateBR(s.sale.date)} ${s.sale.time}` : ''}
                  </span>
                </span>
                <span className="fx-pill fx-dark flex-none px-3 py-1.5 text-[12px] tnum">
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
              <div className="flex flex-wrap items-center gap-2" data-reveal="fade" data-delay="0.15">
                <span className="fx-pill fx-gray px-2.5 py-1 text-[12px]">{p.unit}</span>
                <span className="fx-pill px-2.5 py-1 text-[11px]" style={{ background: 'color-mix(in srgb, var(--tint) 16%, transparent)', color: 'var(--tint)' }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--tint)' }} /> {s.appraisal.source ? `Imóvel ${s.appraisal.source}` : s.sale.modality}
                </span>
              </div>
              <h1 className="display mt-2 text-[clamp(2.1rem,9vw,2.8rem)] md:text-[clamp(2rem,min(3.4vw,6vh),3.9rem)]">
                <Words text={s.title} delay={0.12} step={0.07} />
              </h1>
              <p className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-snug text-ink-2 md:items-center" data-reveal="up" data-delay="0.3">
                <span className="mt-[2px] flex-none md:mt-0" style={{ color: 'var(--tint)' }}>
                  <Icon name="pin" size={14} />
                </span>
                <span className="md:truncate">
                  {placeLine(s)}
                </span>
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-3 border-t border-white/[.08] pt-4 sm:grid-cols-3 md:flex md:flex-nowrap md:gap-x-4 md:overflow-x-auto md:pt-[clamp(10px,1.6vh,16px)] md:[scrollbar-width:none] xl:gap-x-6">
              {specs.map((x, i) => (
                <li key={x.k} className="flex min-w-0 flex-none items-center gap-2.5" data-reveal="up" data-delay={0.35 + i * 0.04}>
                  <span className="fx-ico flex-none" style={{ color: 'var(--tint)' }}>
                    <Icon name={x.icon} size={16} />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="mono block truncate text-[14px] font-semibold text-ink">{x.v}</span>
                    <span className="block text-[12px] text-mute">{x.k}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="hidden md:block">
              <MarketStrip s={s} />
            </div>
            <div className="hidden md:block">{validation}</div>
          </div>

          {/* ───────── direita: os números ───────── */}
          <div className="flex min-h-0 min-w-0 flex-col gap-[clamp(12px,1.8vh,18px)] md:justify-center">
            <button
              onClick={() => setTimeline(true)}
              className="group flex w-full items-center justify-between gap-3 rounded-[16px] border px-4 py-3 text-left transition-colors md:py-[clamp(8px,1.3vh,12px)]"
              style={{ borderColor: 'color-mix(in srgb, var(--tint) 45%, transparent)', background: 'color-mix(in srgb, var(--tint) 8%, transparent)' }}
              data-reveal="fade"
              data-delay="0.2"
              aria-label="Abrir a linha do tempo dos pagamentos (L)"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full" style={{ background: 'var(--tint)', color: '#0b0c0e' }}>
                  <Icon name="route" size={17} stroke={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-ink">Linha do tempo dos pagamentos</span>
                  <span className="block truncate text-[12px] text-ink-2">O que se paga, em que ordem, etapa por etapa até o lucro</span>
                </span>
              </span>
              <span className="flex-none transition-transform duration-500 group-hover:translate-x-1" style={{ color: 'var(--tint)' }}>
                <Icon name="arrowRight" size={18} stroke={2} />
              </span>
            </button>


            {/* valor */}
            <div className="grid grid-cols-1 gap-5 border-b border-white/[.08] pb-[clamp(14px,2vh,22px)] sm:grid-cols-2">
              <div className="min-w-0">
                <p className="label">Lance inicial</p>
                <p className="num mt-2 whitespace-nowrap text-[32px] md:text-[clamp(1.7rem,min(2.6vw,5vh),3rem)]">{brl(s.minimumBid)}</p>
                <p className="mt-1 truncate text-[13px] text-ink-2">
                  Avaliado em <span className="line-through decoration-white/50">{brl(s.appraisal.value)}</span>{s.appraisal.source ? ` · ${s.appraisal.source}` : ''}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="fx-pill fx-tinted px-3 py-1.5 text-[13px]">
                    <Icon name="bolt" size={14} stroke={2} />
                    {pct(discountPct(s), 1)} abaixo da avaliação
                  </span>
                  <span className="text-[10px] text-mute">calculado</span>
                </div>
              </div>
              <div className="min-w-0 border-t border-white/[.08] pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <p className="label">Lucro líquido · {h.months} meses</p>
                <div style={{ perspective: 900 }}>
                  <p className="num mt-2 whitespace-nowrap text-[32px] md:text-[clamp(1.7rem,min(2.6vw,5vh),3rem)]" data-reveal="z" data-delay="0.3">
                    <Count value={h.netResult} fmt="brl" delay={0.4} />
                  </p>
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-3 sm:block">
                  <p className="truncate text-[13px] text-ink-2">{s.roiLabel}</p>
                  <p className="num acc text-[38px] sm:mt-1 md:text-[clamp(2rem,min(3.2vw,6vh),3.8rem)]">
                    <Count value={h.netRoi} fmt="pct" delay={0.5} />
                  </p>
                </div>
              </div>
            </div>

            <div className="grid min-h-0 grid-cols-1 gap-[clamp(10px,1.1vw,16px)] md:grid-cols-2">
              <div className="min-w-0">
                <Costs s={s} />
              </div>
              <div className="min-w-0">
                <Scenarios s={s} />
              </div>
            </div>

            <div className="md:hidden">
              <MarketStrip s={s} />
            </div>

            <div className="md:hidden">{validation}</div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

/** Fundo do painel: a foto do próprio imóvel, ampliada, desfocada e tingida com a cor do imóvel. */
export function PanelBackdrop({ study: s }: { study: Study }) {
  return (
    <div className="panel-backdrop" style={{ ['--tint' as string]: s.theme.tint }} aria-hidden>
      <img src={s.images.blur} alt="" />
    </div>
  )
}

/* ───────────── posição de mercado ───────────── */
function MarketStrip({ s }: { s: Study }) {
  const [tip, setTip] = useState<{ x: number; label: string; detail: string } | null>(null)
  const L = s.market.listings
  const [s6, s12] = s.scenarios
  const prices = marketPrices(s)
  if (!prices.length) return null
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
    <figure className="fx-card fx-market px-4 pb-3 pt-3.5 md:px-5" aria-label="Posição de mercado: lance, avaliação, anúncios e venda projetada" data-reveal="up" data-delay="0.5">
      <figcaption className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
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
          {L.length ? `anúncios ${brlK(minL)}–${brlK(maxL)}` : 'parecidos'}
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
          { v: s.appraisal.value, k: appraisalLabel(s), acc: false },
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
    <div className="fx-card flex h-full min-h-0 min-w-0 flex-col p-4 md:p-[clamp(12px,1.8vh,18px)]" data-reveal="up" data-delay="0.35">
      <p className="text-[16px] font-semibold tracking-tight text-ink md:text-[clamp(14px,1vw,18px)]">Quanto você vai investir</p>
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
                <td title={r.label} className={`w-full py-[7px] pr-2 text-[13px] leading-[1.3] md:max-w-0 md:truncate md:py-[clamp(3px,0.5vh,6px)] md:text-[clamp(11px,0.8vw,14px)] ${r.value === 0 ? 'text-mute' : 'text-ink-2'}`}>
                  {r.label}
                  {r.ref && <span className="ml-1 text-[10px] text-mute">(fora do total)</span>}
                </td>
                <td className={`mono whitespace-nowrap text-right text-[13px] md:text-[clamp(11px,0.8vw,14px)] font-semibold ${r.value === 0 ? 'text-mute' : 'text-ink'}`}>
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
      <p className="fx-tall mt-2 text-[11px] leading-snug text-mute">
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
    { k: `IRGC (${a.taxPct}%)`, a: `−${a.taxPct}%`, b: `−${b.taxPct}%` },
  ]
  const V = 'mono whitespace-nowrap pl-2 text-right text-[13px] md:text-[clamp(11px,0.8vw,14px)] font-semibold'
  return (
    <div className="fx-card flex h-full min-h-0 min-w-0 flex-col p-4 md:p-[clamp(12px,1.8vh,18px)]" data-reveal="up" data-delay="0.45">
      <p className="text-[16px] font-semibold tracking-tight text-ink md:text-[clamp(14px,1vw,18px)]">Calculadora de lucro</p>
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
              <td title={r.k} className="w-full py-[7px] pr-1 text-[13px] leading-[1.3] text-ink-2 md:max-w-0 md:truncate md:py-[clamp(3px,0.5vh,6px)] md:text-[clamp(11px,0.8vw,14px)]">{r.k}</td>
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
      {s.financing && <p className="fx-tall mt-2 text-[11px] text-mute">* sobre o capital próprio (compra financiada).</p>}
    </div>
  )
}
