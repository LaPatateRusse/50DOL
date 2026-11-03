"""Format long YouTube (16:9, 1920×1080) : assemble les parties d'une série terminée en une « histoire complète »,
avec un générique d'intro et une fin INÉDITS (voix Gemini), des cartons de chapitre, et la description avec chapitres.

Usage (depuis videos/) :  python3 engine/long_format.py long/<nom>/config.json
config.json : { "title", "subtitle", "voice": "Orus", "style": "...", "intro_say", "outro_say",
                "parts": [ { "dir": "blackout", "label": "JOUR 1", "cut_end": 3.2, "cut_start": 0 }, ... ],
                "description_head": "...", "hashtags": "..." }
- Vidéos verticales classiques : centrées sur un fond flou (pillarbox).
- Vidéos « style cinéma » (champ "cinema": true) : on garde seulement la bande 16:9 du film (y 656 → 1264), plein écran.
Clé : GEMINI_API_KEY (environnement, jamais écrite dans le dépôt)."""
import base64, json, os, subprocess, sys, urllib.request, urllib.error, wave
from PIL import Image, ImageDraw, ImageFont, ImageFilter

cfg_path = sys.argv[1]; cfg = json.load(open(cfg_path)); OUT = os.path.dirname(cfg_path)
TMP = os.path.join('.build', 'long-' + os.path.basename(OUT)); os.makedirs(TMP, exist_ok=True)
ENG = os.path.dirname(os.path.abspath(__file__))
OSW = os.path.join(ENG, 'oswald.ttf'); MON = os.path.join(ENG, 'montserrat.ttf')
W, H, FPS = 1920, 1080, 30
run = lambda *a: subprocess.run(list(a), check=True)
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)

def font(path, size, wght=None):
    f = ImageFont.truetype(path, size)
    if wght:
        try: f.set_variation_by_axes([wght])
        except Exception: pass
    return f

def tts(text, name):
    """Voix Gemini (relais entre modèles si quota épuisé). Renvoie un .wav 48 kHz ou None."""
    out = os.path.join(TMP, name + '.wav')
    if os.path.exists(out): return out
    key = os.environ.get('GEMINI_API_KEY')
    if not key: return None
    body = {"contents": [{"parts": [{"text": cfg.get('style', '') + "\n\n" + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": cfg.get('voice', 'Orus')}}}}}
    for m in ["gemini-2.5-flash-preview-tts", "gemini-3.8-flash-tts", "gemini-3.1-flash-tts-preview", "gemini-3.8-flash-lite-tts"]:
        try:
            req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent", data=json.dumps(body).encode(),
                                         headers={"x-goog-api-key": key, "Content-Type": "application/json"})
            res = json.load(urllib.request.urlopen(req, timeout=300))
            pcm = base64.b64decode(res["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
            raw = os.path.join(TMP, name + '.pcm'); open(raw, 'wb').write(pcm)
            run('ffmpeg', '-y', '-v', 'error', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', raw, '-af',
                'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,acompressor=threshold=-18dB:ratio=3:makeup=2',
                '-ar', '48000', '-ac', '2', out)
            if dur(out) > len(text) / 9 + 4:  # Gemini a déraillé (texte répété ou bruit) : modèle suivant
                print('voix trop longue', name, m, round(dur(out))); os.remove(out); continue
            print('voix', name, m); return out
        except urllib.error.HTTPError as e:
            if e.code == 429: continue
            raise
    return None

def card(path, big, small='', top=''):
    im = Image.new('RGB', (W, H), (10, 11, 18)); d = ImageDraw.Draw(im)
    for r in range(700, 0, -20):  # halo
        a = int(30 * (1 - r / 700)); d.ellipse([W / 2 - r * 1.6, H / 2 - r, W / 2 + r * 1.6, H / 2 + r], fill=(10 + a, 11 + a, 18 + int(a * 1.4)))
    if top: d.text((W / 2, 300), top, font=font(MON, 46, 800), fill=(154, 162, 188), anchor='mm')
    d.text((W / 2, 520), big, font=font(OSW, 170), fill=(245, 184, 46), anchor='mm')
    if small: d.text((W / 2, 690), small, font=font(MON, 54, 800), fill=(255, 255, 255), anchor='mm')
    im.save(path)

def clip_from_card(img, seconds, audio, out):
    a = ['-i', audio] if audio else ['-f', 'lavfi', '-t', str(seconds), '-i', 'anullsrc=r=48000:cl=stereo']
    run('ffmpeg', '-y', '-v', 'error', '-loop', '1', '-t', str(seconds), '-i', img, *a,
        '-filter_complex', f"[0:v]scale={W}:{H},zoompan=z='min(zoom+0.0006,1.06)':d=1:s={W}x{H}:fps={FPS},format=yuv420p[v];[1:a]apad,atrim=0:{seconds}[a]",
        '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-t', str(seconds), out)

def clip_from_part(p, out):
    src = os.path.join(p['dir'], 'tiktok.mp4'); d0 = dur(src); s0 = p.get('cut_start', 0); d1 = d0 - s0 - p.get('cut_end', 0)
    if p.get('cinema'):
        vf = f"[0:v]crop=1080:608:0:656,scale={W}:{H}:flags=lanczos,fps={FPS},format=yuv420p[v]"
    else:
        vf = (f"[0:v]split[a][b];[a]scale={W}:-2,crop={W}:{H},boxblur=40:2,eq=brightness=-0.18[bg];"
              f"[b]scale=-2:{H}[fg];[bg][fg]overlay=(W-w)/2:0,fps={FPS},format=yuv420p[v]")
    run('ffmpeg', '-y', '-v', 'error', '-ss', str(s0), '-t', str(d1), '-i', src, '-filter_complex', vf + ";[0:a]aresample=48000,afade=t=out:st=" + str(max(0, d1 - .4)) + ":d=0.4[a]",
        '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2', out)
    return d1

clips, chapters, t = [], [], 0.0
ia = tts(cfg['intro_say'], 'intro'); intro_len = (dur(ia) + 1.2) if ia else 5
card(os.path.join(TMP, 'intro.png'), cfg['title'], cfg.get('subtitle', ''), "L'HISTOIRE COMPLÈTE")
clip_from_card(os.path.join(TMP, 'intro.png'), intro_len, ia, os.path.join(TMP, 'c00.mp4')); clips.append('c00.mp4'); chapters.append((0, 'Introduction')); t += intro_len
for i, p in enumerate(cfg['parts']):
    cp = os.path.join(TMP, f'ch{i}.png'); card(cp, p['label'], p.get('sub', ''))
    clip_from_card(cp, 1.6, None, os.path.join(TMP, f'c{i + 1:02d}a.mp4')); clips.append(f'c{i + 1:02d}a.mp4')
    chapters.append((t, p['label'] + (' — ' + p['sub'] if p.get('sub') else ''))); t += 1.6
    t += clip_from_part(p, os.path.join(TMP, f'c{i + 1:02d}b.mp4')); clips.append(f'c{i + 1:02d}b.mp4')
oa = tts(cfg['outro_say'], 'outro'); outro_len = (dur(oa) + 1.5) if oa else 5
card(os.path.join(TMP, 'outro.png'), 'FIN', cfg.get('outro_text', 'Abonne-toi pour la prochaine histoire'))
clip_from_card(os.path.join(TMP, 'outro.png'), outro_len, oa, os.path.join(TMP, 'c99.mp4')); clips.append('c99.mp4'); chapters.append((t, 'Fin')); t += outro_len
open(os.path.join(TMP, 'list.txt'), 'w').write(''.join(f"file '{c}'\n" for c in clips))
final = os.path.join(OUT, 'youtube-long.mp4')
run('ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', os.path.join(TMP, 'list.txt'), '-c', 'copy', '-movflags', '+faststart', final)
fmt = lambda s: f"{int(s // 60):02d}:{int(s % 60):02d}"
desc = cfg.get('description_head', '') + "\n\n" + "\n".join(f"{fmt(s)} {n}" for s, n in chapters) + "\n\n" + cfg.get('hashtags', '')
open(os.path.join(OUT, 'description.txt'), 'w').write(desc)
print(final, round(dur(final), 1), 's'); print(desc)
