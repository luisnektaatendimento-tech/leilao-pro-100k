import { useSyncExternalStore } from 'react'

export type Route = { name: 'home' } | { name: 'study'; slug: string }

/**
 * Rotas por caminho (/estudo/slug) na Vercel, ou por hash simples (#slug)
 * quando o site é publicado como página estática fora dela (build com VITE_HASH=1).
 */
const HASH = import.meta.env.VITE_HASH === '1'
const currentPath = () => {
  if (!HASH) return location.pathname
  const h = decodeURIComponent(location.hash.replace(/^#/, ''))
  return h ? `/estudo/${h}` : '/'
}
const toHash = (to: string) => {
  const m = to.match(/^\/estudo\/([^/]+)/)
  return m ? `#${m[1]}` : location.pathname + location.search
}

const parse = (): Route => {
  const m = currentPath().match(/^\/estudo\/([^/]+)\/?$/)
  return m ? { name: 'study', slug: decodeURIComponent(m[1]) } : { name: 'home' }
}
let current = parse()
let path = currentPath()
const subs = new Set<() => void>()
const emit = () => {
  if (currentPath() === path) return
  path = currentPath()
  current = parse()
  subs.forEach((f) => f())
}
window.addEventListener('popstate', emit)
if (HASH) window.addEventListener('hashchange', emit)

export function navigate(to: string) {
  if (to === currentPath()) return
  history.pushState(null, '', HASH ? toHash(to) : to)
  emit()
}

/** Troca o endereço sem navegar (ex.: imóvel atual no deck). */
export function replacePath(to: string) {
  history.replaceState(null, '', HASH ? toHash(to) : to)
}

export function useRoute() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f)
      return () => subs.delete(f)
    },
    () => current,
  )
}
