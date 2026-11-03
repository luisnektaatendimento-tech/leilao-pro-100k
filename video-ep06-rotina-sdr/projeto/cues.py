"""Roteiro de cenas do Episódio 06: A rotina do SDR de alta performance (último episódio da série)."""
import json, re, os
S = os.path.dirname(os.path.abspath(__file__)) + '/'
TL = json.load(open(S + 'timeline.json'))
W = TL['words']
def norm(x): return re.sub(r'[^\wà-ú$%]', '', x.lower())
def idx(phrase, after=0.0):
    toks = [norm(x) for x in phrase.split()]
    for i in range(len(W) - len(toks) + 1):
        if W[i]['os'] < after - 0.01: continue
        if all(norm(W[i + k]['w']) == toks[k] for k in range(len(toks))): return i, i + len(toks) - 1
    raise SystemExit('phrase not found: %r after %s' % (phrase, after))
def T(p, after=0.0, end=False): i, j = idx(p, after); return round(W[j]['e'] if end else W[i]['s'], 2)
CH = {c['n']: c for c in TL['chapters']}
GAPS = [s for s in TL['segments'] if s['kind'] == 'gap']
LAST = W[-1]['e']; TOTAL = round(LAST + 12.0, 2)

FIX = {'luiz': 'Luís', 'necta': 'Nekta', 'closer': 'Closer'}
def fixw(w):
    m = re.match(r'^(\W*)([\wà-úÀ-Ú$%]+)(\W*)$', w)
    if not m: return w
    a, core, b = m.groups()
    if core.lower() in FIX: core = FIX[core.lower()]
    return a + core + b
def merged(ws):
    out = []
    for w in ws:
        x = dict(w); x['w'] = fixw(x['w'])
        if out and (x['w'][0] in '-$%' or re.match(r'^[.,]\d', x['w'])): out[-1]['w'] += x['w']; out[-1]['e'] = x['e']
        else: out.append(x)
    return out

# ---------------------------------------------------------------- mapa: a agenda do dia
N = {}
def node(id, title, y, kind, sub='', tag=None):
    N[id] = dict(id=id, title=title, sub=sub, x=900, y=y, kind=kind, w=900, tag=tag, reveal=None, prio=None, prioAt=9999)
BL = [('b1', '08:30 – 09:00', 'Planejamento', 'ghost', 'metas do dia, CRM e agenda · priorizar leads quentes e retornos'),
      ('b2', '09:00 – 09:30', 'Follow-up · mensagens', 'f2', 'ativação no WhatsApp para quem precisa do seu retorno'),
      ('b3', '09:30 – 11:30', 'Bloco de ligações 1 · inegociável', 'yes', 'celular no silencioso, sem notificações, foco no resultado'),
      ('b4', '11:30 – 12:00', 'CRM + agendamentos', 'f3', 'registrar ligações, confirmar reuniões, passar qualificados ao Closer'),
      ('b5', '12:00 – 14:00', 'Almoço', 'no', 'desconectar de verdade'),
      ('b6', '14:00 – 14:30', 'Follow-up · ligações', 'f1', 'retornos combinados, quem não atendeu, reagendamentos'),
      ('b7', '14:30 – 16:00', 'Bloco de ligações 2 · inegociável', 'yes', 'foco exclusivo em ligações'),
      ('b8', '16:00 – 16:20', 'Café da tarde', 'no', 'pausa curta: recarregar e manter a energia alta'),
      ('b9', '16:20 – 17:15', 'Bloco de ligações 3 · inegociável', 'yes', 'mais uma hora focada em executar'),
      ('b10', '17:15 – 18:00', 'Preparação do dia seguinte', 'ghost', 'revisar leads, organizar a lista de amanhã, CRM 100%')]
Y0, DY = 200, 150
for i, (id, tm, title, kind, sub) in enumerate(BL): node(id, title, Y0 + i * DY, kind, sub, tag=tm)
E = {}
def edge(id, a, b, style='solid', label='', bend=0, side=None, off=150):
    E[id] = dict(id=id, a=a, b=b, style=style, label=label, bend=bend, kind=None, reveal=None, side=side, off=off)
for (a, *_), (b, *_) in zip(BL, BL[1:]): edge(a + b, a, b)
def reveal(t, *ids):
    for i in ids:
        d = N if i in N else E
        if d[i]['reveal'] is None: d[i]['reveal'] = t
ACT = []
def active(t0, t1, *ids, color=None): ACT.append(dict(t0=t0, t1=t1, ids=list(ids), color=color))
CAM = []
def cam(t, x, y, z, dur=1.4): CAM.append(dict(t=t, x=x, y=y, z=z, d=dur))
OVL = []
def ovl(kind, t0, t1, **kw): OVL.append(dict(kind=kind, t0=t0, t1=t1, **kw))
def blk(id, t0, t1, prev=None):
    y = N[id]['y']; reveal(t0, id); prev and reveal(t0, prev + id); active(t0, t1, id); cam(t0 - 0.3, 1476, y + 20, 0.85)
    b = next(x for x in BL if x[0] == id); col = {'ghost': '#c9cdd3', 'f2': '#4d8dff', 'yes': '#c8f43c', 'f3': '#b79cff', 'no': '#ff6b6b', 'f1': '#ffb547'}[b[3]]
    SIDE.append(dict(t0=t0 + 0.2, t1=t1 - 0.1, time=b[1].replace(' – ', '–'), title=b[2], sub=b[4], c=col, kicker='agora · bloco %d de %d' % (BL.index(b) + 1, len(BL))))
FULL = (1000, 880, 0.5)
SIDE = []

# ---------------------------------------------------------------- abertura
ovl('title', 0.0, 3.4)
cam(0, 1250, 200, 0.95, 0.01)
t = T('Agora que você já sabe')
ovl('lower', t + 0.3, t + 6, name='Luís Nekta', role='Episódio 06 · A rotina do SDR')
ovl('quote', T('eu vou passar para você a rotina') - 0.2, CH[1]['t'] - 0.15, text='Ligações em blocos · follow-up com cadência · CRM sempre atualizado.', by='a rotina do SDR de alta performance')

# ---------------------------------------------------------------- manhã
c1 = CH[1]['t'] + 1.8
blk('b1', c1, T('Das 9 horas às 9h30'))
ovl('chips', T('revisar as metas do dia'), T('Das 9 horas às 9h30'), anchor='b1', dy=-110, items=[['metas do dia', T('revisar as metas do dia')], ['CRM e agenda', T('alinhar o CRM')], ['leads quentes e retornos', T('priorizar os leads quentes')]])
blk('b2', T('Das 9 horas às 9h30'), CH[2]['t'], 'b1')

# ---------------------------------------------------------------- bloco 1
c2 = CH[2]['t'] + 1.8
blk('b3', c2, CH[3]['t'], 'b2')
ovl('quote', T('Esse horário é inegociável') - 0.1, T('deixe o celular') - 0.2, text='Das 9h30 às 11h30: só ligações.', by='horário inegociável · 100% de foco')
ovl('cards', T('deixe o celular') - 0.2, CH[3]['t'] - 0.15, head='modo foco', keep=True, w=360, h=200,
    items=[dict(k='🔕', big=1, t='Celular no silencioso', c='#c8f43c', at=T('deixe o celular')), dict(k='✕', big=1, t='Sem notificações', c='#ff6b6b', at=T('evite notificações,')),
           dict(k='◎', big=1, t='Foco no resultado', c='#ffb547', at=T('foque no resultado.'))])

# ---------------------------------------------------------------- meio do dia
c3 = CH[3]['t'] + 1.8
blk('b4', c3, T('Das 12h às 14h'), 'b3')
ovl('chips', T('registrar as ligações'), T('Das 12h às 14h'), anchor='b4', dy=-110, items=[['registrar ligações', T('registrar as ligações')], ['confirmar reuniões', T('confirmar reuniões')], ['passar qualificados ao Closer', T('passar leads qualificados')]])
blk('b5', T('Das 12h às 14h'), CH[4]['t'], 'b4')

# ---------------------------------------------------------------- tarde
c4 = CH[4]['t'] + 1.8
blk('b6', c4, T('novamente, um dos blocos') - 0.2, 'b5')
blk('b7', T('novamente, um dos blocos') - 0.2, T('Às 16h20,'), 'b6')
blk('b8', T('Às 16h20,'), CH[5]['t'], 'b7')

# ---------------------------------------------------------------- fim do dia
c5 = CH[5]['t'] + 1.8
blk('b9', c5, T('o momento para que você consiga se preparar'), 'b8')
blk('b10', T('o momento para que você consiga se preparar'), CH[6]['t'], 'b9')
ovl('quote', T('Não se esqueça') - 0.1, CH[6]['t'] - 0.15, text='Termine o dia com o CRM 100% alinhado.', by='constância é o que aumenta o resultado')

# ---------------------------------------------------------------- metas
c6 = CH[6]['t'] + 1.8
cam(c6 - 0.6, *FULL, dur=1.8); active(c6, T('E vamos lá para as metas diárias.'), 'b3', 'b7', 'b9', color='lime')
ovl('chips', T('três blocos inegociáveis') - 0.2, T('E vamos lá para as metas diárias.'), anchor='b1', dy=-120, items=[['3 blocos inegociáveis de ligação', T('três blocos inegociáveis')], ['nenhuma outra tarefa', T('não deve estar fazendo')]])
t = T('E vamos lá para as metas diárias.')
ovl('quote', T('Lembrando, o resultado') - 0.1, T('Então, todos os dias você deve fazer') - 0.15, text='O resultado você não controla. A sua execução, sim.', by='metas diárias')
t = T('Então, todos os dias você deve fazer')
ovl('counters', t - 0.2, T('Para que você possa bater') + 3.0, head='metas diárias de execução', capAt=T('Nem 3, nem 2.'), cap='O mínimo é 4. Nem 3, nem 2.',
    items=[dict(n=20, t='ligações atendidas', b='conversas reais', c='#c8f43c', at=T('20 ligações')),
           dict(n=15, t='conversas efetivas', b='WhatsApp e outros canais', c='#4d8dff', at=T('15 conversas')),
           dict(n=30, t='follow-ups por mensagem', b='ativando quem não avançou', c='#ffb547', at=T('30 follow')),
           dict(lo=4, n=6, t='agendamentos por dia', b='a meta diária', c='#ff3d3d', at=T('de 4 a 6', 375))])

# ---------------------------------------------------------------- regras
c7 = CH[7]['t'] + 1.8
ovl('cards', c7 - 0.2, CH[8]['t'] - 0.15, head='regras de ouro', keep=True, w=520, h=110, top=140,
    items=[dict(k='01', t='Ligue nos blocos, sem multitarefa', c='#c8f43c', at=T('ligue nos blocos')),
           dict(k='02', t='Lista pronta antes do bloco', c='#c8f43c', at=T('Lista pronta')),
           dict(k='03', t='Registre tudo no CRM na hora', c='#b79cff', at=T('Registre tudo')),
           dict(k='04', t='Melhores horários: 9h–11h30 e 14h–16h', c='#ffb547', at=T('Os melhores horários')),
           dict(k='05', t='Sempre marque o próximo passo', c='#4d8dff', at=T('Sempre marque')),
           dict(k='06', t='Revisão de métricas toda sexta', c='#e9ebee', at=T('Nós vamos revisar')),
           dict(k='07', t='Treino de objeções todos os dias', c='#ff6b6b', at=T('E eu vou te ajudar a contornar'))])

# ---------------------------------------------------------------- encerramento
c8 = CH[8]['t'] + 1.8
cam(c8 - 0.6, *FULL, dur=2.0); active(c8, TOTAL, *N.keys(), *E.keys(), color='all')
ovl('quote', T('E lembre -se, as vendas') - 0.1, T('Conte comigo') - 0.15, text='As vendas vão mudar o seu futuro e te deixar mais perto dos seus sonhos.', by='Luís Nekta')
ovl('quote', T('Conte comigo') - 0.1, LAST + 0.6, text='Conte comigo. Conte com a Nekta.', by='estamos juntos nessa')
ovl('end', LAST + 0.8, TOTAL)
BUSY = [(o['t0'], o['t1']) for o in OVL if o['kind'] in ('quote', 'cards', 'counters')]
for sd in SIDE:
    for a, b in BUSY:
        if a < sd['t1'] and b > sd['t0']:
            if a <= sd['t0'] + 0.5: sd['t0'] = max(sd['t0'], b + 0.1)
            else: sd['t1'] = min(sd['t1'], a - 0.1)
    if sd['t1'] - sd['t0'] > 1.2: ovl('side', sd['t0'], sd['t1'], **{k: v for k, v in sd.items() if k not in ('t0', 't1')})
for d in (N, E):
    for v in d.values():
        if v['reveal'] is None: v['reveal'] = LAST
CAM.sort(key=lambda c: c['t'])

# ---------------------------------------------------------------- legendas
mw = merged(W)
SUBS = []; cur = []
for i, w in enumerate(mw):
    cur.append(w); txt = ' '.join(x['w'] for x in cur)
    nxt = mw[i + 1] if i + 1 < len(mw) else None
    gap = (nxt['s'] - w['e']) if nxt else 9
    if (not nxt or gap > 0.5 or w['w'][-1] in '.?!' or len(txt) > 40 or (w['w'][-1] in ',;:' and len(txt) > 22)
            or (w['e'] - cur[0]['s']) > 3.4 or (nxt and len(txt) + len(nxt['w']) > 44)):
        SUBS.append(dict(t0=cur[0]['s'], t1=max(w['e'], cur[0]['s'] + 0.7), words=[[x['w'], x['s']] for x in cur])); cur = []
for a, b in zip(SUBS, SUBS[1:]): a['t1'] = min(a['t1'] + 0.25, b['t0'] - 0.02)
def srt_t(x): return '%02d:%02d:%06.3f' % (int(x // 3600), int(x % 3600 // 60), x % 60)
with open(S + 'legendas_ep06.srt', 'w') as f:
    for i, s in enumerate(SUBS, 1):
        f.write('%d\n%s --> %s\n%s\n\n' % (i, srt_t(s['t0']).replace('.', ','), srt_t(s['t1']).replace('.', ','), ' '.join(w for w, _ in s['words'])))

A = '../assets/'
EPS = [('01', 'Canaw + Fexô: o ecossistema'), ('02', 'Como o time comercial opera'), ('03', 'Organize seus leads no Nekta CRM'),
       ('04', 'SPIN na prática'), ('05', 'Follow-up e reativação'), ('06', 'A rotina do SDR')]
META = dict(ep='Episódio 06 · final', short='EP.06', brand='CANAW + FEXÔ · EP. 06', title='A rotina do SDR',
            sub='Ligações em blocos, follow-up com cadência e CRM sempre atualizado',
            endHTML=f'''<div style="position:absolute;left:0;right:0;top:170px;text-align:center"><div class="mono" style="color:#ffb547">Fim da série · formação do time comercial</div>
<div style="display:grid;grid-template-columns:repeat(3,420px);gap:20px;justify-content:center;margin-top:44px">''' + ''.join(
    f'<div style="padding:24px 26px;border-radius:18px;border:1px solid {"#c8f43c" if n=="06" else "#2d323a"};background:#0f1215;text-align:left"><div class="mono" style="font-size:13px;color:#8b919b">EPISÓDIO {n}</div><div style="font:700 26px Grotesk;margin-top:8px">{t}</div></div>' for n, t in EPS) + f'''</div>
<div style="font:700 48px Grotesk;margin-top:60px">Agora você tem tudo para dominar as vendas.</div>
<div style="display:flex;justify-content:center;align-items:center;gap:50px;margin-top:40px;opacity:.85"><img src="{A}logo_fexo_dark.png" style="height:44px"><img src="{A}logo_canaw.png" style="height:92px"></div></div>''')
DATA = dict(total=TOTAL, chapters=TL['chapters'], gaps=GAPS, nodes=list(N.values()), edges=list(E.values()), active=ACT, cam=CAM,
            demo=[], ovl=OVL, subs=SUBS, meta=META, headers=[])
open(S + 'engine/data.js', 'w').write('window.DATA=' + json.dumps(DATA, ensure_ascii=False) + ';')
print('ok total', TOTAL, 'subs', len(SUBS))
for c in TL['chapters']: print('  %6.2f  %s' % (c['t'], c['title']))
