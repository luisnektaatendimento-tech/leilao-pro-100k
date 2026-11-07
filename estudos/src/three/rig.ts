/**
 * Estado mutável compartilhado entre a UI (DOM) e a cena 3D, sem re-render do React.
 * A UI escreve; o loop do WebGL lê e interpola.
 */
export const rig = {
  mode: 'home' as 'home' | 'study',
  /** 0..1 — posição no estudo. */
  progress: 0,
  /** -1..1 */
  mouse: { x: 0, y: 0 },
  /** 0..1 — "mergulho" da câmera na transição home → estudo. */
  dive: 0,
  /** 0..1 — easter egg de 100%. */
  celebrate: 0,
  accent: [0.788, 0.663, 0.431] as [number, number, number],
}

export const ACCENTS = {
  champagne: [0.788, 0.663, 0.431] as [number, number, number],
  verde: [0.184, 0.816, 0.541] as [number, number, number],
}
