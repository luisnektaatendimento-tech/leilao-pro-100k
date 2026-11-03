import json, wave, numpy as np, os
S = os.path.dirname(os.path.abspath(__file__)) + '/'
T = json.load(open(S + 'timeline.json'))
src = {}
for v in 'AB':
    wf = wave.open(S + f'{v}48.wav'); sr = wf.getframerate()
    src[v] = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).reshape(-1, 2).astype(np.float32)
out = np.zeros((int(T['total'] * sr) + sr, 2), np.float32); F = int(0.012 * sr)
for c in T['segments']:
    if c['kind'] != 'clip': continue
    x = src[c['src']][int(c['src0'] * sr):int(c['src1'] * sr)].copy()
    r = np.linspace(0, 1, F)[:, None]; x[:F] *= r; x[-F:] *= r[::-1]
    i = int(c['t0'] * sr); out[i:i + len(x)] += x
w = wave.open(S + 'voice_raw.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
w.writeframes(np.clip(out, -32768, 32767).astype(np.int16).tobytes()); print('ok', len(out) / sr)
