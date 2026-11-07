import type { Study } from '../data/types'

/** Valores derivados por aritmética simples a partir do PDF — sempre exibidos como "calculado". */
export const discountPct = (s: Study) => Math.round((1 - s.minimumBid / s.appraisal.value) * 1000) / 10
export const discountValue = (s: Study) => Math.round((s.appraisal.value - s.minimumBid) * 100) / 100
export const taxValue = (sc: Study['scenarios'][number]) => Math.round((sc.grossResult - sc.netResult) * 100) / 100
export const hero = (s: Study) => s.scenarios[s.heroScenario]
export const costItems = (s: Study) => s.costs.items.filter((r) => !r.ref)
