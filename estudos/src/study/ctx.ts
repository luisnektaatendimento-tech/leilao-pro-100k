import { createContext, useContext } from 'react'
import type { Study } from '../data/types'
import type { Scene } from '../lib/scenes'

export interface Ctx {
  study: Study
  scenes: Scene[]
  index: number
  goTo: (i: number) => void
  visited: Set<number>
  unlocked: Set<string>
  elapsed: () => number
  next: Study
  goHome: () => void
}
export const StudyContext = createContext<Ctx>(null!)
export const useStudy = () => useContext(StudyContext)
