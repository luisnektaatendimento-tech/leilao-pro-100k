import { useEffect } from 'react'
import { Icon } from './Icon'

const ROWS: [string[], string][] = [
  [['←', '→'], 'Imóvel anterior / próximo'],
  [['Espaço'], 'Avançar (Shift + Espaço volta)'],
  [['Roda do mouse'], 'Um gesto = próximo imóvel'],
  [['M'], 'Mapa dos estudos'],
  [['F'], 'Tela cheia'],
  [['P'], 'Modo apresentador'],
  [['N'], 'Segurar: notas do apresentador'],
  [['A'], 'Som'],
  [['Esc', 'H'], 'Voltar aos estudos'],
]

export default function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && (e.stopImmediatePropagation(), onClose())
    addEventListener('keydown', k, true)
    return () => removeEventListener('keydown', k, true)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 px-4 backdrop-blur-sm" role="dialog" aria-modal aria-label="Atalhos de teclado" onClick={onClose}>
      <div className="glass w-full max-w-md rounded-2xl p-7" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <span className="label">Atalhos</span>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar" autoFocus>
            <Icon name="close" />
          </button>
        </div>
        <ul className="space-y-3">
          {ROWS.map(([keys, desc]) => (
            <li key={desc} className="flex items-center justify-between gap-6 text-sm text-ink-2">
              <span>{desc}</span>
              <span className="flex gap-1">
                {keys.map((k) => (
                  <kbd key={k} className="kbd">{k}</kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
