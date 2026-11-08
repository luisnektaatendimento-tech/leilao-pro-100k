import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Study } from '../data/types'
import { studies } from '../data/studies'
import { brl, brlK, dateBR, num, pct } from '../lib/format'
import { discountPct, hero } from '../lib/derive'
import { highlightsFor } from '../lib/highlights'
import { buildTimeline } from '../lib/timeline'
import { sound } from '../lib/sound'
import { Icon } from '../components/Icon'
import { Count } from './primitives'
import { useStudy } from './ctx'

/**
 * Experiência dedicada ao celular: foto, resumo com os 3 números principais
 * e abas com um assunto por vez (Resumo, Custos, Lucro, Pagamentos).
 */

type Tab = 'resumo' | 'custos' | 'lucro' | 'pagamentos'
const TABS: { key: Tab; label: string }[] = [
  { key: 'resumo', label: 'Resumo' },
  { key: 'custos', label: 'Custos' },
  { key: 'lucro', label: 'Lucro' },
  { key: 'pagamentos', label: 'Pagamentos' },
]

const signed = (v: number) => (v < 0 ? `−${brl(-v)}` : v > 0 ? `+${brl(v)}` : brl(0))
const neighborhood = (s: Study) => {
  const parts = s.property.address.split(' · ')
  return `${parts[parts.length - 1]} · ${s.property.city.split(' · ')[0]}`
}

export default function PropertyMobile({ study: s, no, total, onMap }: { study: Study; no: number; total: number; onMap: () => void }) {
  const { goTo, goHome } = useStudy()
  const [tab, setTab] = useState<Tab>('resumo')
  const [sc, setSc] = useState<0 | 1>(s.heroScenario)
  const scroller = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const h = hero(s)

  const pick = (t: Tab) => {
    if (t === tab) return
    sound.click()
    setTab(t)
    // leva o topo das abas para logo abaixo da barra superior
    const el = scroller.current
    const bar = tabsRef.current
    if (el && bar && el.scrollTop > bar.offsetTop - 44) el.scrollTo({ top: bar.offsetTop - 44, behavior: 'smooth' })
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* barra superior */}
      <header className="m-bar fixed inset-x-0 top-0 z-30 flex items-center justify-between px-2 pt-[env(safe-area-inset-top)]">
        <button className="flex h-11 items-center gap-0.5 pl-1 pr-3 text-[17px] text-[var(--acc)]" onClick={goHome} aria-label="Voltar aos estudos">
          <Icon name="left" size={24} stroke={2.2} /> Estudos
        </button>
        <span className="text-[15px] font-semibold text-ink tnum">
          {no} de {total}
        </span>
        <button className="grid h-11 w-11 place-items-center text-[var(--acc)]" onClick={onMap} aria-label="Ver todos os estudos">
          <Icon name="map" size={20} stroke={1.8} />
        </button>
      </header>

      <div ref={scroller} className="m-scroll h-full overflow-y-auto overscroll-contain pb-[calc(88px+env(safe-area-inset-bottom))]" style={{ ['--tint' as string]: s.theme.tint }}>
        {/* foto de ponta a ponta */}
        <div data-photo className="relative aspect-[4/3.2] w-full overflow-hidden">
          <img src={s.images.photo} alt={`Fachada do ${s.fullTitle}`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
          <div className="absolute inset-x-4 top-[calc(56px+env(safe-area-inset-top))] flex flex-wrap gap-1.5">
            <span className="fx-pill fx-dark px-2.5 py-1 text-[12px]">{s.sale.modality}</span>
            {s.sale.date && <span className="fx-pill fx-dark px-2.5 py-1 text-[12px] tnum">{dateBR(s.sale.date)}</span>}
            {s.financing && <span className="fx-pill bg-[var(--color-blue)] px-2.5 py-1 text-[12px] text-white">Financiado</span>}
          </div>
        </div>

        <div className="relative -mt-16 px-4">
          <p className="text-[13px] text-ink-2">{s.property.unit}</p>
          <h1 className="mt-0.5 text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-ink">{s.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-[15px] text-ink-2">
            <span style={{ color: 'var(--tint)' }}>
              <Icon name="pin" size={15} />
            </span>
            {neighborhood(s)}
          </p>

          {/* resumo: os 3 números */}
          <section className="ios-group mt-5 p-4" aria-label="Resumo dos números">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] text-ink-2">Lance inicial</p>
                <p className="num mt-1 whitespace-nowrap text-[clamp(21px,6.8vw,26px)]">{brl(s.minimumBid)}</p>
              </div>
              <span className="fx-pill fx-tinted mt-5 px-2.5 py-1 text-[13px]">−{pct(discountPct(s), 1)}</span>
            </div>
            <p className="mt-1 text-[13px] text-mute">
              Avaliação {s.appraisal.source}: <span className="line-through">{brl(s.appraisal.value)}</span>
            </p>
            <div className="my-4 h-px bg-white/10" />
            <div className="grid grid-cols-[1.3fr_1fr] gap-3">
              <div>
                <p className="text-[13px] text-ink-2">Lucro líquido</p>
                <p className="num mt-1 whitespace-nowrap text-[clamp(18px,5.7vw,22px)]">
                  <Count value={h.netResult} fmt="brl" />
                </p>
                <p className="mt-0.5 text-[12px] text-mute">venda em {h.months} meses</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] text-ink-2">{s.financing ? 'ROI s/ capital' : 'ROI líquido'}</p>
                <p className="num acc mt-1 whitespace-nowrap text-[clamp(24px,7.6vw,30px)]">
                  <Count value={h.netRoi} fmt="pct" />
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* abas */}
        <div ref={tabsRef} className="m-tabs sticky top-[calc(44px+env(safe-area-inset-top))] z-20 mt-5 px-4 pb-2.5 pt-2">
          <div className="seg flex w-full" role="tablist" aria-label="Seções">
            {TABS.map((t) => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} aria-pressed={tab === t.key} onClick={() => pick(t.key)} className="flex-1 !px-1 !text-[13px]">
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div key={tab} className="mode-in px-4 pt-3">
          {tab === 'resumo' && <Resumo s={s} />}
          {tab === 'custos' && <Custos s={s} />}
          {tab === 'lucro' && <Lucro s={s} sc={sc} setSc={setSc} />}
          {tab === 'pagamentos' && <Pagamentos s={s} sc={sc} setSc={setSc} />}
        </div>
        <p className="px-4 pb-2 pt-6 text-center text-[11px] leading-snug text-mute">Estudo informativo · valores sujeitos a alterações</p>
      </div>

      {/* paginação entre imóveis */}
      <nav className="m-bar m-bar-bottom fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2" aria-label="Imóveis">
        <button className="grid h-11 w-11 flex-none place-items-center rounded-full fx-gray disabled:opacity-30" onClick={() => goTo(no - 2)} disabled={no === 1} aria-label="Imóvel anterior">
          <Icon name="left" size={20} stroke={2} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[15px] font-semibold text-ink">{s.title}</p>
          <div className="mt-1 flex justify-center gap-1.5" aria-hidden>
            {studies.map((x, i) => (
              <span key={x.slug} className="h-1.5 rounded-full transition-all duration-500" style={{ width: i === no - 1 ? 18 : 6, background: i === no - 1 ? 'var(--acc)' : 'rgb(255 255 255 / .25)' }} />
            ))}
          </div>
        </div>
        <button className="grid h-11 w-11 flex-none place-items-center rounded-full fx-gray disabled:opacity-30" onClick={() => goTo(no)} disabled={no === total} aria-label="Próximo imóvel">
          <Icon name="right" size={20} stroke={2} />
        </button>
      </nav>
    </div>
  )
}

/* ───────── blocos reutilizados ───────── */
function Group({ title, children, footer }: { title?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <section className="mb-6">
      {title && <h2 className="mb-2 px-1 text-[20px] font-bold tracking-[-0.02em] text-ink">{title}</h2>}
      <div className="ios-group">{children}</div>
      {footer && <p className="mt-2 px-1 text-[13px] leading-snug text-mute">{footer}</p>}
    </section>
  )
}

function Row({ label, value, sub, strong, tone }: { label: ReactNode; value: ReactNode; sub?: ReactNode; strong?: boolean; tone?: 'acc' | 'mute' | 'pos' }) {
  return (
    <div className="ios-row">
      <div className="min-w-0">
        <p className={`text-[15px] leading-snug ${strong ? 'font-semibold text-ink' : tone === 'mute' ? 'text-mute' : 'text-ink'}`}>{label}</p>
        {sub && <p className="mt-0.5 text-[12px] text-mute">{sub}</p>}
      </div>
      <p className={`mono flex-none text-right text-[15px] ${strong ? 'font-semibold' : ''} ${tone === 'acc' ? 'acc' : tone === 'mute' ? 'text-mute' : tone === 'pos' ? 'text-[var(--color-green)]' : 'text-ink'}`}>{value}</p>
    </div>
  )
}

function ScenarioToggle({ s, sc, setSc }: { s: Study; sc: 0 | 1; setSc: (v: 0 | 1) => void }) {
  return (
    <div className="seg mb-4 flex w-full" role="group" aria-label="Cenário de venda">
      {s.scenarios.map((x, i) => (
        <button key={x.months} aria-pressed={sc === i} onClick={() => setSc(i as 0 | 1)} className="flex-1">
          Venda em {x.months} meses
        </button>
      ))}
    </div>
  )
}

/* ───────── Resumo ───────── */
function Resumo({ s }: { s: Study }) {
  const p = s.property
  const hl = highlightsFor(s, studies)
  const prices = s.market.listings.map((l) => l.price)
  const [s6, s12] = s.scenarios
  const specs = [
    { icon: 'area', v: `${num(p.area, 2)} m²`, k: 'Área' },
    p.bedrooms !== undefined && { icon: 'bed', v: String(p.bedrooms), k: p.bedrooms > 1 ? 'Quartos' : 'Quarto' },
    p.bathrooms !== undefined && { icon: 'bath', v: String(p.bathrooms), k: p.bathrooms > 1 ? 'Banheiros' : 'Banheiro' },
    p.parking !== undefined && { icon: 'car', v: String(p.parking), k: p.parking > 1 ? 'Vagas' : 'Vaga' },
    { icon: 'coin', v: brl(p.condoFee), k: 'Condomínio/mês' },
  ].filter(Boolean) as { icon: string; v: string; k: string }[]
  return (
    <>
      {hl.length > 0 && (
        <div className="mb-6 flex flex-col gap-2">
          {hl.slice(0, 2).map((x) => (
            <div key={x.label} className="flex items-center gap-3 rounded-[14px] p-3" style={{ background: 'color-mix(in srgb, var(--tint) 12%, transparent)' }}>
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full" style={{ background: 'var(--tint)', color: '#000' }}>
                <Icon name="spark" size={15} stroke={2} />
              </span>
              <p className="min-w-0 flex-1 text-[14px] leading-snug text-ink">{x.label}</p>
              <p className="mono flex-none text-[15px] font-semibold text-ink">{x.value}</p>
            </div>
          ))}
        </div>
      )}

      <Group title="O imóvel" footer={`${p.address} · ${p.city}`}>
        <div className="grid grid-cols-2 gap-px bg-white/[.06]">
          {specs.map((x, i) => (
            <div key={x.k} className={`flex items-center gap-3 bg-[var(--color-panel)] p-3.5 ${specs.length % 2 && i === specs.length - 1 ? 'col-span-2' : ''}`}>
              <span className="fx-ico flex-none" style={{ color: 'var(--tint)' }}>
                <Icon name={x.icon} size={17} />
              </span>
              <div className="min-w-0">
                <p className="mono truncate text-[16px] font-semibold text-ink">{x.v}</p>
                <p className="text-[12px] text-mute">{x.k}</p>
              </div>
            </div>
          ))}
        </div>
      </Group>

      <Group title="Mercado" footer={s.market.from ? `Imóveis parecidos na região a partir de ${brl(s.market.from)}, conforme o estudo.` : 'Anúncios de imóveis parecidos na região, conforme o estudo.'}>
        <Row label="Lance inicial" value={brl(s.minimumBid)} tone="acc" strong />
        <Row label={`Avaliação ${s.appraisal.source}`} value={brl(s.appraisal.value)} />
        <Row label="Anúncios parecidos" sub={`${prices.length} anúncios na região`} value={`${brlK(Math.min(...prices))} a ${brlK(Math.max(...prices)).replace('R$ ', '')}`} />
        {s6.sale === s12.sale ? (
          <Row label="Venda projetada" sub="em 6 ou 12 meses" value={brl(s6.sale)} strong />
        ) : (
          <>
            <Row label="Venda projetada" sub="em 6 meses" value={brl(s6.sale)} strong />
            <Row label="Venda projetada" sub="em 12 meses" value={brl(s12.sale)} strong />
          </>
        )}
      </Group>

      <details className="ios-group group mb-6">
        <summary className="ios-row cursor-pointer list-none">
          <span className="flex items-center gap-2.5 text-[15px] text-ink">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-green)] text-black">
              <Icon name="check" size={15} stroke={2.6} />
            </span>
            Valor de mercado validado
          </span>
          <span className="flex items-center gap-1 text-[15px] text-mute">
            {s.validation.length} de {s.validation.length}
            <span className="transition-transform group-open:rotate-90">
              <Icon name="right" size={16} />
            </span>
          </span>
        </summary>
        {s.validation.map((v) => (
          <div key={v} className="ios-row !justify-start gap-2.5 text-[14px] text-ink-2">
            <span className="text-[var(--color-green)]">
              <Icon name="check" size={15} stroke={2.4} />
            </span>
            {v}
          </div>
        ))}
      </details>
    </>
  )
}

/* ───────── Custos ───────── */
function Custos({ s }: { s: Study }) {
  const items = s.costs.items
  return (
    <>
      <div className="mb-4 rounded-[14px] p-4" style={{ background: 'rgb(var(--acc-rgb) / .1)' }}>
        <p className="text-[13px] text-ink-2">Investimento para comprar e regularizar</p>
        <p className="num acc mt-1 text-[28px]">{brl(s.costs.total)}</p>
        {s.financing && <p className="mt-1 text-[12px] text-ink-2">Com financiamento: entra só a entrada de 30%, não o valor total do imóvel.</p>}
      </div>
      <Group title="Para onde vai o dinheiro" footer={`Mais os custos de manutenção até a venda: ${brl(s.period.op6)} em 6 meses ou ${brl(s.period.op12)} em 12 meses. Veja na aba Lucro.`}>
        {items.map((r) =>
          r.ref ? (
            <Row key={r.label} label={r.label} sub="valor do imóvel · financiado, não entra no total" value={brl(r.value)} tone="mute" />
          ) : (
            <Row key={r.label} label={r.label} value={brl(r.value)} tone={r.value === 0 ? 'mute' : undefined} sub={r.value === 0 ? 'não previsto' : undefined} />
          ),
        )}
        <Row label="Total" value={brl(s.costs.total)} strong tone="acc" />
      </Group>
    </>
  )
}

/* ───────── Lucro ───────── */
function Lucro({ s, sc, setSc }: { s: Study; sc: 0 | 1; setSc: (v: 0 | 1) => void }) {
  const x = s.scenarios[sc]
  const tax = Math.round((x.grossResult - x.netResult) * 100) / 100
  return (
    <>
      <ScenarioToggle s={s} sc={sc} setSc={setSc} />
      <Group title="Da venda ao lucro">
        <Row label="Venda do imóvel" value={`+${brl(x.sale)}`} tone="pos" />
        {x.balance !== undefined && <Row label="Quitação do financiamento" sub="saldo devedor" value={`−${brl(x.balance)}`} />}
        <Row label={x.brokerageLabel} value={`−${brl(x.brokerage)}`} />
        <Row label="Tudo o que foi investido" sub={`compra + ${x.months} meses de manutenção`} value={`−${brl(x.investment)}`} />
        <Row label="Resultado bruto" sub={`ROI bruto ${pct(x.grossRoi)}`} value={brl(x.grossResult)} strong />
        <Row label={`Imposto (IRGC ${x.taxPct}%)`} value={`−${brl(tax)}`} />
      </Group>
      <div className="mb-6 rounded-[18px] p-5" style={{ background: 'rgb(var(--acc-rgb) / .1)' }}>
        <p className="text-[13px] text-ink-2">Lucro líquido · venda em {x.months} meses</p>
        <p className="num acc mt-1 text-[34px]">{brl(x.netResult)}</p>
        <p className="mt-1 text-[15px] text-ink">
          {s.roiLabel}: <b className="font-semibold">{pct(x.netRoi)}</b>
        </p>
      </div>
    </>
  )
}

/* ───────── Pagamentos (linha do tempo) ───────── */
function Pagamentos({ s, sc, setSc }: { s: Study; sc: 0 | 1; setSc: (v: 0 | 1) => void }) {
  const phases = useMemo(() => buildTimeline(s, sc), [s, sc])
  const root = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>('[data-v]') ?? []
    if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('is-in'))
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')), { threshold: 0.2 })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [phases])
  const x = s.scenarios[sc]
  return (
    <>
      <ScenarioToggle s={s} sc={sc} setSc={setSc} />
      <p className="mb-5 px-1 text-[14px] leading-snug text-ink-2">O que você paga em cada etapa e quanto dinheiro fica aplicado até a venda.</p>
      <ol ref={root} className="relative">
        <span className="absolute bottom-6 left-[15px] top-4 w-[2px] rounded" style={{ background: 'color-mix(in srgb, var(--tint) 35%, transparent)' }} aria-hidden />
        {phases.map((p, i) => {
          const last = p.key === 'resultado'
          return (
            <li key={p.key} data-v className="tl-v relative mb-4 pl-11">
              <span className="absolute left-0 top-3 grid h-8 w-8 place-items-center rounded-full text-[13px] font-bold" style={{ background: last ? 'var(--acc)' : 'var(--tint)', color: '#000' }}>
                {last ? <Icon name="check" size={15} stroke={2.6} /> : i + 1}
              </span>
              {last ? (
                <div className="rounded-[18px] p-4" style={{ background: 'rgb(var(--acc-rgb) / .1)' }}>
                  <p className="text-[13px] text-ink-2">Resultado · venda em {x.months} meses</p>
                  <p className="num acc mt-1 text-[28px]">{brl(x.netResult)}</p>
                  <p className="mt-1 text-[14px] text-ink-2">
                    lucro líquido · {pct(x.netRoi)} sobre {brl(x.investment)} investidos
                  </p>
                </div>
              ) : (
                <div className="ios-group">
                  <div className="flex items-start justify-between gap-3 p-3.5 pb-2">
                    <div className="min-w-0">
                      <p className="text-[12px]" style={{ color: 'var(--tint)' }}>
                        {p.when}
                      </p>
                      <p className="text-[17px] font-semibold leading-snug text-ink">{p.title}</p>
                    </div>
                    <p className={`mono flex-none pt-4 text-[16px] font-semibold ${p.total > 0 ? 'text-[var(--color-green)]' : 'text-ink'}`}>{signed(p.total)}</p>
                  </div>
                  {p.items
                    .filter((it) => it.value !== 0 || p.items.length === 1)
                    .map((it) => (
                      <div key={it.label} className="flex items-baseline justify-between gap-3 px-3.5 py-1.5 text-[13px]">
                        <span className="min-w-0 text-ink-2">{it.label.replace(/ \(financiado:.*\)$/, '')}</span>
                        <span className={`mono flex-none ${it.flow > 0 ? 'text-[var(--color-green)]' : it.flow === 0 ? 'text-mute' : 'text-ink-2'}`}>{it.flow === 0 ? 'financiado' : signed(it.flow * it.value)}</span>
                      </div>
                    ))}
                  <div className="mt-1.5 flex items-center justify-between border-t border-white/[.06] px-3.5 py-2.5 text-[13px]">
                    <span className="text-mute">{p.position < 0 ? 'Aplicado até aqui' : 'Saldo até aqui'}</span>
                    <span className={`mono font-semibold ${p.position > 0 ? 'text-[var(--color-green)]' : 'text-ink'}`}>{p.position < 0 ? brl(-p.position) : signed(p.position)}</span>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ol>
      <p className="mb-2 mt-2 px-1 text-[12px] leading-snug text-mute">Ordem típica de uma compra em leilão. Prazos e formas de pagamento seguem o edital.</p>
    </>
  )
}
