import { prefs, usePrefs } from '../lib/prefs'
import { sound } from '../lib/sound'
import { Icon } from './Icon'

export function SoundButton() {
  const p = usePrefs()
  return (
    <button
      className="icon-btn"
      aria-pressed={p.sound}
      aria-label={p.sound ? 'Desligar som (A)' : 'Ligar som (A)'}
      title={p.sound ? 'Som ligado · A' : 'Som desligado · A'}
      onClick={() => {
        prefs.toggle('sound')
        sound.click()
      }}
    >
      <Icon name={p.sound ? 'soundOn' : 'soundOff'} />
    </button>
  )
}

export function AccentButton() {
  const p = usePrefs()
  return (
    <button
      className="icon-btn"
      aria-label={`Acento de cor: ${p.accent} (T para alternar)`}
      title={`Paleta ${p.accent === 'champagne' ? 'A · Champagne' : 'B · Verde-resultado'} · T`}
      onClick={() => prefs.cycleAccent()}
    >
      <span className="block h-3 w-3 rounded-full" style={{ background: 'var(--acc)' }} />
    </button>
  )
}

export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="icon-btn" aria-label="Atalhos de teclado (?)" title="Atalhos · ?" onClick={onClick}>
      <Icon name="help" />
    </button>
  )
}
