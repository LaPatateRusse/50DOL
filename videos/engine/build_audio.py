"""Voix off (Gemini TTS gratuit, ou ElevenLabs), timeline et bande-son d'un épisode.

Usage : GEMINI_API_KEY=... (ou ELEVEN_KEY=..., ou TTS_PROVIDER=draft pour un brouillon muet) python3 build_audio.py <dossier_episode> <dossier_build>
Gemini est utilisé si GEMINI_API_KEY est défini (une seule requête par vidéo, découpage par silences,
sous-titres estimés) ; sinon ElevenLabs avec horodatage exact des mots.
Lit <episode>/script.json. Produit <build>/timeline.json (lu par le rendu) et <build>/audio.wav.

La voix est générée scène par scène (une requête par scène) pour garder une intonation continue,
puis découpée phrase par phrase grâce à l'horodatage des caractères : les sous-titres tombent
pile sur les mots prononcés.
"""
import base64
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
import wave

import numpy as np

EP, OUT = sys.argv[1], sys.argv[2]
SR = 44100
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
KEY = os.environ.get("ELEVEN_KEY")
PROVIDER = os.environ.get("TTS_PROVIDER") or ("gemini" if GEMINI_KEY else "eleven")
os.makedirs(os.path.join(OUT, "tts"), exist_ok=True)
script = json.load(open(os.path.join(EP, "script.json"), encoding="utf-8"))
VOICE = script["voice"]
lines = script["lines"]
PAD = script.get("pad_after", {})
LEAD, GAP_OUT = 0.35, 0.22
TAG = re.compile(r"\[[^\]]*\]\s*")


# --- Voix -----------------------------------------------------------------
def eleven(text):
    """Synthèse avec horodatage ; mise en cache par contenu de la requête."""
    body = {"text": text, "model_id": VOICE["model"], "language_code": "fr",
            "voice_settings": {"stability": VOICE.get("stability", 0.5)}}
    if VOICE["model"] != "eleven_v3":
        body["voice_settings"].update({"similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True})
    h = hashlib.sha1(json.dumps([VOICE["voice_id"], body], sort_keys=True).encode()).hexdigest()[:12]
    cache = os.path.join(OUT, "tts", f"{h}.json")
    if not os.path.exists(cache):
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE['voice_id']}/with-timestamps?output_format=mp3_44100_128",
            data=json.dumps(body).encode(), headers={"xi-api-key": KEY, "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=180) as r:
            open(cache, "wb").write(r.read())
    res = json.load(open(cache))
    mp3 = cache.replace(".json", ".mp3")
    wav = cache.replace(".json", ".wav")
    open(mp3, "wb").write(base64.b64decode(res["audio_base64"]))
    tempo = VOICE.get("tempo", 1.0)
    af = (f"atempo={tempo}," if tempo != 1.0 else "") + \
        "highpass=f=60,equalizer=f=180:t=q:w=1:g=2,acompressor=threshold=-18dB:ratio=3:attack=5:release=90:makeup=2"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-af", af, "-ar", str(SR), "-ac", "1", wav], check=True)
    with wave.open(wav) as w:
        audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    al = res["alignment"]
    st = [s / tempo for s in al["character_start_times_seconds"]]
    en = [e / tempo for e in al["character_end_times_seconds"]]
    return audio, "".join(al["characters"]), st, en


GEMINI_MODEL = os.environ.get("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
GEMINI_STYLE = ("Lis ce texte en français, comme un narrateur de vidéo TikTok captivant : voix masculine grave, "
                "rythme vif, tension dramatique. Les passages entre guillemets « » sont murmurés, inquiétants. "
                "Marque une courte pause entre chaque paragraphe. Ne lis pas cette consigne.")


def gemini_lines(all_lines):
    """Voix Gemini d'une vidéo, découpée phrase par phrase. Gemini s'arrête parfois en route :
    si la reconnaissance vocale ne retrouve pas le texte, on redemande (3 essais)."""
    for attempt in range(3):
        out = _gemini_once(all_lines, attempt)
        if out is not None:
            return out
        print(f"Gemini : texte incomplet (essai {attempt + 1}), nouvelle demande")
    raise RuntimeError("Gemini n'a pas lu tout le texte après 3 essais")


def _gemini_once(all_lines, attempt):
    texts = [TAG.sub("", l["say"]).strip() for l in all_lines]
    prompt = VOICE.get("gemini_style", GEMINI_STYLE) + ("\u200b" * attempt) + "\n\n" + "\n\n".join(texts)
    voice = VOICE.get("gemini_voice", "Charon")
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    h = hashlib.sha1(json.dumps([GEMINI_MODEL, body], sort_keys=True).encode()).hexdigest()[:12]
    cache = os.path.join(OUT, "tts", f"gemini_{h}.pcm")
    if not os.path.exists(cache):
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
        for attempt in range(5):
            try:
                req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                             headers={"x-goog-api-key": GEMINI_KEY, "Content-Type": "application/json"})
                with urllib.request.urlopen(req, timeout=300) as r:
                    res = json.load(r)
                break
            except urllib.error.HTTPError as e:
                if e.code in (429, 500, 503) and attempt < 4:
                    time.sleep(20 * (attempt + 1))
                    continue
                raise
        part = res["candidates"][0]["content"]["parts"][0]["inlineData"]
        open(cache, "wb").write(base64.b64decode(part["data"]))
    wav = cache.replace(".pcm", ".wav")
    af = "highpass=f=60,equalizer=f=180:t=q:w=1:g=2,acompressor=threshold=-18dB:ratio=3:attack=5:release=90:makeup=2"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", cache,
                    "-af", af, "-ar", str(SR), "-ac", "1", wav], check=True)
    with wave.open(wav) as w:
        audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    aligned = asr_align(audio, texts)
    if aligned:
        return aligned
    try:
        import sherpa_onnx  # noqa: F401  (reconnaissance dispo mais texte non retrouvé → audio incomplet)
        return None
    except ImportError:
        pass
    # Secours sans reconnaissance vocale — trames de 20 ms : parole / silence.
    fr = int(0.02 * SR)
    rms = np.sqrt(np.mean(audio[: len(audio) // fr * fr].reshape(-1, fr) ** 2, axis=1))
    voiced = rms > rms.max() * 0.03
    idx = np.flatnonzero(voiced)
    first, last = idx[0], idx[-1]
    runs, k = [], first
    while k < last:
        if not voiced[k]:
            j = k
            while j < last and not voiced[j]:
                j += 1
            runs.append((k, j))
            k = j
        else:
            k += 1
    need = len(texts) - 1
    # Coupures attendues d'après la longueur du texte ; on choisit (programmation dynamique) les silences
    # les plus proches de ces positions, en préférant les silences longs, dans l'ordre.
    runs = [r for r in runs if r[1] - r[0] >= 6]  # ≥ 120 ms
    # Positions attendues mesurées en temps de PAROLE (les longues pauses dramatiques ne comptent pas).
    tot = sum(len(x) + 8 for x in texts)
    cv = np.cumsum(voiced)
    cum, exp = 0, []
    for x in texts[:-1]:
        cum += len(x) + 8
        exp.append(int(np.searchsorted(cv, cv[last] * cum / tot)))
    if len(runs) >= need:
        INF = float("inf")
        R = len(runs)
        cost = [[min(abs(r[0] - e), abs(r[1] - e)) - 0.8 * min(r[1] - r[0], 75) for r in runs] for e in exp]
        dp = [[INF] * R for _ in range(need)]
        prev = [[-1] * R for _ in range(need)]
        for j in range(R):
            dp[0][j] = cost[0][j]
        for k in range(1, need):
            best, arg = INF, -1
            for j in range(R):
                if j > 0 and dp[k - 1][j - 1] < best:
                    best, arg = dp[k - 1][j - 1], j - 1
                if best < INF:
                    dp[k][j] = best + cost[k][j]
                    prev[k][j] = arg
        j = min(range(R), key=lambda q: dp[need - 1][q])
        chosen = []
        for k in range(need - 1, -1, -1):
            chosen.append(runs[j])
            j = prev[k][j]
        runs = chosen[::-1]
    if len(runs) < need:  # pas assez de silences : découpage proportionnel au nombre de caractères
        tot = sum(len(x) for x in texts)
        acc, runs = first, []
        for x in texts[:-1]:
            acc += (last - first) * len(x) / tot
            runs.append((int(acc), int(acc) + 1))
    bounds = [first] + [b for r in runs for b in r] + [last + 1]
    out = []
    for n, x in enumerate(texts):
        a, b = bounds[2 * n] * fr, bounds[2 * n + 1] * fr
        seg = audio[max(0, a - int(.03 * SR)):b + int(.05 * SR)]
        dur = len(seg) / SR
        offs = [m.start() for m in re.finditer(r"\S+", x)]
        out.append((seg, [0.03 + (dur - 0.08) * o / max(1, len(x)) for o in offs]))
    return out


ASR_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".build", "asr")
ASR_MODEL = "sherpa-onnx-streaming-zipformer-fr-2023-04-14"


def _norm(w):
    import unicodedata
    w = unicodedata.normalize("NFD", w.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(ch for ch in w if unicodedata.category(ch) != "Mn"))


def asr_align(audio, texts):
    """Reconnaissance vocale française locale (sherpa-onnx) → début exact de chaque mot du script.
    Renvoie [(audio de la phrase, débuts des mots)] ou None si indisponible."""
    try:
        import difflib
        import sherpa_onnx
    except ImportError:
        return None
    m = os.path.join(ASR_DIR, ASR_MODEL)
    if not os.path.isdir(m):
        os.makedirs(ASR_DIR, exist_ok=True)
        tar = m + ".tar.bz2"
        subprocess.run(["curl", "-sSL", "-o", tar,
                        f"https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/{ASR_MODEL}.tar.bz2"], check=True)
        subprocess.run(["tar", "xjf", tar, "-C", ASR_DIR], check=True)
        os.remove(tar)
    rec = sherpa_onnx.OnlineRecognizer.from_transducer(
        tokens=f"{m}/tokens.txt", encoder=f"{m}/encoder-epoch-29-avg-9-with-averaged-model.int8.onnx",
        decoder=f"{m}/decoder-epoch-29-avg-9-with-averaged-model.onnx",
        joiner=f"{m}/joiner-epoch-29-avg-9-with-averaged-model.int8.onnx",
        num_threads=4, sample_rate=16000, feature_dim=80, decoding_method="greedy_search")
    a16 = audio[::max(1, round(SR / 16000))] if SR % 16000 == 0 else np.interp(
        np.arange(0, len(audio), SR / 16000), np.arange(len(audio)), audio).astype(np.float32)
    st = rec.create_stream()
    st.accept_waveform(16000, a16.astype(np.float32))
    st.accept_waveform(16000, np.zeros(32000, dtype=np.float32))
    st.input_finished()
    while rec.is_ready(st):
        rec.decode_stream(st)
    res = rec.get_result_all(st)
    heard, cur = [], None
    for tok, ts in zip(res.tokens, res.timestamps):
        if tok.startswith(" ") or cur is None:
            cur = [tok.strip(), ts]
            heard.append(cur)
        else:
            cur[0] += tok
    heard = [(_norm(w), t) for w, t in heard if _norm(w)]
    script_words, owner = [], []
    for n, x in enumerate(texts):
        for w in x.split():
            if _norm(w):
                script_words.append(_norm(w))
                owner.append(n)
    sm = difflib.SequenceMatcher(None, script_words, [w for w, _ in heard], autojunk=False)
    times = [None] * len(script_words)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = heard[blk.b + k][1]
    if sum(t is not None for t in times) < .6 * len(times):
        return None
    known = [k for k, t in enumerate(times) if t is not None]  # interpolation des mots non reconnus
    for k in range(len(times)):
        if times[k] is None:
            lo = max([q for q in known if q < k], default=None)
            hi = min([q for q in known if q > k], default=None)
            if lo is not None and hi is not None:
                times[k] = times[lo] + (times[hi] - times[lo]) * (k - lo) / (hi - lo)
            else:
                times[k] = times[lo] + .3 * (k - lo) if lo is not None else max(0, times[hi] - .3 * (hi - k))
    fr = int(.02 * SR)
    rms = np.sqrt(np.mean(audio[: len(audio) // fr * fr].reshape(-1, fr) ** 2, axis=1))
    voiced = rms > rms.max() * .03
    out = []
    for n in range(len(texts)):
        ks = [k for k in range(len(times)) if owner[k] == n]
        t0 = max(0.0, times[ks[0]] - .12)
        nxt = [k for k in range(len(times)) if owner[k] == n + 1]
        t1 = (times[nxt[0]] - .12) if nxt else len(audio) / SR
        # Fin de phrase = premier silence de 240 ms après le début du dernier mot.
        f, fend = int(times[ks[-1]] / .02) + 3, min(len(voiced) - 12, int(t1 / .02))
        while f < fend and voiced[f:f + 12].any():
            f += 1
        t1 = min(t1, f * .02 + .15)
        out.append((audio[int(t0 * SR):int(t1 * SR)], [times[k] - t0 for k in ks]))
    return out


def spoken_words(text, offset, st):
    """Débuts (s) des mots prononcés de text, situé à offset dans le texte envoyé (balises ignorées)."""
    out, i, prev_space = [], 0, True
    while i < len(text):
        if text[i] == "[":
            i = text.index("]", i) + 1
            prev_space = True
            continue
        ch = text[i]
        if not ch.isspace() and prev_space:
            out.append(st[offset + i])
        prev_space = ch.isspace()
        i += 1
    return out


def chunks(show):
    """Découpe le sous-titre en groupes de 2-4 mots ; couleur par mot."""
    words = []
    for tok in show.split():
        if words and re.fullmatch(r"\{?\d{3}\}?\S*", tok) and re.search(r"\d\}?$", words[-1]["w"] + ("}" if words[-1]["c"] else "")):
            words[-1]["w"] += " " + re.sub(r"[\[\]{}]", "", tok)  # « 12 000 » : milliers gardés ensemble
            continue
        if words and re.fullmatch(r"[:;?!…»]+|°C\S*|%\S*", tok):  # ponctuation française détachée : collée au mot précédent
            words[-1]["w"] += " " + tok
            continue
        color = "red" if "[" in tok else "yellow" if "{" in tok else None
        words.append({"w": re.sub(r"[\[\]{}]", "", tok), "c": color})
    groups, cur = [], []
    for wd in words:
        cur.append(wd)
        n = sum(len(x["w"]) for x in cur) + len(cur) - 1
        ends_clause = wd["w"][-1] in ",.:?!…"
        if len(cur) >= 4 or n >= 17 or (ends_clause and len(cur) >= 2) or (wd["c"] and wd["w"][-1] in ",.:?!…"):
            groups.append(cur)
            cur = []
    if cur:
        if groups and len(cur) == 1 and sum(len(x["w"]) for x in groups[-1]) < 12:
            groups[-1] += cur
        else:
            groups.append(cur)
    return groups


# Regroupe les phrases par scène et synthétise chaque bloc.
blocks = []
for i, ln in enumerate(lines):
    if not blocks or blocks[-1]["scene"] != ln["scene"]:
        blocks.append({"scene": ln["scene"], "idx": []})
    blocks[-1]["idx"].append(i)

t = LEAD
voices, tl_lines, scenes = [], [], []
GLINES = None
if PROVIDER == "draft":  # brouillon sans voix (aucune clé) : durées estimées à 15 caractères/s, pour caler l'image
    GLINES = []
    for l in lines:
        ws = TAG.sub("", l["say"]).split()
        d = max(1.0, len(" ".join(ws)) / 15)
        GLINES.append((np.zeros(int(d * SR), dtype=np.float32), [d * k / len(ws) for k in range(len(ws))]))
if PROVIDER == "gemini":
    try:
        GLINES = gemini_lines(lines)
    except Exception as e:  # quota gratuit atteint, panne… : secours ElevenLabs si une clé existe
        if not KEY:
            raise
        print(f"Gemini indisponible ({e}), secours ElevenLabs")
for bi, b in enumerate(blocks):
    if GLINES is not None:  # Gemini : phrases déjà découpées, on les enchaîne avec une courte respiration
        if bi:
            t += GAP_OUT + PAD.get(blocks[bi - 1]["scene"], 0)
        scenes.append({"id": b["scene"], "start": 0 if not scenes else t - 0.1})
        for n, i in enumerate(b["idx"]):
            seg, words = GLINES[i]
            if n:
                t += 0.15
            voices.append((t, seg))
            ls, le = t, t + len(seg) / SR
            groups = chunks(lines[i]["show"])
            n_show, k, cks = sum(len(g) for g in groups), 0, []
            for j, g in enumerate(groups):
                si = min(len(words) - 1, round(k * len(words) / n_show))
                cks.append({"start": round(ls if j == 0 else t + words[si] - 0.04, 3), "words": g})
                k += len(g)
            for x, y in zip(cks, cks[1:]):
                x["end"] = y["start"]
            cks[-1]["end"] = round(le, 3)
            tl_lines.append({"scene": b["scene"], "start": round(ls, 3), "end": round(le, 3), "chunks": cks})
            t = le
        continue
    texts = [lines[i]["say"] for i in b["idx"]]
    full = " ".join(texts)
    audio, chars, st, en = eleven(full)
    assert chars == full, f"alignement inattendu pour la scène {b['scene']}"
    # Positions de chaque phrase dans le bloc (début du 1er mot, fin du dernier caractère).
    spans, off = [], 0
    for tx in texts:
        words = spoken_words(tx, off, st)
        last = off + len(tx.rstrip()) - 1
        spans.append((words[0], en[last], words))
        off += len(tx) + 1
    if bi:
        t += GAP_OUT + PAD.get(blocks[bi - 1]["scene"], 0)
    a0 = max(0.0, spans[0][0] - 0.05)
    a1 = min(len(audio) / SR, spans[-1][1] + 0.25)
    seg = audio[int(a0 * SR):int(a1 * SR)]
    voices.append((t, seg))
    scenes.append({"id": b["scene"], "start": 0 if not scenes else t - 0.1})
    for (s0, s1, words), i in zip(spans, b["idx"]):
        ls, le = t + s0 - a0, t + s1 - a0
        groups = chunks(lines[i]["show"])
        n_show, k, cks = sum(len(g) for g in groups), 0, []
        for j, g in enumerate(groups):
            si = min(len(words) - 1, round(k * len(words) / n_show))
            cks.append({"start": round(ls if j == 0 else t + words[si] - a0 - 0.04, 3), "words": g})
            k += len(g)
        for x, y in zip(cks, cks[1:]):
            x["end"] = y["start"]
        cks[-1]["end"] = round(le, 3)
        tl_lines.append({"scene": b["scene"], "start": round(ls, 3), "end": round(le, 3), "chunks": cks})
    t += a1 - a0

total = t + PAD.get(blocks[-1]["scene"], 0)
for a, b in zip(scenes, scenes[1:]):
    a["end"] = b["start"]
scenes[-1]["end"] = total
for s in scenes:
    s["start"], s["end"] = round(s["start"], 3), round(s["end"], 3)
S = {s["id"]: s for s in scenes}

cues = {}
for name, (li, at, off) in script.get("cues", {}).items():
    cues[name] = round(tl_lines[li][at] + off, 3)
json.dump({"duration": round(total, 3), "fps": 30, "scenes": scenes, "lines": tl_lines, "cues": cues},
          open(os.path.join(OUT, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print(f"durée totale {total:.1f}s")
for s in scenes:
    print(f"  {s['id']:12s} {s['start']:6.2f} → {s['end']:6.2f}")

# --- Bande-son ------------------------------------------------------------
N = int((total + 0.5) * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(7)


def noise(n, cutoff, hp=0):
    X = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    if hp:
        X *= 1 - 1 / (1 + (f / hp) ** 4)
    y = np.fft.irfft(X, n)
    return y / (np.abs(y).max() + 1e-9)


def env(n, a, r):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def place(buf, at, sig, gain=1.0):
    i = int(at * SR)
    j = min(N, i + len(sig))
    if 0 <= i < N:
        buf[i:j] += sig[: j - i] * gain


def decay(d, k):
    x = np.arange(int(d * SR)) / SR
    return x, np.exp(-x * k)


def snd(kind, dur=1.0):
    if kind == "pop":
        x, e = decay(.09, 45)
        return np.sin(2 * np.pi * (500 + 4000 * x) * x) * e, .35
    if kind == "hit":
        x, e = decay(1.6, 2.5)
        return np.sin(2 * np.pi * (60 * np.exp(-x * 1.5) + 30) * x) * e, .7
    if kind == "knock":  # trois coups sourds contre une porte
        s = np.zeros(int(1.3 * SR))
        for k, at in enumerate((0, .32, .64)):
            x, e = decay(.18, 30)
            thump = np.sin(2 * np.pi * (95 - 30 * x) * x) * e + noise(len(x), 900, 80) * np.exp(-x * 60) * .6
            s[int(at * SR):int(at * SR) + len(x)] += thump * (1 - .1 * k)
        return s, .9
    if kind == "puff":
        n = int(.45 * SR)
        return noise(n, 1500, 200) * env(n, .05, .35), .35
    if kind == "swish":
        n = int(.5 * SR)
        return noise(n, 3000, 400) * np.sin(np.linspace(0, np.pi, n)) ** 2, .3
    if kind == "water":
        n = int(dur * SR)
        return noise(n, 2200, 300) * (0.7 + 0.3 * np.sin(np.arange(n) / SR * 37)) * env(n, .1, .5), .25
    if kind == "buzz":  # vibreur de téléphone : deux salves
        s = np.zeros(int(1.2 * SR))
        for at in (0, .55):
            n = int(.38 * SR)
            x = np.arange(n) / SR
            s[int(at * SR):int(at * SR) + n] += np.sign(np.sin(2 * np.pi * 165 * x)) * .5 * env(n, .01, .05)
        return s, .3
    raise ValueError(kind)


music = np.zeros(N)
sfx = np.zeros(N)
lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * tt)
for f, g in [(36.71, 0.5), (73.42, 0.35), (110.0, 0.18), (146.83, 0.1), (174.61, 0.07)]:
    music += g * np.sin(2 * np.pi * f * tt + np.sin(2 * np.pi * 0.11 * tt)) * lfo
music += 0.12 * noise(N, 400, 120)
music *= np.clip(tt / 2.0, 0, 1) * np.clip((total - tt) / 2.5, 0, 1)
x, e = decay(.35, 14)
beat = np.sin(2 * np.pi * 48 * x) * e
for a, b in script.get("pulse", []):
    bt = S[a]["start"]
    while bt < S[b]["end"] - .5:
        place(music, bt, beat, 0.9)
        place(music, bt + 0.28, beat, 0.55)
        bt += 1.1
music /= np.abs(music).max()

for s in scenes[1:]:  # whoosh à chaque changement de scène
    n = int(0.55 * SR)
    place(sfx, s["start"] - 0.25, noise(n, 2500, 300) * np.sin(np.linspace(0, np.pi, n)) ** 2, 0.35)
for fx in script.get("sfx", []):
    kind = fx["type"]
    if kind == "wind":
        for sid in fx["scene"]:
            a, b = S[sid]["start"], S[sid]["end"]
            n = int((b - a) * SR)
            place(sfx, a, noise(n, 500, 60) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.3 * np.arange(n) / SR)) * env(n, .5, .8), .16)
        continue
    if kind == "static":  # grésillement de radio
        a, b = cues[fx["from"]], S[fx["scene"]]["end"]
        n = int((b - a) * SR)
        place(sfx, a, noise(n, 5000, 1200) * (0.5 + 0.5 * np.abs(np.sin(np.arange(n) / SR * 3))) * env(n, .05, .3), .1)
        continue
    times = [S[fx["scene"]]["start"]] if "scene" in fx else \
        [cues[c] for c in (fx["cue"] if isinstance(fx["cue"], list) else [fx["cue"]])]
    sig, g = snd(kind, fx.get("dur", 1.0))
    for at in times:
        place(sfx, at, sig, g)

voice = np.zeros(N)
for at, a in voices:
    place(voice, at, a)
voice /= max(np.abs(voice).max(), 1e-9)
venv = np.convolve(np.abs(voice), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.45 * np.clip(venv / 0.08, 0, 1)
mix = voice * 0.9 + music * 0.16 * duck + sfx * 0.8
mix /= np.abs(mix).max() / 0.95
with wave.open(os.path.join(OUT, "audio_raw.wav"), "w") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(OUT, "audio_raw.wav"),
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", str(SR), "-ac", "2",
                os.path.join(OUT, "audio.wav")], check=True)
print("audio ok")
