"""Voix off ElevenLabs, timeline et bande-son d'un épisode.

Usage : ELEVEN_KEY=... python3 build_audio.py <dossier_episode> <dossier_build>
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
import urllib.request
import wave

import numpy as np

EP, OUT = sys.argv[1], sys.argv[2]
SR = 44100
KEY = os.environ["ELEVEN_KEY"]
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
        if words and re.fullmatch(r"[:;?!…»]+", tok):  # ponctuation française détachée : collée au mot précédent
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
for bi, b in enumerate(blocks):
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
voice /= np.abs(voice).max()
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
