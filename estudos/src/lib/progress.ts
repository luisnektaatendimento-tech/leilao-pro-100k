/** Progresso por estudo, salvo só neste navegador (localStorage). */
export interface Progress {
  visited: number[]
  insights: string[]
  timeMs: number
}

const key = (slug: string) => `pjk-estudos:v1:${slug}`
const empty = (): Progress => ({ visited: [], insights: [], timeMs: 0 })

export function loadProgress(slug: string): Progress {
  try {
    const raw = localStorage.getItem(key(slug))
    if (!raw) return empty()
    const p = JSON.parse(raw)
    return { visited: p.visited ?? [], insights: p.insights ?? [], timeMs: p.timeMs ?? 0 }
  } catch {
    return empty()
  }
}

export function saveProgress(slug: string, p: Progress) {
  try {
    localStorage.setItem(key(slug), JSON.stringify(p))
  } catch {
    /* modo privado / armazenamento bloqueado */
  }
}

export type Status = { state: 'novo' | 'andamento' | 'explorado'; pct: number }
export function statusOf(slug: string, total: number): Status {
  const p = loadProgress(slug)
  const pct = Math.round((new Set(p.visited).size / total) * 100)
  if (pct <= 0) return { state: 'novo', pct: 0 }
  if (pct >= 100) return { state: 'explorado', pct: 100 }
  return { state: 'andamento', pct }
}
