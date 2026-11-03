# Brief à coller dans un nouveau chat Claude : vidéos TikTok « style cinéma »

> Colle tout ce fichier dans un nouveau chat Claude Code ouvert sur le dépôt **`LaPatateRusse/50DOL`**, branche **`claude/tech-services-dashboard-dj8dG`**, puis écris par exemple : « Fais une nouvelle histoire en 5 parties dans ce style. »
> La clé de voix Gemini se donne dans le chat (variable `GEMINI_API_KEY`) et ne doit **jamais** être écrite dans le dépôt.

---

## 1. Le style en une phrase

Un **mini-film d'animation 16:9 au centre d'une vidéo verticale**. Il raconte une histoire à la 2e personne (« tu ») autour d'une **règle magique chiffrée**, avec un **compteur** à l'écran. Les personnages sont des silhouettes à tête noire ronde et yeux blancs, la lumière est quasi réaliste, il y a beaucoup de plans courts et il n'y a **aucun sous-titre**. Chaque partie se termine sur un **cliffhanger**.

Exemple complet (5 parties, publié) : `videos/cinema-mensonge-1` à `videos/cinema-mensonge-5`, arc dans `videos/cinema-mensonge.json`.

## 2. Image

| Élément | Règle |
|---|---|
| Format | Vidéo 1080 × 1920, 30 i/s. Film 16:9 (1080 × 608) centré verticalement (y = 656 → 1264), bandes noires au-dessus et en dessous. |
| Titre | « Partie N » en blanc, Montserrat 700, 64 px, centré 100 px au-dessus du film. |
| HUD (dans le film) | En haut à gauche : `JOUR` (blanc, Montserrat 800) + numéro en jaune `#F5B82E`. En haut à droite : le compteur (Montserrat 900, jaune si positif, rouge `#FF3B30` si négatif, il grossit à chaque changement). En dessous, en petit : un 2e indicateur avec une icône (ex. ♥ 3 = personnes qui se souviennent de toi), qui clignote en rouge quand il change. |
| Sous-titres | **Aucun.** Le texte n'apparaît que dans le décor : écran de téléphone (appli bancaire, notifications, SMS), carnet, dos de photo, réveil, panneau. |
| Héros | Tête noire ronde avec liseré de lumière bleutée, 2 yeux blancs expressifs, sweat jaune-orange `#F2A31B`, pantalon sombre, mains en gants noirs. |
| Autres personnages | Même famille de silhouettes. Ce qui les distingue : la couleur du haut, la coiffure ou le chapeau, les lunettes. Ex. : mère `#B5446E` chignon brun, grand-mère violet `#7A6AA8` chignon blanc et lunettes dorées, inconnu manteau gris `#6E717D` chapeau noir à ruban rouge. |
| Lumière | Décors sombres et désaturés, **une source de lumière par plan** (lampadaire, néon, lampe, lune, écran), cônes de lumière, liseré chaud sur les bords des corps, ombre en dégradé, halo lumineux, grain de film, vignette forte. Flat design sans contours noirs. |
| Montage | **Un plan toutes les 1 à 3 s**, coupes franches. Alterner plan large, plan par-dessus l'épaule (personnage flou au premier plan), gros plan visage, gros plan objet (main, téléphone, pièce, horloge, photo). |
| Mouvement | **Aucun plan figé** : caméra à l'épaule, lent travelling avant, respiration, clignements d'yeux, bouche qui bouge pendant les répliques, bras qui gesticulent, pluie, vapeur, balancier d'horloge, téléphone qui vibre. |
| Fin de partie | Coupure sur le suspense, puis carton « À SUIVRE… / PARTIE N+1 » + question au public (« Tu sors ? »). La dernière partie se termine par « FIN » + une question ouverte. |

## 3. Son

- **Voix off** : Gemini TTS, voix **« Orus »** (narrateur masculin grave et posé). À défaut : ElevenLabs `eleven_v3`, voix Adam.
- Consigne de jeu (`voice.gemini_style` dans `script.json`) :
  > Lis ce texte en français, comme un conteur de mini-film d'animation sur TikTok : voix masculine grave et posée, phrases courtes, rythme vif mais avec de vraies pauses dramatiques sur les points de suspension. Ton émouvant et mystérieux. Les répliques entre guillemets « » sont jouées (préciser la voix de chaque personnage). Marque une courte pause entre chaque paragraphe. Ne lis pas cette consigne.
- Musique d'ambiance grave générée, « whoosh » à chaque changement de scène, bruitages sur les événements (`pop` gain, `buzz` téléphone, `knock` porte, `hit` révélation, `swish`, `puff`).

## 4. Écriture

- Phrases très courtes, au présent, à la 2e personne. Répliques des personnages entre « ». Beaucoup de « … » pour les pauses.
- 1 min 20 à 2 min par partie (plus d'une minute pour la monétisation TikTok). Histoires de **3 à 5 parties**.
- **Recette d'une partie** :
  1. Accroche (0-10 s) : situation banale et un peu triste, chiffre au compteur.
  2. Le pacte ou la complication (10-25 s) : une règle magique **simple et chiffrée**.
  3. Ça marche (25-50 s) : petites scènes du quotidien, le compteur bouge.
  4. Le prix caché (50-75 s) : le 2e indicateur bouge, le héros comprend.
  5. Le piège (75-90 s) : une conséquence forte, puis le cliffhanger (message d'un numéro inconnu, coup à la porte, silhouette sous un lampadaire…).
- Les jours s'enchaînent (« Jour un… Jour deux… »), le HUD `JOUR` suit la voix.
- Une émotion vraie au cœur de l'histoire (famille, honte, amitié) et une fin qui boucle avec le début.
- **Toujours une histoire originale**, ne jamais reprendre l'intrigue d'une vidéo existante.
- Idées de règles : chaque nuit ton compte ×10 (y compris les dettes) ; chaque pas te fait gagner 1 minute de vie ; chaque like reçu = 1 € mais tu perds 1 souvenir ; chaque porte que tu ouvres te téléporte au hasard ; tu entends le prix de ce que pensent les gens ; chaque excuse sincère rajeunit quelqu'un d'un an.

## 5. Fichiers du moteur (déjà dans le dépôt)

| Fichier | Rôle |
|---|---|
| `videos/engine/cinema.js` | Cadre 16:9 `stage()`, caméra `cam2()` / `push()`, lumières `cone()` / `lamp()`, décors (`streetNight`, `kitchenNight`, `bedroomNight`, `hallDay`), téléphone `phoneBig` + écrans `scrBank` / `scrMsg` / `scrCall` / `notifBanner`, HUD `cinemaHud()`, carton de fin `cinemaEnd()` |
| `videos/engine/cinema-rig.js` | Personnage articulé `rig()` (poses `stand` / `walk` / `run` / `sit` / `kneel`, bras `armF` / `armB`, objet en main `holdF`, coiffure `hair`, `talk`, expressions), gros plan `bust()`, yeux et bouche `eyes()`, images clés `kf()`, découpage en plans `shots()`, flou de profondeur `blurred()`, post-traitement `film()` (halo + grain), `phoneHeld()`, `coin()`, `wallpaper()`, `plant()`, `frame()` |
| `videos/engine/mensonge-kit.js` | Kit de la série exemple (objet `MK`) : coiffures, salon de grand-mère, façade de maison, train, photo sépia, rue la nuit… à réutiliser ou copier pour un nouveau kit |
| `videos/engine/build_audio.py` | Voix + `timeline.json` + bande-son (`TTS_PROVIDER=draft` = brouillon muet sans clé) |
| `videos/engine/render.js` | Rendu Chromium → ffmpeg (`--check`, `--stills t1,t2`) |
| `docs/style-cinema.md` | Guide détaillé du format |

## 6. Structure d'un épisode

`videos/<histoire>-N/` contient : `script.json`, `scenes.js`, `tiktok.mp4`, `descriptions.txt` (3 descriptions : question, liste, suspense, avec hashtags).

`script.json` :
```json
{
 "title": "Mon histoire — Partie 1",
 "voice": {"model": "eleven_v3", "voice_id": "pNInz6obpgDQGcFmaJgB", "stability": 0.5, "tempo": 1.0,
           "gemini_voice": "Orus", "gemini_style": "…consigne de jeu…"},
 "pad_after": {"scene1": 0.2, "fin": 3.4},
 "lines": [ {"scene": "scene1", "say": "Texte lu.", "show": "Texte lu."} ],
 "cues": {"buzz": [3, "start", 0.2], "endcard": [12, "end", 0.6]},
 "sfx": [{"type": "buzz", "cue": "buzz"}, {"type": "hit", "cue": "endcard"}],
 "pulse": [["scene3", "fin"]]
}
```
Les phrases consécutives d'une même `scene` forment une scène. Un cue `[ligne, "start"|"end", décalage]` donne un instant (accessible dans `CUE.nom`).

`scenes.js` (squelette) :
```js
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i), at = (i, k) => L(i) + D(i) * k;
function hud(c, gt) { cinemaHud(c, gt, { part: 'Partie 1', off: gt > CUE.endcard, day: 1, val: '3 €', sub: '3', subIcon: heartIcon }); }
SC.scene1 = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'large'], [at(0, .5), 'visage']]);
  film(c, gt, p => {
    if (shot === 'large') { p.save(); cam2(p, 960, 600, push(st, 1.25, 1.32, 4)); streetNight(p, gt, { lampX: 1080 });
      rig(p, { x: 900, y: 835, s: .6, f: 1, t: gt, pose: 'walk', walk: gt * 7, e: 'sad' }); p.restore(); }
    else bust(p, 960, 580, 230, { t: gt, e: 'wide', talk: talking(gt, L(0), E(0)), light: -1 });
  });
};
SC.fin = (c, lt, gt) => { film(c, gt, p => { /* … */ }); cinemaEnd(c, gt, CUE.endcard, 'PARTIE 2', 'Tu aurais fait quoi ?'); };
```

## 7. Fabrication

```bash
cd videos
TTS_PROVIDER=draft python3 engine/build_audio.py <dossier> .build/<x>      # brouillon muet pour caler l'image
node engine/render.js <dossier> .build/<x> --check
node engine/render.js <dossier> .build/<x> --stills 2,10,20,40,60         # images à relire avant le rendu final
GEMINI_API_KEY=… python3 engine/build_audio.py <dossier> .build/<x>        # vraie voix (Orus)
node engine/render.js <dossier> .build/<x>
ffmpeg -f concat -safe 0 -i .build/<x>/segs.txt -i .build/<x>/audio.wav -c:v libx264 -crf 23 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest <dossier>/tiktok.mp4
```
- Vérifier que la voix tombe sur les bons plans (débit de 9 à 24 caractères/s par phrase dans `timeline.json` ; reconnaissance vocale sherpa-onnx déjà intégrée).
- Relire une planche d'images de contrôle avant chaque rendu final.

## 8. Publication (Buffer → TikTok @etsi_scenario)

- Commit + push d'abord : la vidéo est envoyée via `https://raw.githubusercontent.com/LaPatateRusse/50DOL/claude/tech-services-dashboard-dj8dG/videos/<dossier>/tiktok.mp4?v=1`.
- Connecteur Buffer : organisation `6ae857cdecb73df5e4545083`, chaîne TikTok `6ae85bb5e29c69a1713612e1`, fuseau Europe/Paris.
- `create_post` : `schedulingType: automatic`, `mode: customScheduled` + `dueAt` (ou `shareNow`), description n° 1 de `descriptions.txt`, `metadata.tiktok.isAiGenerated: true`.
- Créneaux déjà utilisés par d'autres séries : 09:05, 12:00, 18:00, 21:30. Éviter les doublons.
- Noter chaque partie publiée dans un fichier d'état (ex. `videos/<histoire>.json`) et dans `docs/REPRISE.md`.
