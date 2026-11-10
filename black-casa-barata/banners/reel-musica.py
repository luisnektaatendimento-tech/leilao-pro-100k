import numpy as np,wave
SR=44100;DUR=31.0;N=int(SR*DUR);out=np.zeros((N,2))
BPM=124;B=60/BPM
rng=np.random.default_rng(7)
def add(sig,t,g=1.0,pan=0.0):
    i=int(t*SR);j=min(N,i+len(sig))
    if i>=N or j<=i:return
    s=sig[:j-i]*g;out[i:j,0]+=s*(1-max(0,pan));out[i:j,1]+=s*(1+min(0,pan))
def env(n,a=.005,r=.2):
    t=np.arange(n)/SR;e=np.minimum(1,t/a)*np.exp(-t/r);return e
try:
    from scipy.signal import lfilter
except Exception:
    lfilter=None
def lp(x,a):  # one-pole low pass
    if np.ndim(a)==0 and lfilter is not None:
        return lfilter([a],[1,-(1-a)],x)
    a=np.broadcast_to(a,x.shape);y=np.zeros_like(x);acc=0.0
    for k in range(len(x)):acc+=a[k]*(x[k]-acc);y[k]=acc
    return y
def hp(x,a): return x-lp(x,a)
def kick():
    n=int(.42*SR);t=np.arange(n)/SR;f=48+110*np.exp(-t*28);ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*7)*1.0+np.sin(ph*2)*np.exp(-t*30)*.15
def clap():
    n=int(.25*SR);x=rng.standard_normal(n);x=hp(x,.25)
    e=np.zeros(n);t=np.arange(n)/SR
    for d in (0,.012,.024):e+=np.where(t>=d,np.exp(-(t-d)*60),0)
    return x*(e*.6+np.exp(-t*14)*.5)*.5
def hat(o=False):
    n=int((.18 if o else .05)*SR);x=hp(rng.standard_normal(n),.6);t=np.arange(n)/SR
    return x*np.exp(-t*(14 if o else 70))*.35
def saw(f,n,det=0):
    t=np.arange(n)/SR;s=0
    for d in (-det,0,det):s=s+2*((t*f*(1+d))%1)-1
    return s/3
def nota(m):return 440*2**((m-69)/12)
def boom():
    n=int(1.6*SR);t=np.arange(n)/SR;f=30+90*np.exp(-t*9);ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*2.2)*1.1+lp(rng.standard_normal(n),.05)*np.exp(-t*3)*.5
def riser(d):
    n=int(d*SR);t=np.arange(n)/SR;x=hp(rng.standard_normal(n),.2)*(t/d)**2*.5
    f=200+1800*(t/d)**2;x+=np.sin(2*np.pi*np.cumsum(f)/SR)*(t/d)**3*.15;return x
def whoosh(d=.5):
    n=int(d*SR);t=np.arange(n)/SR;x=lp(rng.standard_normal(n),.08+.4*np.sin(np.pi*t/d))*np.sin(np.pi*t/d)**2
    return x*.7
# progressão Am F C G
prog=[(57,[57,60,64]),(53,[53,57,60]),(48,[52,55,60]),(55,[55,59,62])]
INI=2.6;FIM=29.2
# intro: riser + boom no slam do logo
add(riser(.5),0.0,.6);add(boom(),0.5,.9)
# pad suave na intro
n=int(2.6*SR);pad=sum(saw(nota(m+12),n,.004) for m in prog[0][1]);pad=lp(pad,.02)*np.minimum(1,np.arange(n)/SR/1.2)*.12;add(pad,0)
t=INI;bar=0
while t<FIM:
    root,ch=prog[bar%4];bn=int(4*B*SR)
    for b in range(4):
        tb=t+b*B
        if tb>=FIM:break
        add(kick(),tb,.95)
        if b in (1,3):add(clap(),tb,.55)
        for h in range(2):add(hat(h==1 and b%2==1),tb+h*B/2,.5,pan=(.3 if h else -.3))
        for e in range(2):  # baixo em colcheias
            n2=int(B/2*SR*.9);x=lp(saw(nota(root-12),n2,.003),.06)*env(n2,.004,.18);add(x,tb+e*B/2,.42)
    # pad
    pad=sum(saw(nota(m+12),bn,.005) for m in ch);pad=lp(pad,.03)*np.minimum(1,np.arange(bn)/SR/.08)*np.exp(-np.arange(bn)/SR*.5)*.10
    add(pad,t,1,pan=.1)
    # arpejo pluck
    for k in range(8):
        m=ch[k%3]+24+(12 if k in (3,7) else 0);n3=int(.3*SR);x=lp(saw(nota(m),n3,.002),.18)*env(n3,.002,.09)
        add(x,t+k*B/2,.13,pan=(-.4 if k%2 else .4))
    t+=4*B;bar+=1
# impactos nas trocas de cena
for tc in (8.6,12.4,15.8,19.2):add(whoosh(.45),tc-.3,.5);add(kick(),tc,.5)
add(riser(1.2),21.8+2.3-1.2,.55);add(boom(),21.8+2.3,1.0)   # slam do R$37
add(whoosh(.5),26.1-.3,.6);add(boom(),26.1+.2,.8)           # CTA
# final: acorde longo
n=int(2.0*SR);fin=sum(saw(nota(m+12),n,.005) for m in prog[0][1]);fin=lp(fin,.03)*np.exp(-np.arange(n)/SR*1.2)*.16;add(fin,FIM)
# mestre: soft clip + fade out
out=np.tanh(out*1.1)*.85
fo=int(1.4*SR);out[-fo:]*=np.linspace(1,0,fo)[:,None]
w=wave.open('musica.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
print('ok',round(float(np.abs(out).max()),3))
