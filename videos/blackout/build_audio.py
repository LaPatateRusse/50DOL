"""Voix off (Piper TTS), timeline et bande-son (musique + bruitages) de la vidéo.

Usage : python3 build_audio.py <dossier_voix> <dossier_sortie>
Produit : timeline.json (lu par le rendu) et audio.wav.
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
VOICE_DIR, OUT = sys.argv[1], sys.argv[2]
MODEL = os.path.join(VOICE_DIR, "vits-piper-fr_FR-tom-medium", "fr_FR-tom-medium.onnx")
SR = 44100
os.makedirs(os.path.join(OUT, "tts"), exist_ok=True)

script = json.load(open(os.path.join(HERE, "script.json"), encoding="utf-8"))
lines = script["lines"]

# Respirations entre scènes (s) et rallonges de fin de scène.
GAP_IN, GAP_OUT, LEAD = 0.10, 0.28, 0.35
PAD_AFTER = {"titre": 0.35, "carte": 0.2, "bain": 0.25, "co": 0.3, "fin": 3.2}


def tts(i, text):
    raw = os.path.join(OUT, "tts", f"{i:02d}_raw.wav")
    out = os.path.join(OUT, "tts", f"{i:02d}.wav")
    if not os.path.exists(out):
        subprocess.run(["python3", "-m", "piper", "-m", MODEL, "--length-scale", "0.92",
                        "--noise-scale", "0.6", "-f", raw], input=text.encode(), check=True,
                       stderr=subprocess.DEVNULL)
        sr = int(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=sample_rate", "-of", "csv=p=0", raw],
                                capture_output=True, text=True).stdout.strip())
        # Coupe les silences de début/fin, voix plus grave et compressée façon narrateur.
        af = ("silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
              "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
              f"asetrate={sr}*0.94,aresample=44100,atempo={1/0.94:.4f},"
              "highpass=f=70,equalizer=f=140:t=q:w=1:g=4,equalizer=f=3200:t=q:w=1.5:g=3,"
              "acompressor=threshold=-20dB:ratio=4:attack=5:release=80:makeup=4")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", af, "-ar", str(SR), "-ac", "1", out], check=True)
    with wave.open(out) as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    return data


def chunks(show):
    """Découpe le sous-titre en groupes de 2-4 mots ; couleur par mot."""
    words = []
    for tok in show.split():
        color = None
        if "[" in tok:
            color = "red"
        elif "{" in tok:
            color = "yellow"
        words.append({"w": tok.replace("[", "").replace("]", "").replace("{", "").replace("}", ""), "c": color})
    groups, cur = [], []
    for wd in words:
        cur.append(wd)
        n = sum(len(x["w"]) for x in cur) + len(cur) - 1
        ends_clause = wd["w"][-1] in ",.:"
        if len(cur) >= 4 or n >= 17 or (ends_clause and len(cur) >= 2) or wd["c"]:
            groups.append(cur)
            cur = []
    if cur:
        if groups and len(cur) == 1 and sum(len(x["w"]) for x in groups[-1]) < 12:
            groups[-1] += cur
        else:
            groups.append(cur)
    return groups


# --- Timeline -------------------------------------------------------------
t = LEAD
voices, tl_lines, scenes = [], [], []
prev_scene = None
for i, ln in enumerate(lines):
    audio = tts(i, ln["say"])
    if prev_scene is not None:
        t += GAP_IN if ln["scene"] == prev_scene else GAP_OUT + PAD_AFTER.get(prev_scene, 0)
    if ln["scene"] != prev_scene:
        scenes.append({"id": ln["scene"], "start": 0 if not scenes else t - 0.12})
    dur = len(audio) / SR
    groups = chunks(ln["show"])
    weights = [sum(len(x["w"]) for x in g) + 2 for g in groups]
    acc, cks = t, []
    for g, wgt in zip(groups, weights):
        d = dur * wgt / sum(weights)
        cks.append({"start": round(acc, 3), "end": round(acc + d, 3), "words": g})
        acc += d
    tl_lines.append({"scene": ln["scene"], "start": round(t, 3), "end": round(t + dur, 3), "chunks": cks})
    voices.append((t, audio))
    t += dur
    prev_scene = ln["scene"]
total = t + PAD_AFTER.get(prev_scene, 0)
for a, b in zip(scenes, scenes[1:]):
    a["end"] = b["start"]
scenes[-1]["end"] = total
for s in scenes:
    s["start"], s["end"] = round(s["start"], 3), round(s["end"], 3)

L = lambda i: tl_lines[i]
S = {s["id"]: s for s in scenes}
cues = {
    "lightsOff": S["intro"]["start"] + 0.0,          # tremblement des lumières dans l'appart
    "intro_blackout": L(0)["end"] - 0.55,
    "map_wave": S["carte"]["start"] + 0.25,
    "max_label": L(4)["start"] - 0.1,
    "pump_stop": L(5)["end"] - 0.9,
    "timer_on": L(6)["start"],
    "water_pops": [round(L(8)["start"] + k * (L(9)["start"] + 0.3 - L(8)["start"]) / 6, 3) for k in range(1, 7)],
    "bottles": [round(L(10)["start"] + 0.3 + k * 0.32, 3) for k in range(6)],
    "thermo_on": L(11)["start"] + 0.2,
    "blanket": L(13)["start"] + 1.9,
    "towel": L(13)["end"] - 1.6,
    "co_fill": L(14)["start"] + 2.0,
    "skull": L(16)["start"] + 0.75,
    "candle": L(17)["end"] - 0.9,
    "rings": L(18)["start"] + 2.2,
    "jour2": L(19)["end"] + 0.5,
}
cues = {k: (round(v, 3) if isinstance(v, float) else v) for k, v in cues.items()}
json.dump({"duration": round(total, 3), "fps": 30, "scenes": scenes, "lines": tl_lines, "cues": cues},
          open(os.path.join(OUT, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print(f"durée totale {total:.1f}s")
for s in scenes:
    print(f"  {s['id']:12s} {s['start']:6.2f} → {s['end']:6.2f}")

# --- Bande-son ------------------------------------------------------------
N = int((total + 0.5) * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(7)


def lowpass_noise(n, cutoff, hp=0):
    x = rng.standard_normal(n)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    if hp:
        X *= 1 - 1 / (1 + (f / hp) ** 4)
    y = np.fft.irfft(X, n)
    return y / (np.abs(y).max() + 1e-9)


def env(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def place(buf, at, sig, gain=1.0):
    i = int(at * SR)
    j = min(N, i + len(sig))
    if i < N:
        buf[i:j] += sig[: j - i] * gain


music = np.zeros(N)
sfx = np.zeros(N)

# Nappe sombre (ré mineur) + pulsation de tension.
lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * tt)
for f, g in [(36.71, 0.5), (73.42, 0.35), (110.0, 0.18), (146.83, 0.1), (174.61, 0.07)]:
    music += g * np.sin(2 * np.pi * f * tt + np.sin(2 * np.pi * 0.11 * tt)) * lfo
music += 0.12 * lowpass_noise(N, 400, 120)
music *= np.clip(tt / 2.0, 0, 1)
beat = np.exp(-np.arange(int(0.35 * SR)) / SR * 14) * np.sin(2 * np.pi * 48 * np.arange(int(0.35 * SR)) / SR)
bt = S["immeuble"]["start"]
while bt < total - 3:
    place(music, bt, beat, 0.9)
    place(music, bt + 0.28, beat, 0.55)
    bt += 1.25 if bt < S["nuit"]["start"] else 0.9
fade = np.clip((total - tt) / 2.5, 0, 1)
music *= fade
music /= np.abs(music).max()

# Whoosh à chaque changement de scène.
for s in scenes[1:]:
    n = int(0.55 * SR)
    w = lowpass_noise(n, 2500, 300) * np.sin(np.linspace(0, np.pi, n)) ** 2
    place(sfx, s["start"] - 0.25, w, 0.35)

pop_n = int(0.09 * SR)
pt = np.arange(pop_n) / SR
pop = np.sin(2 * np.pi * (500 + 4000 * pt) * pt) * np.exp(-pt * 45)
for c in cues["water_pops"] + cues["bottles"]:
    place(sfx, c, pop, 0.35)
for c in (cues["max_label"], cues["thermo_on"], cues["timer_on"], cues["skull"], cues["rings"]):
    place(sfx, c, pop, 0.4)

# Coupure de courant : bourdonnement qui s'effondre + clac.
def power_down(d=1.3):
    n = int(d * SR)
    x = np.arange(n) / SR
    f = 100 * np.exp(-x * 2.2) + 20
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = (np.sign(np.sin(ph)) * 0.5 + np.sin(ph * 2) * 0.5) * np.exp(-x * 1.8)
    clack = lowpass_noise(int(0.05 * SR), 3000) * np.exp(-np.arange(int(0.05 * SR)) / SR * 80)
    s[: len(clack)] += clack * 1.5
    return s

place(sfx, cues["intro_blackout"], power_down(), 0.35)
place(sfx, cues["map_wave"], power_down(1.6), 0.3)
place(sfx, cues["pump_stop"], power_down(1.0), 0.3)

# Tic-tac du compte à rebours.
tick_n = int(0.03 * SR)
tick = lowpass_noise(tick_n, 6000, 1500) * np.exp(-np.arange(tick_n) / SR * 150)
tt0 = cues["timer_on"]
while tt0 < S["infographie"]["start"]:
    place(sfx, tt0, tick, 0.22)
    tt0 += 0.5

# Eau qui coule (bain), vent (scènes extérieures), allumette (bougie).
b0, b1 = S["bain"]["start"], S["bain"]["end"]
place(sfx, b0, lowpass_noise(int((b1 - b0) * SR), 1800, 400) * env(int((b1 - b0) * SR), 0.4, 0.6), 0.12)
for sid in ("titre", "nuit", "fin"):
    a, b = S[sid]["start"], S[sid]["end"]
    n = int((b - a) * SR)
    wind = lowpass_noise(n, 500, 60) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.3 * np.arange(n) / SR)) * env(n, 0.5, 0.8)
    place(sfx, a, wind, 0.16)
m_n = int(0.6 * SR)
match = lowpass_noise(m_n, 5000, 800) * np.exp(-np.arange(m_n) / SR * 6)
place(sfx, cues["candle"], match, 0.3)

# Impact grave sur la révélation finale.
hit_n = int(1.6 * SR)
hx = np.arange(hit_n) / SR
hit = np.sin(2 * np.pi * (60 * np.exp(-hx * 1.5) + 30) * hx) * np.exp(-hx * 2.5)
place(sfx, cues["jour2"], hit, 0.8)
place(sfx, S["titre"]["start"], hit, 0.6)

voice = np.zeros(N)
for at, a in voices:
    place(voice, at, a)
voice /= np.abs(voice).max()

# Ducking de la musique sous la voix.
venv = np.convolve(np.abs(voice), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.45 * np.clip(venv / 0.08, 0, 1)
mix = voice * 0.9 + music * 0.16 * duck + sfx * 0.8
mix /= np.abs(mix).max() / 0.95
pcm = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(OUT, "audio_raw.wav"), "w") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(OUT, "audio_raw.wav"),
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", str(SR), "-ac", "2",
                os.path.join(OUT, "audio.wav")], check=True)
print("audio ok")
