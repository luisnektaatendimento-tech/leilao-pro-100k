import { useSyncExternalStore } from 'react'

export type Accent = 'champagne' | 'verde'
interface Prefs {
  sound: boolean
  snap: boolean
  accent: Accent
  presenter: boolean
}

const STORE = 'pjk-estudos:prefs'
let state: Prefs = { sound: false, snap: true, accent: 'champagne', presenter: false }
try {
  const saved = JSON.parse(localStorage.getItem(STORE) || '{}')
  state = { ...state, ...saved, presenter: false }
} catch {
  /* noop */
}
const subs = new Set<() => void>()

export const prefs = {
  get: () => state,
  set(patch: Partial<Prefs>) {
    state = { ...state, ...patch }
    try {
      const { presenter: _p, ...persist } = state
      localStorage.setItem(STORE, JSON.stringify(persist))
    } catch {
      /* noop */
    }
    document.documentElement.dataset.accent = state.accent
    document.documentElement.classList.toggle('presenter', state.presenter)
    subs.forEach((f) => f())
  },
  toggle(k: 'sound' | 'snap' | 'presenter') {
    prefs.set({ [k]: !state[k] } as Partial<Prefs>)
  },
  cycleAccent() {
    prefs.set({ accent: state.accent === 'champagne' ? 'verde' : 'champagne' })
  },
  subscribe(f: () => void) {
    subs.add(f)
    return () => subs.delete(f)
  },
}
document.documentElement.dataset.accent = state.accent

export function usePrefs() {
  return useSyncExternalStore(prefs.subscribe, prefs.get)
}
