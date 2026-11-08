import { createContext, useContext } from 'react'

export interface Ctx {
  /** Imóvel atual (índice em `studies`). */
  index: number
  goTo: (i: number) => void
  /** Slugs dos imóveis já vistos neste navegador. */
  visited: Set<string>
  complete: boolean
  goHome: () => void
  /** Linha do tempo dos pagamentos aberta no painel. */
  timeline: boolean
  setTimeline: (open: boolean) => void
}
export const StudyContext = createContext<Ctx>(null!)
export const useStudy = () => useContext(StudyContext)
