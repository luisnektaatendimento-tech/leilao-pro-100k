"""Roteiro de cenas do Episódio 01 — Canaw + Fexô.
Cada ação é ancorada numa frase real da fala (tempo original -> tempo editado)."""
import json, re
import os; S = os.path.dirname(os.path.abspath(__file__)) + '/'
TL = json.load(open(S + 'timeline.json'))
W = TL['words']

def norm(x): return re.sub(r'[^\wà-ú$]', '', x.lower())

def T(phrase, after=0.0, end=False):
    """new-time of the first (or last, end=True) word of phrase, searching original times >= after"""
    toks = [norm(x) for x in phrase.split()]
    for i in range(len(W) - len(toks) + 1):
        if W[i]['os'] < after - 0.01: continue
        if all(norm(W[i + k]['w']) == toks[k] for k in range(len(toks))):
            return round(W[i + len(toks) - 1]['e'] if end else W[i]['s'], 2)
    raise SystemExit('phrase not found: %r after %s' % (phrase, after))

CH = {c['n']: c for c in TL['chapters']}
GAPS = [s for s in TL['segments'] if s['kind'] == 'gap']
LAST = W[-1]['e']
TOTAL = round(LAST + 5.5, 2)

# ------------------------------------------------------------------ MAP
# kinds: fexo | canaw | edu | credit | conv | out | entry
N = {}
def node(id, title, x, y, kind, sub='', w=300, tag=None):
    N[id] = dict(id=id, title=title, sub=sub, x=x, y=y, kind=kind, w=w, tag=tag, reveal=None)

node('fx_site', 'Visita o site', 860, 200, 'fexo', 'fexô.com', tag='FEXÔ')
node('f_imovel', 'Encontra imóvel de leilão', 520, 360, 'fexo', 'o gatilho: oportunidade', tag='FEXÔ')
node('f_vista', 'Compra à vista', 330, 530, 'credit', 'Quero arrematar', w=260, tag='SERVIÇO')
node('f_fin', 'Financiamento', 700, 530, 'credit', 'estimativa grátis', w=260, tag='CRÉDITO')
node('f_crm', 'CRM', 700, 690, 'credit', 'dados da estimativa', w=260, tag='CRÉDITO')
node('f_score', 'Classificação do score', 700, 850, 'credit', 'prioriza aprovados', w=300, tag='CRÉDITO')
node('f_time', 'Time de análise de crédito', 330, 850, 'credit', 'valida os demais', w=300, tag='CRÉDITO')
node('m_banner', 'Banners dos especialistas', 1200, 360, 'fexo', 'e propagandas', tag='FEXÔ')
node('m_leads', 'Base de leads', 1200, 520, 'edu', 'cadastros gerais', w=260, tag='EDUCAÇÃO')
node('m_low', 'Low ticket', 1520, 670, 'edu', 'produto de entrada', w=260, tag='EDUCAÇÃO')
node('m_area', 'Área de membros', 1300, 830, 'edu', 'consome o produto', w=260, tag='EDUCAÇÃO')
node('m_com', 'Comercial', 1760, 830, 'edu', 'quem não foi à área', w=260, tag='EDUCAÇÃO')
node('m_lig', 'Ligação de qualificação', 1760, 980, 'edu', 'entende o interesse', w=300, tag='EDUCAÇÃO')
node('e_traf', 'Tráfego direto', 1880, 200, 'entry', 'anúncios para o low ticket', w=280, tag='ENTRADA')
node('c_site', 'Visita o site', 2500, 200, 'canaw', 'canaw.app', tag='CANAW')
node('c_prog', 'Programas ao vivo', 2500, 360, 'canaw', 'estilo TV, 24h', tag='CANAW')
node('c_evento', 'Evento / webinário', 2340, 560, 'canaw', 'pitch do especialista', tag='CANAW')
node('c_remk', 'Remarketing', 2660, 730, 'canaw', 'vídeo bomba · artefatos', w=280, tag='CANAW')
node('k_agenda', 'Agendamento com especialista', 1500, 1150, 'conv', 'automático ou pelo comercial', w=380, tag='CONVERSÃO')
node('k_consult', 'Consultoria individual', 1500, 1300, 'conv', 'sessão diagnóstica', w=380, tag='CONVERSÃO')
node('o_assess', 'Assessoria', 1080, 1470, 'out', 'serviço · moradia ou investimento', w=360, tag='SERVIÇO')
node('o_mentor', 'Mentorias', 1920, 1470, 'out', 'autonomia · educação', w=360, tag='MENTORIA')
node('p1', 'Leilão PRO', 1660, 1610, 'chip', w=240)
node('p2', 'Investidor Imobiliário', 1920, 1610, 'chip', w=270)
node('p3', 'Milionário com Loteamento', 2210, 1610, 'chip', w=300)

E = {}
def edge(id, a, b, style='solid', label='', bend=0, kind=None):
    E[id] = dict(id=id, a=a, b=b, style=style, label=label, bend=bend, kind=kind, reveal=None)

edge('e1', 'fx_site', 'f_imovel'); edge('e2', 'f_imovel', 'f_vista'); edge('e3', 'f_imovel', 'f_fin')
edge('e4', 'f_fin', 'f_crm'); edge('e5', 'f_crm', 'f_score')
edge('e6', 'f_vista', 'k_agenda', bend=-120)
edge('e7', 'f_score', 'k_agenda', label='score aprovado', bend=-60)
edge('e8', 'f_score', 'f_time', style='dash')
edge('e9', 'f_time', 'k_agenda', style='dash', bend=80)
edge('e10', 'k_agenda', 'k_consult'); edge('e11', 'k_consult', 'o_assess'); edge('e12', 'k_consult', 'o_mentor')
edge('e13', 'fx_site', 'm_banner'); edge('e14', 'm_banner', 'm_leads'); edge('e15', 'm_leads', 'm_low')
edge('e16', 'm_low', 'm_area'); edge('e17', 'm_low', 'm_com')
edge('e18', 'm_area', 'c_evento', label='convite para o evento', bend=-80, kind='bridge')
edge('e19', 'c_evento', 'k_agenda', label='agendamento automático', bend=60)
edge('e20', 'm_com', 'm_lig'); edge('e21', 'm_lig', 'k_agenda', bend=40)
edge('e22', 'o_mentor', 'p1'); edge('e23', 'o_mentor', 'p2'); edge('e24', 'o_mentor', 'p3')
edge('b1', 'm_banner', 'c_site', label='banner leva para a Canaw', bend=-170, kind='bridge')
edge('c1', 'c_site', 'c_prog'); edge('c2', 'c_prog', 'c_evento')
edge('c3', 'c_evento', 'c_remk', style='dash', label='não assistiu')
edge('c4', 'c_remk', 'm_low', label='produto de entrada', bend=90)
edge('t1', 'e_traf', 'm_low', label='independe da Canaw', bend=0)
edge('b2', 'c_site', 'fx_site', label='interesse em imóveis', bend=-150, kind='bridge')

def reveal(t, *ids):
    for i in ids:
        if i in N and N[i]['reveal'] is None: N[i]['reveal'] = t
        if i in E and E[i]['reveal'] is None: E[i]['reveal'] = t

ACT = []   # active highlight windows
def active(t0, t1, *ids, color=None): ACT.append(dict(t0=t0, t1=t1, ids=list(ids), color=color))

CAM = []   # camera keyframes
def cam(t, x, y, z, dur=1.4): CAM.append(dict(t=t, x=x, y=y, z=z, d=dur))

DEMO = []
def demo(t0, t1, src, url, kf, hl=(), mode='full', cursor=(), label=None):
    DEMO.append(dict(t0=t0, t1=t1, src=src, url=url, kf=kf, hl=list(hl), mode=mode, cursor=list(cursor), label=label))

OVL = []   # misc overlays (titles, tags, badges)
def ovl(kind, t0, t1, **kw): OVL.append(dict(kind=kind, t0=t0, t1=t1, **kw))

FULL = (1500, 800, 0.54)
# ------------------------------------------------------------------ INTRO (0 → ch1)
ovl('title', 0.0, 3.4)
t_name = T('Vamos lá, aqui é')
ovl('lower', t_name + 0.6, T('duas plataformas') - 0.2, name='Luís Nekta', role='Episódio 01 · Canaw + Fexô')
t_duas = T('duas plataformas')
ovl('duo', t_duas - 0.3, T('Eu vou explicar o fluxo') + 0.3,
    serv=T('vender serviço', 4), ment=T('mentoria dos experts', 4), exp=T('dos experts', 4))
t_exp = T('Eu vou explicar o fluxo')
ovl('sketch', t_exp - 0.2, CH[1]['t'] + 0.2)
cam(0, *FULL, dur=0.01)

# ------------------------------------------------------------------ CH1 Fexô — serviço
c1 = CH[1]['t'] + 1.8
cam(c1 - 0.6, 860, 420, 0.95, 1.6)
reveal(T('Seguinte,', 30), 'fx_site'); active(T('Seguinte,', 30), T('Fexô.', 33, end=True) + 0.5, 'fx_site')
t = T('A plataforma Fexô tem imóveis')
t_q = T('Então, qual que é o fluxo', 90)
demo(t, t + 4.2, 'fexo_home', 'fexô.com',
     kf=[dict(t=0, cx=960, cy=540, z=1.0), dict(t=4.2, cx=1200, cy=300, z=1.15)],
     hl=[dict(t0=0.9, t1=3.9, x=1268, y=19, w=147, h=46, label='22.089 imóveis')])
demo(t + 3.9, t_q - 0.1, 'fexo_home_full', 'fexô.com',
     kf=[dict(t=0, cx=960, cy=900, z=1.0), dict(t=2.0, cx=960, cy=1050, z=1.0), dict(t=4.5, cx=700, cy=1100, z=1.35)],
     hl=[dict(t0=1.4, t1=6, x=342, y=1120, w=400, h=110, label='até 87% abaixo da avaliação')])
t = T('Então, qual que é o fluxo', 90)
ovl('tag', t + 0.6, T('Primeiramente,', 100) - 0.2, text='Objetivo: vender ASSESSORIA de leilão', x=860, y=120)
t = T('Primeiramente,', 100); active(t, t + 3, 'fx_site')
t_enc = T('ela encontra o imóvel', 105)
reveal(t_enc, 'e1', 'f_imovel'); cam(t_enc - 0.5, 600, 470, 0.95)
demo(t_enc + 0.9, T('Logo após,', 110) - 0.05, 'fexo_imovel_full', 'fexô.com/imovel',
     kf=[dict(t=0, cx=960, cy=560, z=1.0), dict(t=2.2, cx=1250, cy=860, z=1.25)],
     hl=[dict(t0=1.6, t1=4, x=1216, y=930, w=312, h=60, label='oportunidade real')])
t = T('Logo após,', 110)
cam(t, 520, 520, 0.95)
reveal(T('comprar à vista', 110), 'e2', 'f_vista'); reveal(T('fazer um financiamento', 110), 'e3', 'f_fin')
t_vista = T('querer comprar à vista', 115)
active(t_vista, T('Recebe uma consultoria', 130), 'f_vista')
t_ag = T('agendar um contato', 120)
reveal(t_ag, 'e6', 'k_agenda'); cam(t_ag - 0.2, 920, 860, 0.68, 1.8); active(t_ag, t_ag + 6, 'k_agenda')
t_auto = T('de forma automatizada', 125)
demo(t_auto - 0.3, T('Recebe uma consultoria', 130) - 0.2, 'fexo_imovel_full', 'fexô.com/imovel',
     kf=[dict(t=0, cx=1372, cy=1040, z=2.3)], mode='inset', label='Ponto de contato no imóvel',
     hl=[dict(t0=0.6, t1=9, x=1216, y=1041, w=312, h=112, label='')])
t = T('Recebe uma consultoria', 130)
reveal(t, 'e10', 'k_consult'); cam(t - 0.3, 1300, 1260, 0.8); active(t, t + 6, 'k_consult')
t = T('ela compra a assessoria', 140)
reveal(t, 'e11', 'o_assess'); cam(t - 0.2, 1200, 1360, 0.8); active(t, T('Se ela for fazer', 158) - 0.2, 'o_assess')
# financiamento
t = T('Se ela for fazer', 158)
cam(t, 700, 600, 0.95); active(t, t + 3.5, 'f_fin')
t_cl = T('clicar em financiamento', 160)
demo(t_cl - 0.4, T('Esse dado vai para o CRM', 170) - 0.1, 'fexo_financiar', 'fexô.com/financiar',
     kf=[dict(t=0, cx=960, cy=400, z=1.0), dict(t=3, cx=960, cy=300, z=1.45)],
     hl=[dict(t0=1.0, t1=5, x=720, y=140, w=460, h=34, label='passo 1 de 3'),
         dict(t0=4.0, t1=12, x=660, y=200, w=600, h=150, label='estimativa: começa pela renda')])
t = T('Esse dado vai para o CRM', 170)
reveal(t, 'e4', 'f_crm'); cam(t - 0.3, 700, 760, 0.95); active(t, t + 3, 'f_crm')
t = T('O CRM faz uma classificação', 175)
reveal(T('classificação do score', 175), 'e5', 'f_score'); active(t + 1, t + 6, 'f_score')
t = T('E a partir do momento que esse score', 184)
cam(t, 1050, 1000, 0.68, 1.8); reveal(T('indicar para ela', 185), 'e7'); active(T('indicar para ela', 185), T('A grande maioria', 205), 'f_score', 'k_agenda')
active(T('conduzir para a assessoria', 190), T('A partir do momento que o sistema', 210), 'o_assess')
t = T('A partir do momento que o sistema', 210)
cam(t, 560, 900, 0.85); active(t, t + 5, 'f_score')
t = T('time de análise de crédito', 215)
reveal(t, 'e8', 'f_time', 'e9'); active(t, T('Então essa é a forma', 238), 'f_time')
t = T('Então essa é a forma', 238)
cam(t, 860, 930, 0.56, 1.8)
active(t, CH[2]['t'], 'fx_site', 'f_imovel', 'f_vista', 'f_fin', 'f_crm', 'f_score', 'k_agenda', 'k_consult', 'o_assess', color='lime')

# ------------------------------------------------------------------ CH2 Fexô — mentoria
c2 = CH[2]['t'] + 1.8
cam(c2 - 0.6, 1060, 330, 0.95)
t = T('esse cara abre o site', 245); active(t, t + 4, 'fx_site')
t_ban = T('banner dos especialistas', 250)
t_q2 = T('E de qualquer forma', 263)
demo(t_ban - 1.6, t_ban + 3.4, 'fexo_slide_leilaopro', 'fexô.com',
     kf=[dict(t=0, cx=960, cy=330, z=1.1), dict(t=5, cx=1000, cy=300, z=1.2)],
     hl=[dict(t0=1.0, t1=5, x=0, y=82, w=1920, h=340, label='banner do especialista · Leilão PRO')])
demo(t_ban + 3.1, t_q2 - 0.1, 'fexo_slide_investidor', 'fexô.com',
     kf=[dict(t=0, cx=960, cy=330, z=1.1), dict(t=6, cx=1000, cy=300, z=1.2)],
     hl=[dict(t0=0.6, t1=8, x=0, y=82, w=1920, h=340, label='banner do especialista · Investidor Imobiliário')])
t = T('E de qualquer forma', 263)
reveal(t - 0.6, 'e13', 'm_banner'); cam(t - 0.6, 1200, 460, 0.95)
t = T('base de lead', 270)
reveal(t, 'e14', 'm_leads'); active(t, t + 4, 'm_leads')
t = T('abordada com produtos', 276)
reveal(T('low ticket dos especialistas', 276), 'e15', 'm_low'); cam(t, 1400, 620, 0.85); active(T('low ticket dos especialistas', 276), T('Depois que essas pessoas', 305), 'm_low')
t = T('ela recebe anúncio', 285)
ovl('chips', t, T('Depois que essas pessoas', 305), anchor='m_low', items=[['anúncios', t], ['disparos', T('recebe disparos', 285)]])
t = T('tanto da parte de leilão', 295)
ovl('chips', t, T('Depois que essas pessoas', 305) + 0.5, anchor='m_low', dy=150,
    items=[['Leilão PRO · Paulinho dos Leilões', T('leilão PRO', 295)], ['Investidor Imobiliário · Eliz Sampaio', T('investidor imobiliário', 295)],
           ['Milionário com Loteamento', T('milionário com loteamento', 300)]])
t = T('elas vão para a área de membros', 310)
reveal(t, 'e16', 'm_area'); cam(t - 0.3, 1500, 760, 0.85); active(t, t + 4, 'm_area')
t = T('dois fluxos diferentes', 320)
reveal(t, 'e17', 'm_com'); active(t, t + 2.5, 'm_area', 'm_com')
t = T('Para aquele que comprou', 322)
active(t, T('Caso ele não faça', 352), 'm_area')
t = T('para um webinário', 335)
reveal(t, 'e18', 'c_evento'); cam(t - 0.3, 1850, 700, 0.6, 1.8); active(t, T('Caso ele não faça', 352), 'c_evento')
t = T('agendamento automático ali', 345)
reveal(T('E ele mesmo faz', 345), 'e19'); active(T('E ele mesmo faz', 345), T('Caso ele não faça', 352), 'k_agenda'); cam(T('E ele mesmo faz', 345), 1750, 900, 0.55)
t = T('Caso ele não faça', 352)
cam(t, 1700, 860, 0.85); active(t, T('e a gente faz um agendamento', 370), 'm_com')
t = T('ligação de qualificação', 355)
reveal(t, 'e20', 'm_lig'); active(t, T('e a gente faz um agendamento', 370), 'm_lig')
t = T('e a gente faz um agendamento', 370)
reveal(t, 'e21'); cam(t, 1650, 1150, 0.75); active(t, t + 4, 'k_agenda', 'k_consult')
t = T('sessão diagnóstica', 375)
reveal(t, 'e12', 'o_mentor'); cam(t + 0.2, 1900, 1430, 0.8); active(t, T('Só que, fora', 390), 'o_mentor')
reveal(T('tanto a Leilão Pro', 378), 'e22', 'p1'); reveal(T('tanto o investidor', 378), 'e23', 'p2'); reveal(T('quanto o milionário', 378), 'e24', 'p3')
t = T('Então esses são os dois fluxos', 385)
cam(t, 1150, 940, 0.48, 1.8)
active(T('um para vender serviço', 385), CH[3]['t'], 'o_assess', 'f_vista', 'f_fin', color='lime')
active(T('outro para vender mentoria', 385), CH[3]['t'], 'o_mentor', 'm_low', 'm_area', 'm_com', 'm_leads', 'm_banner', color='white')

# ------------------------------------------------------------------ CH3 a ponte
c3 = CH[3]['t'] + 1.8
cam(c3 - 0.6, 860, 600, 0.6)
t = T('a gente tem a plataforma Canal', 400)
reveal(t, 'c_site'); cam(t - 0.2, 2300, 420, 0.8)
t_em = T('é uma emissora', 405)
demo(t_em - 0.3, T('Então, em alguns momentos', 420) - 0.1, 'canaw_inicio', 'canaw.app',
     kf=[dict(t=0, cx=960, cy=400, z=1.0), dict(t=6, cx=990, cy=330, z=1.4), dict(t=10, cx=960, cy=560, z=1.0)],
     hl=[dict(t0=1.0, t1=5.5, x=440, y=40, w=130, h=60, label='programas ao vivo agora'),
         dict(t0=10, t1=20, x=430, y=720, w=1130, h=270, label='um canal por especialista')])
t = T('Então, em alguns momentos', 420)
cam(t, 1850, 330, 0.62, 1.8); active(t, t + 4, 'm_banner', 'c_site')
t = T('no banner dos especialistas', 430)
reveal(t, 'b1'); active(t, t + 5, 'b1', 'm_banner', 'c_site')
t = T('Na área de membros do produto', 440)
cam(t, 1820, 640, 0.6); active(t, t + 5, 'e18', 'm_area', 'c_evento')
t = T('Tanto nas propagandas', 448)
ovl('chips', t, T('Então a gente vai estar sempre', 465), anchor='b1mid', items=[['banners', T('com os banners', 448)], ['vídeo bomba', T('vídeo bomba', 448)], ['área de membros', T('também dentro da área de membros', 460)]])
cam(t, 1850, 360, 0.66); active(t, T('Então a gente vai estar sempre', 465), 'b1')
t = T('Então a gente vai estar sempre', 465)
cam(t, 1800, 560, 0.5, 1.8); active(t, CH[4]['t'], 'b1', 'e18', 'c_site', 'c_evento', color='red')
ovl('badge', T('mais tempo de tela', 470), CH[4]['t'] + 0.3, text='tempo de tela', at='c_site')

# ------------------------------------------------------------------ CH4 Canaw funil
c4 = CH[4]['t'] + 1.8
cam(c4 - 0.6, 2450, 420, 0.95)
t = T('esse cliente visita o site', 480)
active(t, t + 3, 'c_site')
t = T('ele vai ter programas', 485)
reveal(t, 'c1', 'c_prog'); active(t, t + 5, 'c_prog')
t = T('Como que funcionam esses programas?', 488)
demo(t - 0.2, T('E quando ele encontra', 508) - 0.1, 'canaw_tv_ch01', 'canaw.app/tv',
     kf=[dict(t=0, cx=960, cy=540, z=1.0), dict(t=7, cx=960, cy=540, z=1.0), dict(t=10, cx=820, cy=880, z=1.5)],
     hl=[dict(t0=1.5, t1=7, x=110, y=25, w=1380, h=780, label='programa rolando ao vivo'),
         dict(t0=10.5, t1=18, x=110, y=885, w=1380, h=90, label='programação: a seguir')])
t = T('E quando ele encontra', 508)
cam(t, 2420, 470, 0.9); active(t, t + 3, 'c_prog')
t = T('levar ele para o evento', 510)
reveal(t, 'c2', 'c_evento'); active(t, T('Então, apesar de estar', 525), 'c_evento')
t = T('Então, apesar de estar', 525)
demo(t, T('ele vai ser impactado por itens', 535) - 0.1, 'canaw_tv_ch02', 'canaw.app/tv',
     kf=[dict(t=0, cx=960, cy=540, z=1.0)], hl=[dict(t0=0.8, t1=9, x=40, y=60, w=1000, h=640, label='estilo TV: sem pausar, sem avançar')])
t = T('ele vai ser impactado por itens', 535)
cam(t, 2400, 560, 0.9); active(t, t + 6, 'c_evento')
ovl('chips', t, T('O evento, o webinário', 542), anchor='c_evento', items=[['artefatos de marketing', T('artefatos de marketing', 535)]])
t = T('O evento, o webinário', 542)
cam(t, 2000, 950, 0.55, 1.8); active(t, t + 4, 'c_evento')
t = T('chamada para fazer o agendamento', 550)
active(t, t + 4, 'e19', 'k_agenda')
demo(t + 0.4, T('ganha uma consultoria', 555) + 0.6, 'canaw_tv_ch01', 'canaw.app/tv',
     kf=[dict(t=0, cx=1360, cy=840, z=2.6)], mode='inset', label='Contato direto com o especialista',
     hl=[dict(t0=0.5, t1=9, x=1270, y=812, w=280, h=60, label='')])
active(T('ganha uma consultoria', 555), T('Só que, se esse cara', 565), 'k_consult')
active(T('compra aí a mentoria', 560), T('Só que, se esse cara', 565), 'o_mentor', 'o_assess')
t = T('Só que, se esse cara', 565)
cam(t, 2450, 650, 0.85); active(t, t + 4, 'c_evento')
t = T('marketing, remarketing', 575)
reveal(t, 'c3', 'c_remk'); active(t, t + 6, 'c_remk')
t = T('produto low ticket nosso', 578)
reveal(t, 'c4'); cam(t - 0.3, 2050, 700, 0.55, 1.8); active(t, T('Então, dentro do próprio evento', 594), 'c4', 'm_low')
t = T('Então, dentro do próprio evento', 594)
active(t, t + 5, 'c_evento')
t = T('dá acesso para ele novamente', 600)
active(t, t + 4, 'm_low', 'm_area', 'e16')
t = T('ele vai para o webinário', 605)
active(t, t + 5, 'e18', 'c_evento', 'e19', 'k_agenda')
t = T('Ou, do mesmo formato', 618)
cam(t, 1700, 1000, 0.6); active(t, CH[5]['t'], 'm_com', 'e20', 'm_lig', 'e21', 'k_agenda', 'o_mentor')

# ------------------------------------------------------------------ CH5 low ticket independente
c5 = CH[5]['t'] + 1.8
cam(c5 - 0.6, 1700, 450, 0.8)
t = T('Esse produto low ticket', 630); active(t, t + 4, 'm_low')
t = T('tráfego', 638)
reveal(t, 'e_traf', 't1'); active(t, T('Porque, a partir daí', 650), 'e_traf', 't1', 'm_low')
t = T('Porque, a partir daí', 650)
cam(t, 1750, 900, 0.6)
active(T('estar em um estágio', 655), T('tanto pessoas que', 660), 'm_com', 'm_lig', 'o_mentor')
t = T('tanto pessoas que', 660)
cam(t, 1950, 650, 0.6); active(t, CH[6]['t'], 'm_area', 'e18', 'c_evento')
t = T('retroalimentação', 668)
ovl('loop', t - 0.5, CH[6]['t'] + 0.3, at=[1880, 700])

# ------------------------------------------------------------------ CH6 síntese
c6 = CH[6]['t'] + 1.8
cam(c6 - 0.6, *FULL)
t = T('Sempre na parte', 676)
active(t, T('a gente vai fazer com que', 685), 'b1', 'b2', 'e18', color='red')
ovl('pillars', t, T('a gente vai fazer com que', 685) + 0.4, items=[['mídia', T('de mídia', 678)], ['aprendizado', T('e de aprendizado', 680)], ['tempo de tela', T('de tempo de tela', 682)]])
t = T('pessoas que vão para a canal', 686)
reveal(t, 'b2')
demo(t, T('e pessoas que viram', 695) - 0.1, 'split', 'Canaw → Fexô', kf=[], mode='split', label='canaw.app  →  fexô.com')
t = T('e pessoas que viram', 695)
cam(t, 1850, 330, 0.62); active(t, T('Então, hoje,', 708), 'b1', 'm_banner', 'c_site')
t = T('Então, hoje,', 708)
cam(t, 1500, 1450, 0.7); active(t, T('para que a gente consiga', 718), 'o_assess', 'o_mentor')
t = T('terceirizar esse serviço', 720)
active(t, t + 4, 'o_assess', color='lime')
t = T('autonomia', 730)
active(t, T('Então, esse é o formato', 740), 'o_mentor', 'p1', 'p2', 'p3', color='white')
t = T('Então, esse é o formato', 740)
cam(t, *FULL, dur=2.0); active(t, TOTAL, *list(N.keys()), *list(E.keys()), color='all')
ovl('end', LAST + 0.8, TOTAL)

# ------------------------------------------------------------------ fix map reveal of everything at the very end
for d in (N, E):
    for v in d.values():
        if v['reveal'] is None: v['reveal'] = LAST
CAM.sort(key=lambda c: c['t']); DEMO.sort(key=lambda d: d['t0'])

# ------------------------------------------------------------------ SUBTITLES
FIX = {'fechou': 'Fexô', 'fechor': 'Fexô', 'feixô': 'Fexô', 'canal': 'Canaw', 'necta': 'Nekta', 'luiz': 'Luís',
       'hollenberg': 'Rolemberg', 'elis': 'Eliz', 'webinário': 'webinário'}
def fixw(w):
    m = re.match(r'^(\W*)([\wà-úÀ-Ú$]+)(\W*)$', w)
    if not m: return w
    a, core, b = m.groups()
    if core.lower() in FIX: core = FIX[core.lower()]
    return a + core + b
words = []
for w in W:
    txt = fixw(w['w'])
    txt = txt.replace('R$197,00', 'R$ 197').replace('R$197', 'R$ 197').replace('PRO', 'PRO')
    words.append(dict(w=txt, s=w['s'], e=w['e']))
for i, w in enumerate(words):
    if w['w'].lower() == 'leilão' and i + 1 < len(words) and words[i + 1]['w'].lower().startswith('pro'):
        w['w'] = 'Leilão'; words[i + 1]['w'] = 'PRO' + words[i + 1]['w'][3:]
SUBS = []; cur = []
for i, w in enumerate(words):
    cur.append(w)
    txt = ' '.join(x['w'] for x in cur)
    nxt = words[i + 1] if i + 1 < len(words) else None
    gap = (nxt['s'] - w['e']) if nxt else 9
    endp = w['w'][-1] in '.?!'
    comma = w['w'][-1] in ',;:'
    if (not nxt or gap > 0.5 or endp or len(txt) > 40 or (comma and len(txt) > 22) or (w['e'] - cur[0]['s']) > 3.4
            or (nxt and len(txt) + len(nxt['w']) > 44)):
        SUBS.append(dict(t0=cur[0]['s'], t1=max(w['e'], cur[0]['s'] + 0.7), words=[[x['w'], x['s']] for x in cur])); cur = []
for a, b in zip(SUBS, SUBS[1:]):
    a['t1'] = min(max(a['t1'] + 0.25, a['t1']), b['t0'] - 0.02)
def srt_t(x):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return '%02d:%02d:%06.3f' % (h, m, s)
with open(S + 'legendas_ep01.srt', 'w') as f:
    for i, s in enumerate(SUBS, 1):
        txt = ' '.join(w for w, _ in s['words'])
        f.write('%d\n%s --> %s\n%s\n\n' % (i, srt_t(s['t0']).replace('.', ','), srt_t(s['t1']).replace('.', ','), txt))

DATA = dict(total=TOTAL, chapters=TL['chapters'], gaps=GAPS, nodes=list(N.values()), edges=list(E.values()),
            active=ACT, cam=CAM, demo=DEMO, ovl=OVL, subs=SUBS)
open(S + 'engine/data.js', 'w').write('window.DATA=' + json.dumps(DATA, ensure_ascii=False) + ';')
print('ok total', TOTAL, 'subs', len(SUBS), 'demos', len(DEMO), 'cams', len(CAM))
for c in TL['chapters']: print('  %6.2f  %s' % (c['t'], c['title']))
