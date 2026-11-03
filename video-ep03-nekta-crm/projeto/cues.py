"""Roteiro de cenas do Episódio 03: Como me organizar para trabalhar meus leads (Nekta CRM).
Âncoras: frases reais do vídeo A (fluxo) e do vídeo B (CRM na prática)."""
import json, re, os
S = os.path.dirname(os.path.abspath(__file__)) + '/'
TL = json.load(open(S + 'timeline.json'))
W = TL['words']
def norm(x): return re.sub(r'[^\wà-ú$]', '', x.lower())
def T(phrase, after=0.0, src='A', end=False):
    toks = [norm(x) for x in phrase.split()]
    for i in range(len(W) - len(toks) + 1):
        if W[i]['src'] != src or W[i]['os'] < after - 0.01: continue
        if all(W[i + k]['src'] == src and norm(W[i + k]['w']) == toks[k] for k in range(len(toks))):
            return round(W[i + len(toks) - 1]['e'] if end else W[i]['s'], 2)
    raise SystemExit('phrase not found: %s %r after %s' % (src, phrase, after))
def B(p, after=0.0, end=False): return T(p, after, 'B', end)
CH = {c['n']: c for c in TL['chapters']}
GAPS = [s for s in TL['segments'] if s['kind'] == 'gap']
LAST = W[-1]['e']; TOTAL = round(TL['total'], 2)

N = {}
def node(id, title, x, y, kind, sub='', w=360, tag=None):
    N[id] = dict(id=id, title=title, sub=sub, x=x, y=y, kind=kind, w=w, tag=tag, reveal=None, prio=None, prioAt=9999)
node('fx', 'Fexô', 950, 150, 'fexo', 'consultoria paga · score alto', w=330, tag='ORIGEM')
node('cw', 'Canaw', 1500, 150, 'canaw', 'evento: agendou · não agendou', w=330, tag='ORIGEM')
node('lt', 'Low ticket', 2050, 150, 'low', 'comprou · iniciou e parou', w=330, tag='ORIGEM')
node('crm', 'Nekta CRM', 1500, 340, 'phase', 'todos os leads no mesmo lugar', w=440, tag='O CORAÇÃO')
node('base', 'Base de nutrição', 1500, 520, 'conv', 'origem · responsável', w=400, tag='CRM')
node('ab', 'Primeira abordagem', 1500, 700, 'yes', 'em até 5 minutos', w=400, tag='SDR')
node('pipe', 'Pipeline do CRM', 1500, 880, 'conv', 'o lead entra nas suas etapas', w=400, tag='CRM')
node('ry', 'Respondeu', 1150, 1060, 'yes', 'liga na hora', w=320, tag='CENÁRIO 1')
node('rn', 'Não respondeu', 1850, 1060, 'no', 'liga mesmo assim (5 min)', w=320, tag='CENÁRIO 2')
node('lig', 'Ligação de qualificação', 1500, 1240, 'phase', 'o pilar do processo', w=430, tag='SDR')
node('s1', 'Situação', 1020, 1410, 'sp1', w=230); node('s2', 'Problema', 1340, 1410, 'sp2', w=230)
node('s3', 'Implicação', 1660, 1410, 'sp3', w=230); node('s4', 'Necessidades', 1980, 1410, 'sp4', w=250)
node('ag', 'Agendou', 1150, 1600, 'yes', 'fez sentido · é necessidade', w=330, tag='DECISÃO')
node('na', 'Não agendou', 1850, 1600, 'no', 'ainda não está pronto', w=330, tag='DECISÃO')
node('mk', 'Marca na agenda do CRM', 1150, 1780, 'conv', '+ informações da qualificação', w=420, tag='SDR')
node('dq', 'Desqualificado', 1850, 1780, 'ghost', 'avança no CRM', w=330, tag='CRM')
node('gr', 'Acompanhamento até a chamada', 1150, 1960, 'conv', 'grupo: SDR + Closer + cliente', w=440, tag='SDR')
node('cl', 'Reunião com o Closer', 1150, 2140, 'out', 'diagnóstico', w=400, tag='CLOSER')
E = {}
def edge(id, a, b, style='solid', label='', bend=0, side=None, off=150):
    E[id] = dict(id=id, a=a, b=b, style=style, label=label, bend=bend, kind=None, reveal=None, side=side, off=off)
edge('o1', 'fx', 'crm'); edge('o2', 'cw', 'crm'); edge('o3', 'lt', 'crm')
edge('e1', 'crm', 'base'); edge('e2', 'base', 'ab'); edge('e3', 'ab', 'pipe')
edge('e4', 'pipe', 'ry'); edge('e5', 'pipe', 'rn'); edge('e6', 'ry', 'lig'); edge('e7', 'rn', 'lig')
edge('e8', 'lig', 's1'); edge('e9', 's1', 's2'); edge('e10', 's2', 's3'); edge('e11', 's3', 's4')
edge('e12', 's4', 'ag', bend=-60); edge('e13', 's4', 'na')
edge('e14', 'ag', 'mk'); edge('e15', 'na', 'dq', style='dash'); edge('e16', 'mk', 'gr'); edge('e17', 'gr', 'cl')
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
U = 'nekta crm'

# ---------------------------------------------------------------- abertura
ovl('title', 0.0, 3.4)
cam(0, 1500, 300, 0.86, 0.01)
t = T('Ótimo!')
ovl('lower', t + 0.3, t + 6, name='Luís Nekta', role='Episódio 03 · Nekta CRM')
t = T('vamos entender como se organizar')
reveal(t, 'crm'); active(t, t + 4, 'crm')

# ---------------------------------------------------------------- 1. todos os leads
c1 = CH[1]['t'] + 1.8
cam(c1 - 0.6, 1500, 260, 0.86)
t = T('vieram da Fexô')
reveal(t, 'fx', 'o1'); reveal(T('da Canal,', 29), 'cw', 'o2'); reveal(T('dos produtos low ticket'), 'lt', 'o3')
active(t, T('Então, pessoas que pagaram'), 'crm')
active(T('Então, pessoas que pagaram'), T('pessoas que participaram do evento da Canal e agendaram'), 'fx')
active(T('pessoas que participaram do evento da Canal e agendaram'), T('Pessoas que compraram low tickets'), 'cw')
active(T('Pessoas que compraram low tickets'), T('Todos esses leads'), 'lt')
t = T('Todos esses leads')
active(t, CH[2]['t'], 'fx', 'cw', 'lt', 'o1', 'o2', 'o3', 'crm', color='all')
demo(t + 0.3, T('E lá você vai conseguir') + 3.2, 'crm_b_16', U, kf=[dict(t=0, cx=870, cy=200, z=1.7)], mode='inset',
     label='Nekta CRM · todos os leads', hl=[dict(t0=0.6, t1=9, x=150, y=120, w=1730, h=150, label='')])
ovl('chips', T('identificar principalmente a origem'), CH[2]['t'], anchor='crm', dy=110,
    items=[['origem', T('identificar principalmente a origem')], ['estágio que permite a ligação', T('Se eles realmente se encontram')]])

# ---------------------------------------------------------------- 2. base de nutrição
c2 = CH[2]['t'] + 1.8
cam(c2 - 0.6, 1500, 450, 0.95)
t = T('todos os leads chegam na base')
reveal(t, 'e1', 'base'); active(t, CH[3]['t'], 'base')
ovl('chips', T('identificar a origem e definir'), T('que vai atendê -lo.', end=True) + 0.6, anchor='base', dy=110,
    items=[['origem', T('identificar a origem e definir')], ['você é o responsável', T('definindo que você é')]])
t = B('Aqui está a base de nutrição.')
demo(t - 0.2, B('Quando ele entrou, a região', 54) - 0.1, 'crm_b_16', U + '/nutricao',
     kf=[dict(t=0, cx=960, cy=300, z=1.0), dict(t=3.5, cx=960, cy=300, z=1.0), dict(t=6, cx=1090, cy=330, z=1.45), dict(t=18, cx=1090, cy=330, z=1.45), dict(t=22, cx=960, cy=400, z=1.0)],
     hl=[dict(t0=0.6, t1=4, x=150, y=120, w=1730, h=150, label='a base de nutrição'),
         dict(t0=6.5, t1=30, x=150, y=290, w=1730, h=195, label='filtros: situação · qualificação · origem · urgência · valor · pagamento · responsável')])
t = B('Quando ele entrou, a região', 54)
demo(t - 0.1, B('A partir do momento que você está visualizando') - 0.1, 'crm_b_16', U + '/nutricao',
     kf=[dict(t=0, cx=960, cy=420, z=1.2)], hl=[dict(t0=0.3, t1=8, x=150, y=420, w=820, h=80, label='entrada · região · quem já teve reunião')])
t = B('A partir do momento que você está visualizando')
demo(t - 0.1, B('Você define aqui o responsável') - 0.1, 'crm_b_100', U + '/nutricao',
     kf=[dict(t=0, cx=960, cy=460, z=1.0), dict(t=3, cx=900, cy=410, z=1.5)],
     hl=[dict(t0=2.6, t1=14, x=600, y=360, w=170, h=72, label='origem: formulário · moradia · urgente')])
t = B('Você define aqui o responsável')
demo(t - 0.1, B('com uma mensagem já pronta'), 'crm_b_100', U + '/nutricao',
     kf=[dict(t=0, cx=1200, cy=410, z=1.5)],
     hl=[dict(t0=0.3, t1=5, x=925, y=362, w=215, h=66, label='você assume o lead'), dict(t0=4.2, t1=12, x=1580, y=362, w=128, h=66, label='abordar')])
t = B('com uma mensagem já pronta')
demo(t - 0.1, CH[3]['t'] - 0.2, 'crm_b_106', 'whatsapp · mensagem pronta',
     kf=[dict(t=0, cx=960, cy=400, z=1.25)], hl=[dict(t0=0.5, t1=9, x=605, y=285, w=690, h=150, label='primeira abordagem já escrita')])

# ---------------------------------------------------------------- 3. 5 minutos
c3 = CH[3]['t'] + 1.8
cam(c3 - 0.6, 1500, 620, 0.95)
t = T('você vai fazer a sua primeira abordagem')
reveal(t, 'e2', 'ab'); active(t, CH[4]['t'], 'ab')
t = T('no prazo máximo de 5 minutos')
ovl('timer', t - 0.2, T('qualificação e agendamento.', end=True) + 0.5, cap='Contato em até 5 minutos', sub='lead aquecido + velocidade = boa qualificação e agendamento')

# ---------------------------------------------------------------- 4. pipeline
c4 = CH[4]['t'] + 1.8
cam(c4 - 0.6, 1500, 800, 0.95)
t = T('o lead vai para a sua pipeline')
reveal(t, 'e3', 'pipe'); active(t, CH[5]['t'], 'pipe')
t = B('Assim que você definiu')
demo(t - 0.2, B('Então, você tem aqui aguardando') - 0.1, 'crm_b_115', U + '/leads',
     kf=[dict(t=0, cx=960, cy=420, z=1.0), dict(t=4, cx=760, cy=640, z=1.45)],
     hl=[dict(t0=4.2, t1=12, x=630, y=505, w=290, h=380, label='contato iniciado')])
t = B('Então, você tem aqui aguardando')
demo(t - 0.1, B('follow -ups aqui.', end=True) + 0.4, 'crm_b_115', U + '/leads',
     kf=[dict(t=0, cx=1100, cy=560, z=1.15)], hl=[dict(t0=0.4, t1=14, x=315, y=505, w=1565, h=40, label='as etapas da pipeline')])
demo(B('em negociação,') - 0.1, B('follow -ups aqui.', end=True) + 0.4, 'crm_b_135', U + '/leads',
     kf=[dict(t=0, cx=1300, cy=330, z=1.2)], hl=[dict(t0=0.3, t1=6, x=1110, y=170, w=780, h=38, label='até a venda realizada')])
t = T('Ali é o quadro')
cam(t, 1500, 800, 0.95)

# ---------------------------------------------------------------- 5. respondeu ou não
c5 = CH[5]['t'] + 1.8
cam(c5 - 0.6, 1500, 1100, 0.8)
t = T('Se o lead respondeu')
reveal(t, 'e4', 'ry'); active(t, T('Não respondeu, dentro'), 'ry')
t = T('Não respondeu, dentro')
reveal(t, 'e5', 'rn'); active(t, T('Lembre -se, a ligação'), 'rn')
t = T('Lembre -se, a ligação')
reveal(t - 1.2, 'e6', 'e7', 'lig'); active(t - 1.2, CH[6]['t'], 'lig', 'e6', 'e7')
ovl('quote', t, CH[6]['t'] - 0.15, text='A ligação é o pilar.', by='é ela que decide se o lead avança')

# ---------------------------------------------------------------- 6. SPIN
c6 = CH[6]['t'] + 1.8
cam(c6 - 0.6, 1500, 1330, 0.8)
active(c6, T('Primeiramente, nós buscamos'), 'lig')
ts = [T('Primeiramente, nós buscamos'), T('se esse cliente tem um problema real'), T('Logo depois, nós vamos para a implicação'), T('Logo depois, vamos para as necessidades')]
for k, tt in enumerate(ts, 1):
    reveal(tt, 'e%d' % (7 + k), 's%d' % k)
spin_items = [['S', 'Situação', 'Qual o momento do cliente? O quão consciente ele está?', '#ffd166', ts[0]],
              ['P', 'Problema', 'Existe um problema real? Qual é? Aprofunde na dor.', '#ff9f43', ts[1]],
              ['I', 'Implicação', '"Dedo na ferida": o que acontece se ele não resolver?', '#ff5d5d', ts[2]],
              ['N', 'Necessidades', 'Ele acredita que precisa dar o passo para resolver?', '#e0245e', ts[3]]]
ovl('spin', ts[0] - 0.3, T('Mas é muito interessante que você entenda') - 0.2, items=spin_items, head='Metodologia SPIN Selling · a ligação de qualificação')
t = T('Mas é muito interessante que você entenda')
cam(t, 1500, 1360, 0.85); active(t, T('Aviso,'), 's1', 's2', 's3', 's4', 'e9', 'e10', 'e11', color='all')
ovl('chips', T('Aviso,'), T('Lembre -se, vendas'), anchor='lig', dy=-110, items=[['domine o fluxo, não o script', T('não seja dependente')]])
t = T('Lembre -se, vendas')
ovl('quote', t - 0.1, CH[7]['t'] - 0.15, text='Vendas é o conhecimento que você leva para a vida inteira.', by='Luís Nekta')

# ---------------------------------------------------------------- 7. agendou ou não
c7 = CH[7]['t'] + 1.8
cam(c7 - 0.6, 1500, 1520, 0.8)
t = T('Ou ele agendou uma reunião')
reveal(t, 'e12', 'ag'); reveal(T('ou nós não entendemos'), 'e13', 'na')
active(t, t + 3, 'ag'); active(T('ou nós não entendemos'), T('E é muito interessante esse ponto'), 'na')
t = T('nós invertemos a polaridade')
ovl('quote', t - 0.2, T('Sendo assim, para aqueles') - 0.1, text='Não é o cliente que decide. Nós decidimos se faz sentido ele estar conosco.', by='a polaridade invertida da venda')
t = T('Sendo assim, para aqueles')
active(t, T('Para aquele que nós entendemos'), 'na'); reveal(T('nós não levamos ele'), 'e15', 'dq')
t = T('Para aquele que nós entendemos')
active(t, CH[8]['t'], 'ag'); reveal(T('nós marcamos na agenda'), 'e14', 'mk'); cam(T('nós marcamos na agenda'), 1500, 1680, 0.8)

# ---------------------------------------------------------------- 8. agenda + closer
c8 = CH[8]['t'] + 1.8
cam(c8 - 0.6, 1150, 1780, 0.95)
active(c8, B('Outro ponto importante') - 0.3, 'mk')
t = B('Outro ponto importante')
demo(t - 0.2, B('pesquisa o nome') + 0.6, 'crm_b_216', U + '/agenda',
     kf=[dict(t=0, cx=960, cy=420, z=1.0), dict(t=2.5, cx=1250, cy=300, z=1.5)],
     hl=[dict(t0=2.8, t1=9, x=1312, y=238, w=160, h=44, label='agendar lead')])
t = B('pesquisa o nome')
demo(t + 0.5, B('Sendo assim, você pode agendar') + 1.0, 'crm_b_175', U + '/agenda',
     kf=[dict(t=0, cx=960, cy=460, z=1.0), dict(t=3, cx=700, cy=460, z=1.4), dict(t=11, cx=700, cy=460, z=1.4), dict(t=14, cx=1180, cy=470, z=1.4)],
     hl=[dict(t0=3, t1=11.5, x=455, y=440, w=450, h=220, label='data · horário · tipo · responsável'),
         dict(t0=14, t1=40, x=915, y=220, w=535, h=485, label='contexto do pré-vendas para o Closer')])
t = T('Lembre -se, o papel do pré')
cam(t, 1150, 1870, 0.9)
ovl('chips', t, T('Venda a reunião'), anchor='mk', dy=110, items=[['colher informações', t + 1.0], ['descartar quem não está pronto', T('descartar aqueles leads')], ['informar o Closer', T('garantir com que o closer')]])
t = T('Venda a reunião')
ovl('quote', t - 0.1, T('Quanto melhor for o seu processo') - 0.1, text='Venda a reunião ao cliente.', by='mostre por que ele precisa estar na sessão')
t = T('Quanto melhor for o seu processo')
reveal(t, 'e17', 'cl', 'e16', 'gr'); cam(t, 1150, 2000, 0.8)
ovl('chips', T('mais pessoas vão estar presentes'), T('Quando ele agenda, você marca'), anchor='cl', dy=100,
    items=[['+ presença', T('mais pessoas vão estar presentes')], ['+ vendas do Closer', T('mais o vendedor')], ['+ comissões', T('mais comissões')]])
t = T('Quando ele agenda, você marca')
cam(t, 1500, 1700, 0.75); active(t, T('Quando ele não agendou'), 'ag', 'mk', 'e14')
active(T('Quando ele não agendou'), CH[9]['t'], 'na', 'dq', 'e15')

# ---------------------------------------------------------------- 9. comparecimento
c9 = CH[9]['t'] + 1.8
cam(c9 - 0.6, 1150, 1980, 0.95)
active(c9, T('Mensagens a cada'), 'gr')
t = T('Então, esse lead, ele não deve', 593)
ovl('chips', T('Ele deve comparecer.'), T('Após criar o grupo'), anchor='gr', dy=-110, items=[['agendado não basta: ele deve comparecer', T('Ele deve comparecer.')]])
ovl('chips', T('você terá o closer'), T('Mensagens a cada'), anchor='gr', dy=110, items=[['SDR', T('o closer, o cliente e você.') + 1.0], ['Closer', T('você terá o closer')], ['Cliente', T('o cliente e você.')]])
t = T('Mensagens a cada')
ovl('cadence', t - 0.3, T('Nós temos diversos materiais.') + 4.5, head='Mensagens no grupo antes da reunião',
    items=[['24h', T('24,'), 'antes'], ['12h', T('12,'), 'antes'], ['6h', T('6,', 620), 'antes'], ['1h', T('1 hora'), 'antes'], ['15 min', T('15 minutos'), 'antes'], ['Reunião', T('antes da reunião'), 'com o Closer']],
    capAt=T('Nós temos diversos materiais.'), cap='podcast · material · planilha: engajamento genuíno')
t = B('A partir do momento que você agendou')
demo(t - 0.2, B('dentro da ligação.', end=True) + 0.6, 'crm_b_216', U + '/agenda',
     kf=[dict(t=0, cx=960, cy=420, z=1.0), dict(t=3, cx=1500, cy=480, z=1.3)],
     hl=[dict(t0=0.6, t1=4, x=310, y=100, w=380, h=95, label='reuniões de hoje'), dict(t0=3.6, t1=16, x=1512, y=235, w=345, h=530, label='próximos atendimentos: ative o grupo')])
t = T('É muito interessante que você tenha clareza')
cam(t, 1500, 1150, 0.42, 2.0)
active(t, LAST + 1, *N.keys(), *E.keys(), color='all')
ovl('chips', T('saiba que ele é seu coração'), T('Agora você já sabe', 705), anchor='crm', dy=-110, items=[['o seu coração: base de nutrição + pipeline', T('saiba que ele é seu coração')]])
ovl('end', LAST + 0.8, TOTAL)

for d in (N, E):
    for v in d.values():
        if v['reveal'] is None: v['reveal'] = LAST
CAM.sort(key=lambda c: c['t']); DEMO.sort(key=lambda d: d['t0'])

# ---------------------------------------------------------------- legendas
FIX = {'fechou': 'Fexô', 'canal': 'Canaw', 'necta': 'Nekta', 'nectar': 'Nekta', 'luiz': 'Luís', 'closer': 'Closer', 'lidia': 'lead', 'lids': 'leads', 'close': 'Closer'}
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
for w in mw:
    w['w'] = w['w'].replace('spin-selling', 'SPIN Selling').replace('spin', 'SPIN')
    if w['w'].lower().startswith('nekta') is False and w['w'] == 'NEC': w['w'] = 'Nekta'
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
with open(S + 'legendas_ep03.srt', 'w') as f:
    for i, s in enumerate(SUBS, 1):
        f.write('%d\n%s --> %s\n%s\n\n' % (i, srt_t(s['t0']).replace('.', ','), srt_t(s['t1']).replace('.', ','), ' '.join(w for w, _ in s['words'])))

A = '../assets/'
META = dict(ep='Episódio 03', short='EP.03', brand='CANAW + FEXÔ · EP. 03', title='Organize seus leads',
            sub='Do Nekta CRM à reunião com o Closer: base de nutrição, pipeline, SPIN e comparecimento',
            endHTML=f'''<div style="position:absolute;left:0;right:0;top:300px;text-align:center"><div class="mono" style="color:#ffb547">Próximo capítulo</div>
<div style="font:700 60px Grotesk;margin-top:30px">Como fazer ligações que geram<br>agendamentos de qualidade</div>
<div style="font:400 26px Inter;color:#9aa1ab;margin-top:24px">as perguntas do SPIN Selling, na prática</div>
<div style="display:flex;justify-content:center;align-items:center;gap:50px;margin-top:60px;opacity:.85"><img src="{A}logo_fexo_dark.png" style="height:48px"><img src="{A}logo_canaw.png" style="height:100px"></div></div>''')
HEADERS = []
DATA = dict(total=TOTAL, chapters=TL['chapters'], gaps=GAPS, nodes=list(N.values()), edges=list(E.values()), active=ACT, cam=CAM,
            demo=DEMO, ovl=OVL, subs=SUBS, meta=META, headers=HEADERS)
open(S + 'engine/data.js', 'w').write('window.DATA=' + json.dumps(DATA, ensure_ascii=False) + ';')
print('ok total', TOTAL, 'subs', len(SUBS), 'demos', len(DEMO))
for c in TL['chapters']: print('  %6.2f  %s' % (c['t'], c['title']))
