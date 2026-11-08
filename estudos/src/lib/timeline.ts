import type { Study } from '../data/types'
import { brl } from './format'

/**
 * Linha do tempo dos pagamentos de um imóvel.
 * Os valores vêm dos mesmos números calculados do estudo; a ORDEM das etapas é a
 * ordem típica de uma compra em leilão (os PDFs não trazem prazos).
 */

export interface TItem {
  label: string
  /** valor positivo; o sinal vem de `flow` */
  value: number
  /** -1 = sai do bolso · +1 = entra no bolso · 0 = informativo */
  flow: -1 | 0 | 1
  note?: string
}

export interface TPhase {
  key: string
  title: string
  when: string
  desc: string
  items: TItem[]
  /** soma com sinal das linhas da etapa */
  total: number
  /** saldo do investidor ao fim da etapa (negativo = dinheiro aplicado) */
  position: number
  /** dinheiro aplicado acumulado até aqui (só saídas antes da venda) */
  invested: number
}

const r2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100

export function buildTimeline(s: Study, scenarioIndex: 0 | 1): TPhase[] {
  const sc = s.scenarios[scenarioIndex]
  const items = s.costs.items
  const of = (phase: string) => items.filter((i) => i.phase === phase)
  const direct = s.sale.modality === 'Venda Direta'
  const months = sc.months

  const raw: Omit<TPhase, 'total' | 'position' | 'invested'>[] = [
    {
      key: 'arremate',
      title: direct ? 'Compra' : 'Arremate',
      when: direct ? 'Na aprovação da proposta' : 'No dia do leilão',
      desc: s.financing
        ? 'Você paga a entrada, a comissão do leiloeiro e a assessoria. O restante do valor é financiado.'
        : direct
          ? 'Você paga o valor do imóvel à vista e os honorários da assessoria.'
          : 'Você paga o lance, a comissão do leiloeiro e os honorários da assessoria.',
      items: of('arremate').map((i) =>
        i.ref
          ? { label: `${i.label} (financiado: ${brl(r2(i.value - (s.financing?.downPayment ?? 0)))})`, value: i.value, flow: 0 as const, note: 'não sai do bolso agora' }
          : { label: i.label, value: i.value, flow: -1 as const },
      ),
    },
    {
      key: 'registro',
      title: 'Transferência e registro',
      when: 'Logo após o arremate',
      desc: 'Imposto de transmissão (ITBI) e cartório para colocar o imóvel no seu nome.',
      items: of('registro').map((i) => ({ label: i.label, value: i.value, flow: -1 as const })),
    },
    {
      key: 'debitos',
      title: 'Quitação de débitos',
      when: 'Na regularização do imóvel',
      desc: 'IPTU e condomínio em atraso que ficam com o comprador.',
      items: of('debitos').map((i) => ({ label: i.label, value: i.value, flow: -1 as const })),
    },
    {
      key: 'obra',
      title: 'Reforma',
      when: 'Depois da posse',
      desc: 'Ajustes para deixar o imóvel pronto para vender.',
      items: of('obra').map((i) => ({ label: i.label, value: i.value, flow: -1 as const, note: i.value === 0 ? 'não prevista no estudo' : undefined })),
    },
    {
      key: 'periodo',
      title: 'Manutenção até a venda',
      when: `Durante ${months} meses`,
      desc: `Custos de manter o imóvel até vender, no cenário de ${months} meses.`,
      items: s.period.items.map((i) =>
        i.kind === 'monthly'
          ? { label: `${i.label} × ${months}`, value: r2(i.value * months), flow: -1 as const, note: `${brl(i.value)} por mês` }
          : { label: i.label, value: i.value, flow: -1 as const },
      ),
    },
    {
      key: 'venda',
      title: 'Venda',
      when: `No ${months}º mês`,
      desc: s.financing
        ? 'O comprador paga, você quita o saldo do financiamento e a corretagem.'
        : 'O comprador paga e você acerta a corretagem.',
      items: [
        { label: 'Venda final', value: sc.sale, flow: 1 },
        ...(sc.balance !== undefined ? [{ label: 'Quitação do saldo devedor', value: sc.balance, flow: -1 as const }] : []),
        { label: sc.brokerageLabel, value: sc.brokerage, flow: -1 },
      ],
    },
    {
      key: 'imposto',
      title: 'Imposto sobre o ganho',
      when: 'Após a venda',
      desc: `Imposto sobre o ganho de capital (IRGC) de ${sc.taxPct}% sobre o resultado bruto.`,
      items: [{ label: `IRGC (${sc.taxPct}%)`, value: r2(sc.grossResult - sc.netResult), flow: -1 }],
    },
  ]

  let position = 0
  let invested = 0
  const phases = raw.map((p) => {
    const total = r2(p.items.reduce((a, i) => a + i.flow * i.value, 0))
    position = r2(position + total)
    if (p.key !== 'venda' && p.key !== 'imposto') invested = r2(invested - total)
    return { ...p, total, position, invested }
  })

  phases.push({
    key: 'resultado',
    title: 'Resultado',
    when: 'Fim da operação',
    desc: `Lucro líquido de ${brl(sc.netResult)} sobre ${brl(sc.investment)} investidos.`,
    items: [],
    total: 0,
    position,
    invested,
  })
  return phases
}
