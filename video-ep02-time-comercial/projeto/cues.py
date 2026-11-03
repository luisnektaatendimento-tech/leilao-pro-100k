"""Roteiro de cenas do Episódio 02: Como o nosso time comercial opera.
Cada ação fica ancorada numa frase real da fala (tempo original → tempo editado)."""
import json, re, os
S = os.path.dirname(os.path.abspath(__file__)) + '/'
TL = json.load(open(S + 'timeline.json'))
W = TL['words']

def norm(x): return re.sub(r'[^\wà-ú$]', '', x.lower())
def T(phrase, after=0.0, end=False):
    toks = [norm(x) for x in phrase.split()]
    for i in range(len(W) - len(toks) + 1):
        if W[i]['os'] < after - 0.01: continue
        if all(norm(W[i + k]['w']) == toks[k] for k in range(len(toks))):
            return round(W[i + len(toks) - 1]['e'] if end else W[i]['s'], 2)
    raise SystemExit('phrase not found: %r after %s' % (phrase, after))

CH = {c['n']: c for c in TL['chapters']}
GAPS = [s for s in TL['segments'] if s['kind'] == 'gap']
LAST = W[-1]['e']
TOTAL = round(LAST + 9.0, 2)

N = {}
def node(id, title, x, y, kind, sub='', w=360, tag=None, prio=None):
    N[id] = dict(id=id, title=title, sub=sub, x=x, y=y, kind=kind, w=w, tag=tag, reveal=None, prio=prio, prioAt=9999)
node('ph1', 'Geração de demanda', 650, 170, 'phase', 'marketing + plataformas', w=400, tag='FASE 1')
node('ph2', 'Qualificação e agendamento', 1500, 170, 'phase', 'SDR · pré-vendedor', w=420, tag='FASE 2')
node('ph3', 'Fechamento e recuperação', 2350, 170, 'phase', 'Closer · vendedor', w=400, tag='FASE 3')
node('s1', 'Pagou a consultoria 1:1', 700, 560, 'fexo', 'SDR · confirma e qualifica', w=380, tag='FEXÔ', prio='P1')
node('s2', 'Score de crédito muito alto', 700, 730, 'fexo', 'SDR · qualificação completa', w=380, tag='FEXÔ', prio='P4')
node('s3', 'Viu o evento e agendou', 1500, 560, 'canaw', 'SDR · confirma e qualifica', w=380, tag='CANAW', prio='P1')
node('s4', 'Viu o evento e não agendou', 1500, 730, 'canaw', 'SDR · pré-recuperação', w=380, tag='CANAW', prio='P5')
node('s5', 'Comprou o low ticket', 2300, 560, 'low', 'SDR · qualifica e leva à reunião', w=380, tag='LOW TICKET', prio='P2')
node('s6', 'Iniciou a compra e não concluiu', 2300, 730, 'low', 'SDR · recupera por ligação', w=380, tag='LOW TICKET', prio='P3')
node('k', 'Reunião com o Closer', 1500, 960, 'conv', 'fechamento · recuperação', w=420, tag='FASE 3')
node('oa', 'Assessoria', 1050, 1140, 'out', 'serviço · compra do imóvel', w=360, tag='SERVIÇO')
node('om', 'Mentorias', 1950, 1140, 'out', 'de R$ 3 mil a R$ 30 mil', w=360, tag='MENTORIA')
node('rest', 'Demais estágios', 1500, 1320, 'ghost', 'só quando os 6 momentos secarem', w=460, tag='DEPOIS')

E = {}
def edge(id, a, b, style='solid', label='', bend=0, kind=None, side=None, off=150):
    E[id] = dict(id=id, a=a, b=b, style=style, label=label, bend=bend, kind=kind, reveal=None, side=side, off=off)
edge('p12', 'ph1', 'ph2'); edge('p23', 'ph2', 'ph3')
edge('k1', 's1', 'k', side='l', off=140); edge('k2', 's2', 'k', bend=-40)
edge('k3', 's3', 'k', side='l', off=110); edge('k4', 's4', 'k')
edge('k5', 's5', 'k', side='r', off=140); edge('k6', 's6', 'k', bend=40)
edge('ka', 'k', 'oa'); edge('km', 'k', 'om')
edge('kr', 'k', 'rest', style='dash')

def reveal(t, *ids):
    for i in ids:
        d = N if i in N else E
        if d[i]['reveal'] is None: d[i]['reveal'] = t
ACT = []
def active(t0, t1, *ids, color=None): ACT.append(dict(t0=t0, t1=t1, ids=list(ids), color=color))
CAM = []
def cam(t, x, y, z, dur=1.4): CAM.append(dict(t=t, x=x, y=y, z=z, d=dur))
DEMO = []
def demo(t0, t1, src, url, kf, hl=(), mode='full', label=None):
    DEMO.append(dict(t0=t0, t1=t1, src=src, url=url, kf=kf, hl=list(hl), mode=mode, cursor=[], label=label))
OVL = []
def ovl(kind, t0, t1, **kw): OVL.append(dict(kind=kind, t0=t0, t1=t1, **kw))

FULL = (1500, 740, 0.62)
# ------------------------------------------------------------- abertura
ovl('title', 0.0, 3.4)
cam(0, 1500, 260, 0.86, 0.01)
t = T('Agora vamos lá.')
ovl('lower', t + 0.3, T('como o nosso time comercial opera') - 0.3, name='Luís Nekta', role='Episódio 02 · Time comercial')
t = T('Já que você entendeu')
demo(t, T('agora você vai entender') - 0.1, 'split', 'Episódio 01', kf=[], mode='split', label='recapitulando o episódio 01 · as plataformas')

# ------------------------------------------------------------- cap 1: 3 fases e papéis
c1 = CH[1]['t'] + 1.8
cam(c1 - 0.6, 1500, 250, 0.86)
t = T('A primeira fase')
reveal(t, 'ph1'); active(t, T('A fase 2'), 'ph1')
ovl('chips', T('todas as plataformas'), T('A fase 2'), anchor='ph1', dy=110,
    items=[['Fexô', T('todas as plataformas')], ['Canaw', T('todas as plataformas') + 0.4], ['marketing', T('estratégias de marketing')]])
t = T('A fase 2')
reveal(t, 'p12', 'ph2'); active(t, T('A fase 3'), 'ph2')
ovl('chips', T('qualificação real'), T('A fase 3'), anchor='ph2', dy=110,
    items=[['qualificação real', T('qualificação real')], ['agendamento', T('e a parte de agendamento')]])
t = T('A fase 3')
reveal(t, 'p23', 'ph3'); active(t, T('É muito interessante entender'), 'ph3')
ovl('chips', T('fazendo fechamento'), T('É muito interessante entender'), anchor='ph3', dy=110,
    items=[['fechamento', T('fazendo fechamento')], ['recuperação', T('fazer a recuperação')]])
t = T('É muito interessante entender')
ovl('quote', t + 0.2, T('Qual é o nome dessa pessoa') - 0.2, text='Mentorias de R$ 3 mil a R$ 30 mil', by='ticket alto → precisa de um time comercial agindo')
t = T('Qual é o nome dessa pessoa')
active(t, T('Qual é o nome da pessoa'), 'ph2')
ovl('chips', T('Ela é o SDR'), T('Tendo em vista esse contexto'), anchor='ph2', items=[['SDR · pré-vendedor', T('Ela é o SDR')]])
t = T('Qual é o nome da pessoa')
active(t, T('Tendo em vista esse contexto'), 'ph3')
ovl('chips', T('É o closer'), T('Tendo em vista esse contexto'), anchor='ph3', items=[['CLOSER · vendedor', T('É o closer')]])

# ------------------------------------------------------------- cap 2: inteligência comercial
c2 = CH[2]['t'] + 1.8
cam(c2 - 0.6, 1500, 250, 0.86)
active(T('Tendo em vista esse contexto'), T('É muito interessante que vocês'), 'ph1', 'ph2', 'ph3')
t0 = T('Para que serve a inteligência')
sel = [[17, '#c8f43c'], [63, '#c8f43c'], [101, '#ff3d3d'], [140, '#ff3d3d'], [178, '#b79cff'], [205, '#b79cff']]
ovl('crowd', t0 - 0.3, T('No caso da Fechou') - 0.3, sel=sel, selAt=T('ele entra em alguns momentos'),
    head='todo mundo que entra na Fexô e na Canaw', cap='Só 6 momentos específicos')

# ------------------------------------------------------------- cap 3: Fexô
c3 = CH[3]['t'] + 1.8
cam(c3 - 0.6, 800, 640, 0.95)
t = T('São as pessoas que pagaram')
reveal(t, 's1'); active(t, T('Outra ligação'), 's1')
t = T('com o closer', 160)
reveal(t, 'k1', 'k'); cam(t, 1050, 780, 0.8)
active(T('contato de confirmação'), T('Outra ligação'), 's1', 'k1')
t = T('Outra ligação')
cam(t, 800, 660, 0.95)
t = T('são aquelas pessoas que têm um score', 190)
reveal(t, 's2'); active(t, T('Então, na Fechou'), 's2')
demo(T('sinalizadas ali pela'), T('Então, na Fechou') - 0.2, 'fexo_financiar', 'fexô.com/financiar',
     kf=[dict(t=0, cx=960, cy=330, z=1.5)], mode='inset', label='Estimativa de crédito na Fexô',
     hl=[dict(t0=0.5, t1=12, x=660, y=200, w=600, h=150, label='')])
t = T('Então, na Fechou')
reveal(t, 'k2'); cam(t, 1050, 800, 0.72); active(t, T('E assim, a gente vai vender'), 's1', 's2', 'k1', 'k2', 'k')
t = T('vender o nosso serviço de assessoria')
reveal(t, 'ka', 'oa'); cam(t - 0.2, 1150, 950, 0.72); active(t, CH[4]['t'], 'k', 'oa', 'ka', color='lime')

# ------------------------------------------------------------- cap 4: Canaw
c4 = CH[4]['t'] + 1.8
cam(c4 - 0.6, 1500, 640, 0.95)
t = T('que são pessoas que participaram')
reveal(t, 's3'); active(t, T('E são pessoas que participaram'), 's3')
demo(T('do webinário'), T('Então, novamente') - 0.1, 'canaw_tv_ch01', 'canaw.app/tv',
     kf=[dict(t=0, cx=800, cy=420, z=1.3)], mode='inset', label='Evento do especialista na Canaw')
t = T('Então, novamente')
reveal(t, 'k3'); active(t, T('E são pessoas que participaram'), 's3', 'k3', 'k')
t = T('E são pessoas que participaram')
reveal(t, 's4'); active(t, CH[5]['t'], 's4')
t = T('faz o ângulo de')
reveal(t, 'k4'); cam(t - 0.3, 1500, 820, 0.8); active(t, CH[5]['t'], 'k4', 'k')

# ------------------------------------------------------------- cap 5: low ticket
c5 = CH[5]['t'] + 1.8
cam(c5 - 0.6, 2250, 640, 0.95)
t = T('compraram os low tickets')
reveal(T('a gente vai ligar tanto'), 's5'); active(T('a gente vai ligar tanto'), T('Essas são as etapas'), 's5')
t = T('iniciaram a compra')
reveal(t, 's6'); active(t, T('Essas são as etapas'), 's6')
t = T('Essas são as etapas')
reveal(t, 'k5', 'k6', 'km', 'om'); cam(t, *FULL, dur=1.8)
active(t, T('Por onde fazemos'), 's1', 's2', 's3', 's4', 's5', 's6', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k', color='all')
ovl('chips', T('muito aquecido'), T('Por onde fazemos'), anchor='k', dy=-120, items=[['leads aquecidos', T('muito aquecido')], ['não faltam contatos', T('não vão faltar leads')], ['interesse real', T('realmente têm interesse')]])

# ------------------------------------------------------------- cap 6: ligação primeiro
t = T('Nós fazemos contatos por WhatsApp')
ovl('channels', t - 0.6, T('Nunca fique sem ligar') - 0.2, emph=T('As ligações sempre'),
    items=[['mais resultado', T('geram mais resultados')], ['mais rápido', T('e de forma mais rápida')], ['metas batidas', T('bater as suas metas')]])
t = T('Nunca fique sem ligar')
ovl('quote', t - 0.1, CH[7]['t'] - 0.15, text='Nunca fique sem ligar para um cliente.', by='regra do time comercial')

# ------------------------------------------------------------- cap 7: a matriz
c7 = CH[7]['t'] + 1.8
cam(c7 - 0.6, *FULL)
t = T('essa aqui é a matriz')
active(t, T('O ponto principal'), 's1', 's2', 's3', 's4', 's5', 's6', 'k', color='all')
t0 = T('Existem momentos específicos')
cam(t0 - 0.4, 1900, 740, 0.58, 1.6)
order = [('s1', 'P1', 'Pagou ou agendou a consultoria 1:1'), ('s3', 'P1', None), ('s5', 'P2', 'Comprou o low ticket'),
         ('s6', 'P3', 'Iniciou a compra e não concluiu'), ('s2', 'P4', 'Score de crédito alto'), ('s4', 'P5', 'Viu o evento e não agendou')]
items = []; tt = t0 + 0.4
for nid, p, lab in order:
    N[nid]['prioAt'] = tt
    if lab: items.append([p, lab, tt])
    active(tt, tt + 1.4, nid, color='white')
    tt += 0.9 if lab else 0.0
ovl('legend', t0, T('Então, esse é o escopo') + 0.2, items=items)
t = T('outros estágios')
reveal(t, 'kr', 'rest'); cam(t - 0.5, 1500, 1050, 0.7); active(t, t + 4, 'rest')
t = T('Então, esse é o escopo')
cam(t, *FULL, dur=1.8)
active(t, TOTAL, *[n for n in N if n != 'rest'], *E.keys(), color='all')
ovl('end', LAST + 0.8, TOTAL)

for d in (N, E):
    for v in d.values():
        if v['reveal'] is None: v['reveal'] = LAST
CAM.sort(key=lambda c: c['t']); DEMO.sort(key=lambda d: d['t0'])

# ------------------------------------------------------------- legendas
FIX = {'fechou': 'Fexô', 'fechor': 'Fexô', 'canal': 'Canaw', 'necta': 'Nekta', 'luiz': 'Luís', 'funéis': 'funis', 'closer': 'Closer'}
def fixw(w):
    m = re.match(r'^(\W*)([\wà-úÀ-Ú$]+)(\W*)$', w)
    if not m: return w
    a, core, b = m.groups()
    if core.lower() in FIX: core = FIX[core.lower()]
    return a + core + b
words = [dict(w=fixw(w['w']), s=w['s'], e=w['e']) for w in W]
mw = []
for w in words:
    if mw and (w['w'].startswith('-') or w['w'].startswith('$') or re.match(r'^[.,]\d', w['w'])): mw[-1]['w'] += w['w']; mw[-1]['e'] = w['e']
    else: mw.append(w)
words = mw
SUBS = []; cur = []
for i, w in enumerate(words):
    cur.append(w); txt = ' '.join(x['w'] for x in cur)
    nxt = words[i + 1] if i + 1 < len(words) else None
    gap = (nxt['s'] - w['e']) if nxt else 9
    if (not nxt or gap > 0.5 or w['w'][-1] in '.?!' or len(txt) > 40 or (w['w'][-1] in ',;:' and len(txt) > 22)
            or (w['e'] - cur[0]['s']) > 3.4 or (nxt and len(txt) + len(nxt['w']) > 44)):
        SUBS.append(dict(t0=cur[0]['s'], t1=max(w['e'], cur[0]['s'] + 0.7), words=[[x['w'], x['s']] for x in cur])); cur = []
for a, b in zip(SUBS, SUBS[1:]): a['t1'] = min(a['t1'] + 0.25, b['t0'] - 0.02)
def srt_t(x): return '%02d:%02d:%06.3f' % (int(x // 3600), int(x % 3600 // 60), x % 60)
with open(S + 'legendas_ep02.srt', 'w') as f:
    for i, s in enumerate(SUBS, 1):
        f.write('%d\n%s --> %s\n%s\n\n' % (i, srt_t(s['t0']).replace('.', ','), srt_t(s['t1']).replace('.', ','), ' '.join(w for w, _ in s['words'])))

A = '../assets/'
META = dict(ep='Episódio 02', short='EP.02', brand='CANAW + FEXÔ · EP. 02',
            title='O time comercial', sub='Como o nosso time comercial opera: fases, momentos e prioridades',
            endHTML=f'''<div style="position:absolute;left:0;right:0;top:250px;text-align:center"><div class="mono" style="color:#ffb547">Nos próximos episódios</div>
<div style="display:flex;justify-content:center;gap:40px;margin-top:40px">
<div style="width:560px;padding:34px;border-radius:22px;border:1px solid #2d323a;background:#0f1215;text-align:left"><div class="mono" style="font-size:14px">próximo</div><div style="font:700 40px Grotesk;margin-top:12px">Fluxo de cadência</div><div style="font:400 22px Inter;color:#9aa1ab;margin-top:10px">Como e quando fazer cada contato</div></div>
<div style="width:560px;padding:34px;border-radius:22px;border:1px solid #2d323a;background:#0f1215;text-align:left"><div class="mono" style="font-size:14px">em breve</div><div style="font:700 40px Grotesk;margin-top:12px">Públicos do low ticket</div><div style="font:400 22px Inter;color:#9aa1ab;margin-top:10px">Quais públicos atingimos e quais são os produtos</div></div></div>
<div style="display:flex;justify-content:center;align-items:center;gap:50px;margin-top:70px;opacity:.85"><img src="{A}logo_fexo_dark.png" style="height:48px"><img src="{A}logo_canaw.png" style="height:100px"></div></div>''')
HEADERS = [dict(t='FEXÔ', s='2 momentos', x=700, y=400, c='#c8f43c', rid='s1'),
           dict(t='CANAW', s='2 momentos', x=1500, y=400, c='#ff3d3d', rid='s3'),
           dict(t='LOW TICKET', s='2 momentos', x=2300, y=400, c='#b79cff', rid='s5')]
DATA = dict(total=TOTAL, chapters=TL['chapters'], gaps=GAPS, nodes=list(N.values()), edges=list(E.values()), active=ACT, cam=CAM,
            demo=DEMO, ovl=OVL, subs=SUBS, meta=META, headers=HEADERS)
open(S + 'engine/data.js', 'w').write('window.DATA=' + json.dumps(DATA, ensure_ascii=False) + ';')
print('ok total', TOTAL, 'subs', len(SUBS), 'demos', len(DEMO))
for c in TL['chapters']: print('  %6.2f  %s' % (c['t'], c['title']))
