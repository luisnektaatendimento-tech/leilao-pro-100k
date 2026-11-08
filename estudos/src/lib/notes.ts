import type { Study } from '../data/types'
import { brl, dateBR, pct } from './format'
import { appraisalLabel, discountPct, hero, taxValue } from './derive'

/** Notas do apresentador de um imóvel — só dados do PDF e cálculos sinalizados. */
export function notesFor(s: Study): string[] {
  const h = hero(s)
  const [s6, s12] = s.scenarios
  return [
    `${s.sale.modality}${s.sale.date ? ` · ${dateBR(s.sale.date)} ${s.sale.time ?? ''}` : ''}${s.sale.lot ? ` · Nº do bem ${s.sale.lot}` : ''}.`,
    `${appraisalLabel(s)} ${brl(s.appraisal.value)} · lance inicial ${brl(s.minimumBid)} · desconto calculado ${pct(discountPct(s), 1)}.`,
    `Investimento total ${brl(s.costs.total)}. Venda projetada ${brl(s6.sale)} (6m) / ${brl(s12.sale)} (12m).`,
    `Lucro líquido ${brl(h.netResult)} (${h.months}m) · ${s.roiLabel} ${pct(h.netRoi)} · IRGC calculado ${brl(taxValue(h))}.`,
    ...s.caveats.map((c) => `⚠ ${c}`),
  ]
}
