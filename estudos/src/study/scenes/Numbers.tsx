import { useState } from 'react'
import { useStudy } from '../ctx'
import { brl, brlK, pct } from '../../lib/format'
import { costItems, hero, taxValue } from '../../lib/derive'
import { Count, Label, Prism, Words } from '../primitives'
import { PAD } from './Opening'

const H2 = 'display mt-3 text-[clamp(2.1rem,min(4vw,8vh),4.4rem)]'

/* ───────────────────── Composição do investimento ───────────────────── */
export function Composition() {
  const { study: s } = useStudy()
  const [hover, setHover] = useState<number | null>(null)
  const items = s.costs.items
  const parts = costItems(s).filter((r) => r.value > 0)
  const total = s.costs.total
  const maxV = Math.max(...items.filter((r) => !r.ref).map((r) => r.value))
  const isTop = (v: number) => v === maxV
  return (
    <div className={`relative z-10 grid h-full content-center items-center gap-6 md:grid-cols-[1fr_1.15fr] md:gap-[5vw] ${PAD}`}>
      <div>
        <Label>Estimativa de custos</Label>
        <h2 className={`${H2} hidden md:block`}>
          <Words text="Composição do investimento" delay={0.1} />
        </h2>
        <p className="num mt-3 md:mt-8 whitespace-nowrap text-[clamp(2.4rem,min(4.6vw,10vh),5.4rem)]" data-reveal="z" data-delay="0.2">
          <Count value={total} fmt="brl" delay={0.3} />
        </p>
        <p className="label mt-3">Investimento total</p>
        {/* barra empilhada com 2px de respiro entre segmentos */}
        <div className="mt-8 hidden h-3 w-full gap-[2px] md:flex" role="img" aria-label="Participação de cada custo no investimento total">
          {parts.map((r) => {
            const idx = items.indexOf(r)
            return (
              <span
                key={r.label}
                className="h-full rounded-[2px] transition-opacity duration-500"
                style={{
                  flexGrow: r.value,
                  background: isTop(r.value) ? 'var(--acc)' : 'rgb(237 234 228 / .45)',
                  opacity: hover === null || hover === idx ? 1 : 0.25,
                }}
                data-grow="x"
                onMouseEnter={() => setHover(idx)}
                onMouseLeave={() => setHover(null)}
              />
            )
          })}
        </div>
      </div>

      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Estimativa de custos</caption>
        <thead>
          <tr className="label">
            <th className="pb-3 font-normal">Item</th>
            <th className="hidden pb-3 font-normal sm:table-cell" aria-hidden />
            <th className="pb-3 text-right font-normal">Valor</th>
            <th className="hidden pb-3 text-right font-normal md:table-cell">% do total*</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, i) => {
            const share = r.ref ? 0 : r.value / total
            const dim = r.value === 0
            return (
              <tr
                key={r.label}
                className="border-t border-white/[.08] transition-colors duration-500"
                style={{ background: hover === i ? 'rgb(237 234 228 / .04)' : undefined }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                data-reveal="up"
                data-delay={0.3 + i * 0.05}
              >
                <td className={`py-[clamp(5px,1.3vh,12px)] pr-4 text-[clamp(12px,1vw,14px)] ${dim ? 'text-mute' : 'text-ink'}`}>
                  {r.label}
                  {r.ref && <span className="label ml-2 !text-[10px]">não compõe o total</span>}
                </td>
                <td className="hidden w-[22%] pr-4 sm:table-cell">
                  {!r.ref && (
                    <span className="block h-[3px] rounded-full bg-white/[.06]">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${share * 100}%`, background: isTop(r.value) ? 'var(--acc)' : 'rgb(237 234 228 / .5)' }}
                        data-grow="x"
                        data-delay={0.5 + i * 0.05}
                      />
                    </span>
                  )}
                </td>
                <td className={`mono py-2 text-right text-[clamp(12px,1vw,14px)] ${dim ? 'text-mute' : 'text-ink'}`}>{brl(r.value)}</td>
                <td className="mono hidden py-2 pl-4 text-right text-[12px] text-ink-2 md:table-cell">{r.ref ? '—' : pct(share * 100, 1)}</td>
              </tr>
            )
          })}
          <tr className="border-t border-white/25">
            <td className="pt-3 text-[14px] font-medium">Investimento total</td>
            <td className="hidden sm:table-cell" />
            <td className="mono pt-3 text-right text-[14px] acc">{brl(total)}</td>
            <td className="mono hidden pt-3 text-right text-[12px] text-ink-2 md:table-cell">100%</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="label hidden pt-4 !normal-case !tracking-normal md:table-cell">
              * percentual calculado sobre o investimento total do PDF
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

/* ───────────────────── Estrutura financiada ───────────────────── */
export function Financing() {
  const { study: s } = useStudy()
  const f = s.financing!
  const bid = s.costs.items.find((r) => r.ref)?.value ?? s.minimumBid
  const rest = bid - f.downPayment
  const tiles = [
    { k: 'Parcela mensal', v: f.installment },
    { k: 'Saldo devedor · 6 meses', v: f.balance6 },
    { k: 'Saldo devedor · 12 meses', v: f.balance12 },
  ]
  return (
    <div className={`relative z-10 flex h-full flex-col justify-center ${PAD}`}>
      <Label>Comparativo · capital próprio × financiado</Label>
      <h2 className={H2}>
        <Words text="Estrutura financiada" delay={0.1} />
      </h2>
      <div className="mt-[6vh]">
        <div className="flex items-end justify-between gap-6 pb-4">
          <div data-reveal="up" data-delay="0.3">
            <p className="label">{f.downPaymentLabel}</p>
            <p className="num acc mt-2 text-[clamp(2.6rem,5.4vw,5.6rem)]">
              <Count value={f.downPayment} fmt="brl" />
            </p>
          </div>
          <div className="text-right" data-reveal="up" data-delay="0.4">
            <p className="label">Restante financiado · calculado</p>
            <p className="num mt-2 text-[clamp(2rem,3.6vw,3.6rem)] text-ink-2">{brl(rest)}</p>
          </div>
        </div>
        <div className="flex h-4 gap-[2px]" role="img" aria-label={`Valor arrematado ${brl(bid)}: entrada ${brl(f.downPayment)} e restante ${brl(rest)}`}>
          <span className="h-full rounded-[2px]" style={{ flexGrow: f.downPayment, background: 'var(--acc)' }} data-grow="x" data-delay="0.5" />
          <span className="h-full rounded-[2px] bg-white/20" style={{ flexGrow: rest }} data-grow="x" data-delay="0.65" />
        </div>
        <p className="label mt-3 !normal-case !tracking-normal">Valor arrematado {brl(bid)}</p>
      </div>
      <dl className="mt-[6vh] grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
        {tiles.map((t, i) => (
          <div key={t.k} className="bg-[#0c0c0e] p-5 md:p-6" data-reveal="up" data-delay={0.7 + i * 0.08}>
            <dt className="label">{t.k}</dt>
            <dd className="mono mt-3 text-[clamp(1.2rem,2vw,1.8rem)]">{brl(t.v)}</dd>
          </div>
        ))}
      </dl>
      <p className="label mt-5 !normal-case !tracking-normal" data-reveal="fade" data-delay="1">
        Com financiamento, o ROI deste estudo é calculado sobre o capital próprio investido.
      </p>
    </div>
  )
}

/* ───────────────────── Custos do período ───────────────────── */
export function Period() {
  const { study: s } = useStudy()
  const { items, op6, op12 } = s.period
  return (
    <div className={`relative z-10 grid h-full items-center gap-10 md:grid-cols-[1fr_1.2fr] md:gap-[6vw] ${PAD}`}>
      <div>
        <Label>Custos do período</Label>
        <h2 className={H2}>
          <Words text="O custo de manter até a venda" delay={0.1} />
        </h2>
        <ul className="mt-8 max-w-md">
          {items.map((r, i) => (
            <li key={r.label} className="flex justify-between border-t border-white/[.08] py-3 text-[14px]" data-reveal="up" data-delay={0.3 + i * 0.05}>
              <span className={r.value ? 'text-ink' : 'text-mute'}>{r.label}</span>
              <span className={`mono ${r.value ? 'text-ink' : 'text-mute'}`}>{brl(r.value)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="label mb-6">Custo operacional acumulado</p>
        {[
          { k: '6 meses', v: op6 },
          { k: '12 meses', v: op12 },
        ].map((b, i) => (
          <div key={b.k} className="mb-[5vh]">
            <div className="flex items-baseline justify-between">
              <span className="display text-[clamp(1.8rem,3vw,3rem)]" data-reveal="up" data-delay={0.3 + i * 0.12}>
                {b.k}
              </span>
              <span className="num text-[clamp(2rem,4vw,4rem)]" data-reveal="up" data-delay={0.35 + i * 0.12}>
                <Count value={b.v} fmt="brl" delay={0.4 + i * 0.12} />
              </span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/[.06]">
              <div className="h-full rounded-full" style={{ width: `${(b.v / op12) * 100}%`, background: i ? 'rgb(237 234 228 / .55)' : 'var(--acc)' }} data-grow="x" data-delay={0.5 + i * 0.15} />
            </div>
          </div>
        ))}
        {/* régua de 12 meses */}
        <div className="flex justify-between" aria-hidden data-reveal="fade" data-delay="0.9">
          {Array.from({ length: 13 }, (_, m) => (
            <span key={m} className="flex flex-col items-center gap-1.5">
              <span className={`w-px ${m % 6 === 0 ? 'h-3 bg-white/40' : 'h-1.5 bg-white/15'}`} />
              <span className="mono text-[9px] text-mute">{m % 3 === 0 ? `${m}m` : ''}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────── 6 meses × 12 meses ───────────────────── */
export function Compare() {
  const { study: s } = useStudy()
  const [a, b] = s.scenarios
  const rows: { k: string; a: string; b: string; strong?: boolean; acc?: boolean }[] = [
    { k: 'Venda final', a: brl(a.sale), b: brl(b.sale) },
    ...(a.balance !== undefined ? [{ k: 'Saldo devedor', a: `−${brl(a.balance)}`, b: `−${brl(b.balance!)}` }] : []),
    { k: a.brokerageLabel, a: `−${brl(a.brokerage)}`, b: `−${brl(b.brokerage)}` },
    { k: 'Investimento total', a: brl(a.investment), b: brl(b.investment) },
    { k: 'Resultado bruto', a: brl(a.grossResult), b: brl(b.grossResult), strong: true },
    { k: 'ROI bruto', a: pct(a.grossRoi), b: pct(b.grossRoi), strong: true, acc: true },
  ]
  const maxRoi = Math.max(a.grossRoi, b.grossRoi)
  const H = Math.min(window.innerHeight * 0.36, 340)
  return (
    <div className={`relative z-10 grid h-full items-center gap-10 md:grid-cols-[1.35fr_1fr] md:gap-[5vw] ${PAD}`}>
      <div>
        <Label>Projeção de venda</Label>
        <h2 className={H2}>
          <span className="inline-flex items-baseline gap-[0.25em]">
            <Words text="6 meses" delay={0.1} />
            <span className="text-mute" data-reveal="fade" data-delay="0.25">×</span>
            <Words text="12 meses" delay={0.3} />
          </span>
        </h2>
        <table className="mt-8 w-full border-collapse">
          <caption className="sr-only">Comparativo dos cenários de 6 e 12 meses</caption>
          <thead>
            <tr className="label">
              <th className="pb-3 text-left font-normal">Item</th>
              <th className="pb-3 text-right font-normal">6 meses</th>
              <th className="pb-3 text-right font-normal">12 meses</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.k} className={`border-t ${r.strong ? 'border-white/20' : 'border-white/[.08]'}`} data-reveal="up" data-delay={0.35 + i * 0.06}>
                <td className={`py-[clamp(7px,1.4vh,13px)] text-[clamp(12px,1vw,14px)] ${r.strong ? 'text-ink' : 'text-ink-2'}`}>{r.k}</td>
                <td className={`mono text-right text-[clamp(12px,1.05vw,15px)] ${r.acc ? 'acc' : 'text-ink'}`}>{r.a}</td>
                <td className={`mono text-right text-[clamp(12px,1.05vw,15px)] ${r.acc ? 'acc' : 'text-ink'}`}>{r.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figure className="hidden justify-self-center md:block" aria-hidden>
        <p className="label mb-8 text-center">ROI bruto</p>
        <div className="tilt3d flex items-end gap-16">
          {s.scenarios.map((sc, i) => (
            <div key={sc.months} className="flex flex-col items-center">
              <span className="num mb-5 text-[clamp(1.6rem,2.6vw,2.6rem)]" data-reveal="fade" data-delay={0.9 + i * 0.12}>
                {pct(sc.grossRoi)}
              </span>
              <Prism h={(sc.grossRoi / maxRoi) * H} w={80} depth={42} acc={sc.grossRoi === maxRoi} delay={0.5 + i * 0.15} />
              <span className="label mt-5">{sc.months} meses</span>
            </div>
          ))}
        </div>
      </figure>
    </div>
  )
}

/* ───────────────────── Resultado líquido (big number + cascata) ───────────────────── */
export function Profit() {
  const { study: s } = useStudy()
  const h = hero(s)
  const other = s.scenarios[h.months === 6 ? 1 : 0]
  const tax = taxValue(h)
  const [tip, setTip] = useState<number | null>(null)

  // cascata: venda → (saldo) → corretagem → investimento → bruto → IRGC → líquido
  type Step = { k: string; v: number; kind: 'start' | 'minus' | 'total'; calc?: boolean; acc?: boolean }
  const steps: Step[] = [
    { k: 'Venda final', v: h.sale, kind: 'start' },
    ...(h.balance !== undefined ? [{ k: 'Saldo devedor', v: h.balance, kind: 'minus' as const }] : []),
    { k: 'Corretagem', v: h.brokerage, kind: 'minus' },
    { k: 'Investimento', v: h.investment, kind: 'minus' },
    { k: 'Resultado bruto', v: h.grossResult, kind: 'total' },
    { k: `IRGC ${h.taxPct}%`, v: tax, kind: 'minus', calc: true },
    { k: 'Resultado líquido', v: h.netResult, kind: 'total', acc: true },
  ]
  let level = 0
  const bars = steps.map((st) => {
    let from = 0, to = 0
    if (st.kind === 'start') (from = 0), (to = st.v), (level = st.v)
    else if (st.kind === 'minus') (from = level - st.v), (to = level), (level -= st.v)
    else (from = 0), (to = st.v), (level = st.v)
    return { ...st, from, to }
  })
  const max = h.sale
  const H = Math.min(window.innerHeight * 0.4, 380)

  return (
    <div className={`relative z-10 grid h-full items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-[4vw] ${PAD}`}>
      <div>
        <Label>Resultado líquido · cenário {h.months} meses</Label>
        <div style={{ perspective: 900 }}>
          <p className="num mt-5 whitespace-nowrap text-[clamp(2.8rem,min(6.2vw,14vh),7.4rem)]" data-reveal="z" data-delay="0.1">
            <Count value={h.netResult} fmt="brl" delay={0.25} />
          </p>
        </div>
        <p className="mt-3 text-[clamp(.95rem,1.2vw,1.1rem)] text-ink-2" data-reveal="up" data-delay="0.4">
          de lucro líquido após IRGC de {h.taxPct}% sobre o resultado bruto
        </p>
        <div className="mt-10 flex flex-wrap items-end gap-x-14 gap-y-6">
          <div data-reveal="up" data-delay="0.55">
            <p className="label">{s.roiLabel}</p>
            <p className="num acc mt-2 text-[clamp(2.6rem,5vw,5rem)]">
              <Count value={h.netRoi} fmt="pct" delay={0.6} />
            </p>
          </div>
          <div data-reveal="up" data-delay="0.7">
            <p className="label">Cenário {other.months} meses</p>
            <p className="mono mt-3 text-[clamp(1rem,1.4vw,1.25rem)] text-ink">{brl(other.netResult)}</p>
            <p className="mono text-[13px] text-ink-2">{pct(other.netRoi)}</p>
          </div>
        </div>
      </div>

      <figure className="relative hidden md:block" aria-label="Cascata do resultado">
        <p className="label mb-6">Da venda ao lucro · {h.months} meses</p>
        <div className="relative flex items-end gap-[2px] border-b border-white/20" style={{ height: H }}>
          {bars.map((b, i) => (
            <div
              key={b.k}
              className="relative h-full flex-1"
              onMouseEnter={() => setTip(i)}
              onMouseLeave={() => setTip(null)}
              tabIndex={0}
              onFocus={() => setTip(i)}
              onBlur={() => setTip(null)}
              aria-label={`${b.k}: ${b.kind === 'minus' ? '−' : ''}${brl(b.v)}${b.calc ? ' (calculado)' : ''}`}
            >
              <div
                className="absolute inset-x-[14%] rounded-t-[4px]"
                style={{
                  bottom: `${(b.from / max) * 100}%`,
                  height: `${Math.max(0.4, ((b.to - b.from) / max) * 100)}%`,
                  background: b.acc ? 'var(--acc)' : b.kind === 'minus' ? 'repeating-linear-gradient(135deg, rgb(237 234 228 / .22) 0 2px, transparent 2px 6px)' : 'rgb(237 234 228 / .6)',
                  border: b.kind === 'minus' ? '1px solid rgb(237 234 228 / .25)' : undefined,
                  opacity: tip === null || tip === i ? 1 : 0.35,
                  transition: 'opacity .5s',
                }}
                data-grow="y"
                data-delay={0.4 + i * 0.1}
              />
              <span
                className={`mono absolute inset-x-0 text-center text-[10px] ${b.acc ? 'acc' : 'text-ink-2'}`}
                style={{ bottom: `calc(${(b.to / max) * 100}% + 6px)` }}
                data-reveal="fade"
                data-delay={0.9 + i * 0.08}
              >
                {b.kind === 'minus' ? '−' : ''}
                {brlK(b.v).replace('R$ ', '')}
              </span>
            </div>
          ))}
          {tip !== null && (
            <div className="tip" style={{ left: `${((tip + 0.5) / bars.length) * 100}%`, bottom: `calc(${(bars[tip].to / max) * 100}% + 30px)`, transform: 'translateX(-50%)' }} role="tooltip">
              <p className="mono text-[13px] text-ink">
                {bars[tip].kind === 'minus' ? '−' : ''}
                {brl(bars[tip].v)}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-2">
                {bars[tip].k}
                {bars[tip].calc ? ' · calculado (bruto − líquido)' : ''}
              </p>
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-[2px]">
          {bars.map((b) => (
            <span key={b.k} className="label flex-1 text-center !text-[10px] !leading-tight">
              {b.k}
            </span>
          ))}
        </div>
      </figure>
    </div>
  )
}
