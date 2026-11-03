"""Fabrique videos/stats/stats-tiktok.xlsx à partir de la réponse JSON de Buffer list_posts (includeMetrics: true).
Usage : python3 engine/stats_excel.py <posts.json> [sortie.xlsx]   (depuis le dossier videos/)"""
import json, os, re, subprocess, sys, urllib.parse
from datetime import datetime, timezone, timedelta
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

src = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'stats/stats-tiktok.xlsx'
raw = json.load(open(src))
if isinstance(raw, list): raw = raw[0]['text']
if isinstance(raw, str): raw = json.JSONDecoder().raw_decode(raw[raw.index('{'):])[0]
posts = [e['node'] for e in raw['edges']]

def paris(iso):
    if not iso: return None
    d = datetime.fromisoformat(iso.replace('Z', '+00:00'))
    off = 1 if not (3 < d.month < 11 or (d.month == 3 and d.day >= 29) or (d.month == 10 and d.day < 25)) else 2
    return (d + timedelta(hours=off)).replace(tzinfo=None)

IDS = {}
def _scan(o):
    if isinstance(o, dict):
        bid = o.get('buffer_post') or o.get('buffer'); d = o.get('dossier') or o.get('dir')
        if isinstance(bid, str) and isinstance(d, str): IDS[bid] = d.replace('videos/', '')
        for v in o.values(): _scan(v)
    elif isinstance(o, list):
        for v in o: _scan(v)
for fn in os.listdir('.'):
    if fn.endswith('.json'):
        try: _scan(json.load(open(fn)))
        except Exception: pass
def folder(p):
    if p['id'] in IDS: return IDS[p['id']]
    for a in p.get('assets') or []:
        for u in (a.get('source', ''), urllib.parse.unquote(a.get('thumbnail', '') or '')):
            m = re.search(r'/videos/([^/]+)/tiktok\.mp4', u)
            if m: return m.group(1)
    return ''

def made(f):
    if not f or not os.path.exists(f'{f}/tiktok.mp4'): return None
    r = subprocess.run(['git', 'log', '--diff-filter=A', '--format=%cI', '--', f'{f}/tiktok.mp4'], capture_output=True, text=True).stdout.split()
    if not r: return None
    return paris(datetime.fromisoformat(r[-1]).astimezone(timezone.utc).isoformat())

def title(f, p):
    try: return json.load(open(f'{f}/script.json')).get('title') or f
    except Exception: return (p.get('text') or '').split('\n')[0][:60]

def kind(f):
    if f.startswith('cinema-'): return 'Série cinéma (autre chat)'
    if f.startswith('blackout'): return 'Survie'
    if f.startswith(('nuit-', 'ascenseur-', 'horreur-')): return 'Horreur'
    if f.startswith('etsi-'): return 'Et si…'
    if f.startswith('histoire-'): return 'Histoire'
    return 'Autre'

STATUS = {'sent': 'Publiée', 'scheduled': 'Programmée', 'sending': 'En cours d\'envoi', 'error': 'Erreur', 'draft': 'Brouillon'}
wb = Workbook(); ws = wb.active; ws.title = 'Vidéos'
H = ['Titre', 'Dossier', 'Type', 'Fabriquée le', 'Programmée pour', 'Publiée le', 'Statut', 'Durée (s)', 'Vues', 'Likes',
     'Commentaires', 'Partages', 'Personnes touchées', 'Temps moyen regardé (s)', '% de la vidéo regardé', "Taux d'engagement", 'Stats mises à jour le', 'Description']
F = Font(name='Arial', size=10); FB = Font(name='Arial', size=10, bold=True, color='FFFFFF')
fill = PatternFill('solid', fgColor='1F2A44'); thin = Side(style='thin', color='D0D4DC')
ws.append(H)
for c in ws[1]: c.font = FB; c.fill = fill; c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
ws.row_dimensions[1].height = 32
posts.sort(key=lambda p: p.get('dueAt') or '')
for p in posts:
    f = folder(p); m = {x['type']: x['value'] for x in (p.get('metrics') or [])}
    dur = None
    for a in p.get('assets') or []:
        if (a.get('video') or {}).get('durationMs'): dur = round(a['video']['durationMs'] / 1000, 1)
    sent = p.get('status') == 'sent'
    ws.append([title(f, p), f, kind(f), made(f), paris(p.get('dueAt')), paris(p.get('sentAt')), STATUS.get(p.get('status'), p.get('status')), dur,
               m.get('views') if sent else None, m.get('reactions') if sent else None, m.get('comments') if sent else None,
               m.get('shares') if sent else None, m.get('reach') if sent else None, m.get('averageTimeWatched') if sent else None,
               None, None, paris(p.get('metricsUpdatedAt')) if sent else None, (p.get('text') or '').replace('\n', ' ')])
    r = ws.max_row
    ws[f'O{r}'] = f'=IF(AND(ISNUMBER(N{r}),H{r}>0),N{r}/H{r},"")'
    ws[f'P{r}'] = f'=IF(AND(ISNUMBER(I{r}),I{r}>0),(J{r}+K{r}+L{r})/I{r},"")'
n = ws.max_row
for row in ws.iter_rows(min_row=2, max_row=n):
    for c in row: c.font = F; c.border = Border(bottom=thin)
    for k in (3, 4, 5, 16): row[k].number_format = 'dd/mm/yyyy hh:mm'
    for k in range(8, 13): row[k].number_format = '#,##0'
    row[13].number_format = '0.0'; row[14].number_format = '0%'; row[15].number_format = '0.0%'
W = [34, 22, 20, 16, 16, 16, 14, 9, 9, 8, 12, 9, 12, 12, 11, 12, 16, 60]
for i, w in enumerate(W, 1): ws.column_dimensions[get_column_letter(i)].width = w
ws.freeze_panes = 'B2'; ws.auto_filter.ref = f'A1:R{n}'

s = wb.create_sheet('Résumé')
rows = [('Vidéos publiées', f'=COUNTIF(Vidéos!G2:G{n},"Publiée")', '#,##0'),
        ('Vidéos programmées', f'=COUNTIF(Vidéos!G2:G{n},"Programmée")', '#,##0'),
        ('Vues totales', f'=SUM(Vidéos!I2:I{n})', '#,##0'),
        ('Likes totaux', f'=SUM(Vidéos!J2:J{n})', '#,##0'),
        ('Commentaires totaux', f'=SUM(Vidéos!K2:K{n})', '#,##0'),
        ('Partages totaux', f'=SUM(Vidéos!L2:L{n})', '#,##0'),
        ('Vues moyennes par vidéo publiée', '=IF(B2>0,B4/B2,0)', '#,##0.0'),
        ("Taux d'engagement global", '=IF(B4>0,(B5+B6+B7)/B4,0)', '0.0%'),
        ('Meilleure vidéo (vues)', f'=IFERROR(INDEX(Vidéos!A2:A{n},MATCH(MAX(Vidéos!I2:I{n}),Vidéos!I2:I{n},0)),"")', None)]
s.append(['Indicateur', 'Valeur']);
for c in s[1]: c.font = FB; c.fill = fill
for a, b, fmt in rows:
    s.append([a, b]); s.cell(s.max_row, 2).number_format = fmt or 'General'
for row in s.iter_rows(min_row=2):
    for c in row: c.font = F
s.column_dimensions['A'].width = 34; s.column_dimensions['B'].width = 40
s.append([]); s.append([f'Source : Buffer (statistiques TikTok de @etsi_scenario), mises à jour par Buffer environ une fois par jour. Fichier généré le {datetime.now().strftime("%d/%m/%Y %H:%M")} (heure du serveur, UTC).'])
s.cell(s.max_row, 1).font = Font(name='Arial', size=9, italic=True, color='666666')
s.append(['« Fabriquée le » = date où la vidéo a été ajoutée au dépôt GitHub (heure de Paris).'])
s.cell(s.max_row, 1).font = Font(name='Arial', size=9, italic=True, color='666666')
os.makedirs(os.path.dirname(out) or '.', exist_ok=True); wb.save(out); print(out, n - 1, 'vidéos')
