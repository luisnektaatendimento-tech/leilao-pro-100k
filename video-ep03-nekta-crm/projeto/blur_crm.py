# Anonimiza nomes e telefones de leads nas telas do CRM (LGPD) e prepara as imagens para o motor (2880 px).
from PIL import Image, ImageFilter
import os
S = os.path.dirname(os.path.abspath(__file__)) + '/'
M = {
 'b_16':  [(318, 905, 610, 1022)],
 'b_12':  [(318, 685, 610, 1002)],
 'b_100': [(318, 470, 610, 1022)],
 'b_106': [(890, 292, 1215, 342), (636, 414, 772, 456)],
 'b_135': [(300, 322, 525, 376), (300, 548, 525, 594), (300, 774, 525, 820), (848, 330, 1015, 370), (1128, 330, 1375, 370)],
 'b_115': [(342, 664, 1880, 706), (342, 888, 1880, 932)],
 'b_175': [(476, 386, 660, 442)],
 'b_216': [(652, 522, 815, 552), (1525, 448, 1625, 478)],
}
for k, boxes in M.items():
    im = Image.open(S + f'crm/{k}.png').convert('RGB')
    for b in boxes:
        reg = im.crop(b)
        small = reg.resize((max(1, reg.width // 14), max(1, reg.height // 14)), Image.BILINEAR).resize(reg.size, Image.NEAREST)
        im.paste(small.filter(ImageFilter.GaussianBlur(4)), b)
    im = im.crop((0, 108, 1920, 1020))           # remove abas/URL do navegador e barra de tarefas
    im = im.resize((2880, int(912 * 1.5)), Image.LANCZOS)
    im.save(S + f'assets/crm_{k}.png'); print('ok', k, im.size)
