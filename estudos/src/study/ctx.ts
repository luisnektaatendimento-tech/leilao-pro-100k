import { createContext, useContext } from 'react'

export interface Ctx {
  /** Imóvel atual (índice em `studies`). */
  index: number
  goTo: (i: number) => void
  /** Slugs dos imóveis já vistos neste navegador. */
  visited: Set<string>
  complete: boolean
  goHome: () => void
}
export const StudyContext = createContext<Ctx>(null!)
export const useStudy = () => useContext(StudyContext)
