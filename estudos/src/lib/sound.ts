import { prefs } from './prefs'

/** Sound design sintetizado (WebAudio), desligado por padrão. */
let ctx: AudioContext | null = null
const ac = () => {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq: number, start: number, dur: number, gain: number, type: OscillatorType = 'sine') {
  const c = ac()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0, c.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, c.currentTime + start + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime + start)
  o.stop(c.currentTime + start + dur + 0.05)
}

export const sound = {
  click() {
    if (!prefs.get().sound) return
    tone(1900, 0, 0.05, 0.025, 'triangle')
  },
  unlock() {
    if (!prefs.get().sound) return
    tone(659.25, 0, 0.9, 0.04)
    tone(987.77, 0.09, 1.1, 0.03)
    tone(1318.5, 0.18, 1.3, 0.015)
  },
}
