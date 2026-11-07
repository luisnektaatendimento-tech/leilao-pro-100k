import type { Study } from '../data/types'
import { brl, pct } from './format'
import { discountPct, hero } from './derive'

export interface Highlight {
  label: string
  value: string
}

/**
 * "Destaque" de cada imóvel: em que ele lidera entre os estudos do portfólio.
 * Comparação direta entre os números dos estudos (nada é inventado).
 */
export function highlightsFor(s: Study, all: Study[]): Highlight[] {
  const out: Highlight[] = []
  const top = (f: (x: Study) => number, dir: 1 | -1, pool = all) => pool.reduce((a, b) => (f(b) * dir > f(a) * dir ? b : a))
  if (top(discountPct, 1).slug === s.slug) out.push({ label: 'Maior desconto do portfólio', value: pct(discountPct(s), 1) })
  if (top((x) => hero(x).netResult, 1).slug === s.slug) out.push({ label: 'Maior lucro líquido do portfólio', value: brl(hero(s).netResult) })
  if (top((x) => hero(x).netRoi, 1).slug === s.slug) out.push({ label: 'Maior ROI líquido do portfólio', value: pct(hero(s).netRoi) })
  const cash = all.filter((x) => !x.financing)
  if (!s.financing && cash.length > 1 && top((x) => hero(x).netRoi, 1, cash).slug === s.slug)
    out.push({ label: 'Maior ROI líquido entre as compras à vista', value: pct(hero(s).netRoi) })
  if (top((x) => x.minimumBid, -1).slug === s.slug) out.push({ label: 'Menor lance do portfólio', value: brl(s.minimumBid) })
  if (top((x) => x.property.area, 1).slug === s.slug) out.push({ label: 'Maior área do portfólio', value: `${s.property.area.toLocaleString('pt-BR')} m²` })
  if (top((x) => x.costs.total, -1).slug === s.slug) out.push({ label: 'Menor investimento do portfólio', value: brl(s.costs.total) })
  return out
}
