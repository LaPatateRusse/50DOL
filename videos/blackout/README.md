# Blackout général — Jour 1

Short vertical 1080×1920 (68 s) dans le style de `docs/style-video-survie.md`.

- `script.json` : voix off (`say`) et sous-titres (`show`, `[rouge]`, `{jaune}`)
- `build_audio.py` : voix Piper (fr_FR-tom-medium), timeline, musique et bruitages → `timeline.json`, `audio.wav`
- `render.html` : tous les décors, Max, HUD et sous-titres dessinés en canvas, image par image
- `render.js` : rendu Chromium headless → ffmpeg

```bash
python3 build_audio.py <dossier_voix> build
node render.js build
ffmpeg -f concat -safe 0 -i build/segs.txt -i build/audio.wav -c:v copy -c:a aac -shortest blackout-jour1.mp4
```
