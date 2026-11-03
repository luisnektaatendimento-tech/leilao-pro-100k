import json, wave, numpy as np
import os; S = os.path.dirname(os.path.abspath(__file__)) + '/../'  # espera src/transcript.json, src/audio16k.wav e prod/
segs=json.load(open(S+'src/transcript.json'))
W=[dict(w=w['w'].strip(),s=w['s'],e=w['e']) for s in segs for w in s['words']]
W=[w for w in W if w['s']<751.5]
# audio envelope for snapping cut points to quiet spots
wf=wave.open(S+'src/audio16k.wav'); a=np.frombuffer(wf.readframes(wf.getnframes()),dtype=np.int16).astype(np.float32)/32768
hop=160; env=np.sqrt(np.convolve(a**2,np.ones(320)/320,'same')[::hop]+1e-9)  # 10ms resolution
def snap(t,rng=0.12):
    i0=int((t-rng)*100); i1=int((t+rng)*100)
    i=i0+int(np.argmin(env[i0:i1])); return i/100
# hard removals (original seconds)
REMOVE=[(0,4.70),(9.48,12.82),(28.44,32.00),(34.76,85.60),(640.30,643.90),(646.90,653.74),(751.45,999)]
# chapter starts (original time of first word) -> inserted pause before
def find(phrase, after=0):
    toks=[x.strip('.,?!') for x in phrase.lower().split()]
    for i in range(len(W)):
        if W[i]['s']<after: continue
        if all(W[i+k]['w'].lower().strip('.,?!')==toks[k] for k in range(len(toks))): return W[i]['s']
    raise Exception(phrase)
CH=[(0,'Por que duas plataformas',4.84),
    (1,'Fexô — vender serviço',find('Seguinte,')),
    (2,'Fexô — vender mentoria',find('Quando a gente vai para a mentoria')),
    (3,'A ponte Fexô ⇄ Canaw',find('Só que, fora')),
    (4,'Canaw — o funil da TV',find('E como que funciona a plataforma',470)),
    (5,'Low ticket e retroalimentação',find('O que é interessante entender?')),
    (6,'Onde as plataformas se encontram',find('Então, onde que as duas'))]
# build keep segments from words: start with whole range minus REMOVE, then compress gaps
def removed(t): return any(a<=t<b for a,b in REMOVE)
words=[w for w in W if not removed((w['s']+w['e'])/2)]
keep=[]; MAXGAP=0.45; PAD=0.10
cur=[max(words[0]['s']-PAD,0),words[0]['e']]
for prev,w in zip(words,words[1:]):
    gap=w['s']-prev['e']
    cut_between=any(prev['e']-0.05<=a<=w['s']+0.05 or prev['e']<=b<=w['s'] for a,b in REMOVE) or any(a<w['s'] and b>prev['e'] for a,b in REMOVE)
    forced=any(abs(w['s']-c[2])<0.01 for c in CH[1:])
    if gap>MAXGAP+0.2 or cut_between or forced:
        cur[1]=snap(prev['e']+min(PAD+0.1,gap/2 if not cut_between else PAD),0.06)
        keep.append(cur); cur=[snap(w['s']-min(PAD,gap/2),0.06),w['e']]
    else: cur[1]=w['e']
cur[1]=words[-1]['e']+0.35; keep.append(cur)
# merge, compute new timeline; insert chapter pauses
chstarts={round(c[2],2):c for c in CH[1:]}
CHGAP=1.8; INTRO=3.0
out=[]; t=INTRO
for a,b in keep:
    for cs,c in chstarts.items():
        if a-0.5<=cs<=a+0.5:
            c2=list(c); out.append(dict(kind='gap',t0=t,t1=t+CHGAP,chapter=c[0],title=c[1])); t+=CHGAP
    out.append(dict(kind='clip',src0=a,src1=b,t0=t,t1=t+(b-a))); t+=b-a
total=t+5.0
def remap(x):
    for c in out:
        if c['kind']=='clip' and c['src0']-0.001<=x<=c['src1']+0.001: return c['t0']+(x-c['src0'])
    return None
nw=[]
for w in words:
    s=remap(w['s']); e=remap(w['e'])
    if s is None or e is None:
        # nearest
        s=s if s is not None else e; e=e if e is not None else s
    if s is not None: nw.append(dict(w=w['w'],s=round(s,3),e=round(e,3),os=w['s']))
chap=[dict(n=c['chapter'],title=c['title'],t=c['t0']) for c in out if c['kind']=='gap']
chap.insert(0,dict(n=0,title=CH[0][1],t=0))
json.dump(dict(segments=out,words=nw,chapters=chap,total=total),open(S+'projeto/timeline.json','w'),ensure_ascii=False,indent=1)
clips=[c for c in out if c['kind']=='clip']
print('clips',len(clips),'gaps',len(out)-len(clips),'total',round(total,1))
for c in chap: print(c)
