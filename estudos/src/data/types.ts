/**
 * Modelo de dados de um estudo.
 * Tudo o que aparece na apresentação vem daqui — o layout nunca guarda números.
 * Valores monetários em reais (number). Percentuais exatamente como no PDF (ex.: 33.31).
 */

export interface Row {
  label: string
  value: number
  /** Texto exibido no lugar do valor formatado (ex.: "Isento"). */
  display?: string
  /** Linha informativa: aparece na lista, mas não compõe o total. */
  ref?: boolean
  /** Calculado como fração do valor arrematado (ex.: 0.05 = 5%). */
  pctOfBid?: number
  /** Custos do período: 'monthly' multiplica pelos meses; 'once' entra uma vez. */
  kind?: 'monthly' | 'once'
}

export interface Listing {
  title: string
  price: number
  area?: string
  where?: string
}

export interface Scenario {
  months: 6 | 12
  sale: number
  /** Saldo devedor quitado na venda (apenas imóveis financiados). */
  balance?: number
  brokerage: number
  brokerageLabel: string
  investment: number
  grossResult: number
  grossRoi: number
  taxPct: number
  netResult: number
  netRoi: number
}

export interface Financing {
  downPaymentLabel: string
  downPayment: number
  installment: number
  balance6: number
  balance12: number
}

export interface Study {
  slug: string
  /** Nome curto e monumental (capa, cartas). */
  title: string
  /** Nome completo como no PDF. */
  fullTitle: string
  kicker: string
  brand: { name: string; instagram: string }
  sale: {
    modality: string
    /** ISO yyyy-mm-dd quando houver data no PDF. */
    date?: string
    time?: string
    lot?: string
    hasAuctioneerLink?: boolean
  }
  appraisal: { source: string; value: number }
  minimumBid: number
  property: {
    address: string
    city: string
    unit: string
    area: number
    bedrooms?: number
    bathrooms?: number
    parking?: number
    condoFee: number
  }
  images: { photo: string; thumb: string; map: string; blur: string }
  /** Identidade visual do painel deste imóvel: cor de luz tirada da foto. */
  theme: { tint: string; name: string }
  market: {
    /** "Imóveis similares na região: a partir de ..." — ausente se o PDF não informar. */
    from?: number
    listings: Listing[]
  }
  costs: { items: Row[]; total: number }
  period: { items: Row[]; op6: number; op12: number }
  financing?: Financing
  scenarios: [Scenario, Scenario]
  /** Cenário de destaque para o "Big Number" de lucro (índice em scenarios). */
  heroScenario: 0 | 1
  roiLabel: string
  validation: string[]
  closing: string
  /** Observações sobre o PDF, visíveis só nas notas do apresentador. */
  caveats: string[]
}
