# Vidéos « survie »

Style : `docs/style-video-survie.md`.

- `engine/` : moteur commun (Max, décors, HUD, sous-titres, rendu, voix ElevenLabs, bruitages)
- `blackout-jour2/` (et suivants) : un dossier par épisode avec `script.json` (texte, repères, bruitages) et `scenes.js` (scènes)
- `blackout/` : épisode 1, version autonome antérieure au moteur

Chaque dossier d'épisode contient toujours :
- `tiktok.mp4` : la vidéo prête à poster
- `descriptions.txt` : 3 descriptions TikTok au choix (question, liste, suspense) avec hashtags

Fabriquer un épisode :

```bash
export ELEVEN_KEY=...            # ne jamais commiter la clé
python3 engine/build_audio.py blackout-jour2 .build/jour2
node engine/render.js blackout-jour2 .build/jour2 --check    # vérifie toutes les images
node engine/render.js blackout-jour2 .build/jour2
ffmpeg -f concat -safe 0 -i .build/jour2/segs.txt -i .build/jour2/audio.wav -c:v copy -c:a aac -shortest blackout-jour2/tiktok.mp4
```
