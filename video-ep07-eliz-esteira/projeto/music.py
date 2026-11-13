import json, numpy as np, wave
import os; S = os.path.dirname(os.path.abspath(__file__)) + '/'
D=json.loads(open(S+'engine/data.js').read()[len('window.DATA='):-1])
sr=48000; N=int((D['total']+1)*sr); t=np.arange(N,dtype=np.float32)/sr
rng=np.random.default_rng(7)
def note(m): return 440*2**((m-69)/12)
# A minor: Am, F, C, G  (i VI III VII), 9.6s per chord, voiced low/mid
CH=[[38,45,50,53,57,64],[34,46,50,53,57,62],[41,48,53,57,60,67],[36,48,52,55,60,62]]
seg=9.6; pad=np.zeros(N,np.float32)
for k in range(int(D['total']/seg)+2):
    c=CH[k%4]; a=int(k*seg*sr); b=min(N,int((k+1)*seg*sr+2.5*sr))
    if a>=N: break
    tt=t[a:b]-k*seg; env=np.minimum(1,tt/2.5)*np.minimum(1,np.maximum(0,(seg+2.5-tt)/2.5))
    s=np.zeros(b-a,np.float32)
    for i,m in enumerate(c):
        f=note(m)
        for det in (-0.12,0.12):
            ff=f*2**(det/12)
            s+=(np.sin(2*np.pi*ff*tt+i)+0.35*np.sin(2*np.pi*2*ff*tt)+0.12*np.sin(2*np.pi*3*ff*tt))/(1+i*0.4)
    pad[a:b]+=s*env
pad*=0.6+0.4*np.sin(2*np.pi*t/23)**2
# simple one-pole lowpass for softness
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/sr); y=np.empty_like(x); acc=0.0
    # vectorized via scipy-free approach: chunked IIR
    from itertools import accumulate
    y=np.zeros_like(x); prev=0.0
    blk=48000
    for i in range(0,len(x),blk):
        xb=x[i:i+blk]; out=np.empty_like(xb)
        for j in range(len(xb)): prev=prev*a+(1-a)*xb[j]; out[j]=prev
        y[i:i+blk]=out
    return y
try:
    from scipy.signal import lfilter
    def lp(x,fc):
        a=np.exp(-2*np.pi*fc/sr); return lfilter([1-a],[1,-a],x).astype(np.float32)
except Exception: pass
pad=lp(lp(pad,900),900)
# sub pulse (heartbeat) at 84 bpm on beats 1 and 3
bpm=78; beat=60/bpm; sub=np.zeros(N,np.float32)
kick=np.sin(2*np.pi*55*np.arange(int(.5*sr))/sr*(1+0.6*np.exp(-np.arange(int(.5*sr))/sr*18)))*np.exp(-np.arange(int(.5*sr))/sr*7)
for k in range(int(D['total']/beat)):
    if k%2: continue
    i=int(k*beat*sr); sub[i:i+len(kick)]+=kick[:N-i]
# ticks (tech texture) on 16ths, very quiet, filtered noise
tick=np.zeros(N,np.float32); tl=int(0.02*sr); tn=(rng.standard_normal(tl)*np.exp(-np.arange(tl)/sr*250)).astype(np.float32)
for k in range(int(D['total']/(beat/4))):
    i=int(k*beat/4*sr); g=0.5 if k%4==0 else 0.22
    tick[i:i+tl]+=tn[:N-i]*g
tick=tick-lp(tick,3000)
mus=pad*0.16+sub*0.22+tick*0.05
# gaps (chapter cards): drop texture, lift pad; plus intro/outro fades
gate=np.ones(N,np.float32)
for g in D['gaps']:
    a=int((g['t0']-0.3)*sr); b=int((g['t1']+0.2)*sr); gate[a:b]=0.0
from numpy.lib.stride_tricks import sliding_window_view
gate=lp(lp(gate,3),3)
mus=pad*0.16*(1.6-0.6*gate)+(sub*0.22+tick*0.05)*gate
mus*=np.clip(t/2.0,0,1)*np.clip((D['total']-t)/3.0,0,1)
# SFX: whooshes + booms
sfx=np.zeros(N,np.float32)
def whoosh(at,dur=0.9,g=0.35):
    n=int(dur*sr); x=rng.standard_normal(n).astype(np.float32); env=np.sin(np.linspace(0,np.pi,n))**2
    sweep=np.linspace(400,4000,n); y=np.zeros(n,np.float32); a=0
    # crude time-varying lowpass
    out=np.empty(n,np.float32); prev=0.0
    coef=np.exp(-2*np.pi*sweep/sr)
    for j in range(n): prev=prev*coef[j]+(1-coef[j])*x[j]; out[j]=prev
    i=int((at-dur*0.7)*sr); i=max(i,0); sfx[i:i+n]+=out[:N-i]*env[:N-i]*g
def boom(at,g=0.7):
    n=int(1.6*sr); k=np.arange(n)/sr; x=np.sin(2*np.pi*42*k*(1+0.8*np.exp(-k*10)))*np.exp(-k*2.6)
    i=int(at*sr); sfx[i:i+n]+=x[:N-i].astype(np.float32)*g
boom(0.15,0.8)
for g in D['gaps']: whoosh(g['t0']+0.1,1.0,0.45); boom(g['t0']+0.05,0.55)
for d in D['demo']:
    whoosh(d['t0']+0.25,0.7,0.14)
boom(D['total']-5.0,0.6)
out=mus+sfx
out=out/np.max(np.abs(out))*0.8
st=np.stack([out*(1+0.04*np.sin(2*np.pi*t/7)),out*(1-0.04*np.sin(2*np.pi*t/7))],1)
w=wave.open(S+'music.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
print('music ok', N/sr)
