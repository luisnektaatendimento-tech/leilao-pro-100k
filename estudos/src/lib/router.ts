import { useSyncExternalStore } from 'react'

export type Route = { name: 'home' } | { name: 'study'; slug: string }

const parse = (): Route => {
  const m = location.pathname.match(/^\/estudo\/([^/]+)\/?$/)
  return m ? { name: 'study', slug: decodeURIComponent(m[1]) } : { name: 'home' }
}
let current = parse()
let path = location.pathname
const subs = new Set<() => void>()
const emit = () => {
  if (location.pathname === path) return
  path = location.pathname
  current = parse()
  subs.forEach((f) => f())
}
window.addEventListener('popstate', emit)

export function navigate(to: string) {
  if (to === location.pathname + location.hash) return
  history.pushState(null, '', to)
  emit()
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
