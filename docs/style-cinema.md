# Format « cinéma » — mini-films d'animation en plusieurs parties

Style copié d'une vidéo de référence (mini-série d'animation, ~2 min par partie) : un film 16:9 au milieu de la vidéo verticale,
une règle magique avec un compteur, et une voix off à la 2e personne. Kit : `videos/engine/cinema.js`. Exemple : `videos/cinema-mensonge-1/`.

## Ce qui fait le style (analyse de la référence)

| Élément | Référence | Chez nous |
|---|---|---|
| Cadre | Film 16:9 centré dans le 9:16, grosses bandes noires haut et bas | `stage()` : bande 1080 × 608 à y = 656, scènes dessinées en 1920 × 1080 |
| Titre | « Part2 » en blanc, centré au-dessus du film | `cinemaHud({ part: 'Partie N' })` (Montserrat 700, 64 px) |
| HUD | En haut à gauche « JOUR 0 » (chiffre jaune) ; en haut à droite le compteur (rouge si négatif, jaune sinon) ; dessous un repère fixe en petit (baguette 1,30 €) | `cinemaHud` : `day`, `val`, `neg`, `sub` + `subIcon`, `bump` (le compteur grossit quand il change), `hit` (le repère clignote en rouge) |
| Sous-titres | **Aucun** : le texte n'apparaît que dans le décor (écran de téléphone, panneau, buée sur une vitre, réveil) | `EP.hideSubs = () => true` ; écrans : `phoneBig` + `scrBank`, `scrMsg`, `scrCall`, `notifBanner` |
| Personnages | Têtes rondes noires, yeux blancs expressifs, liseré de lumière bleue, sweat jaune-orange, mains en gants noirs | `hero()` (plan large), `face()` (gros plan : `e: 'n' / 'wide' / 'happy' / 'sad' / 'angry' / 'side'`, `sweat`, `mouth`), `npc()`, `stranger()`, `hand()` |
| Image | Décors sombres et désaturés, une source de lumière par plan (néon, lampe, lune), vignette forte, flat design sans contours | `cone()`, `lamp()`, `glow()`, vignette auto dans `stage()` ; décors `streetNight`, `kitchenNight` (`day: true`), `bedroomNight`, `hallDay` |
| Montage | Coupes franches toutes les 2-4 s, alternance plan large / gros plan visage / gros plan objet (main, téléphone, horloge, réveil), lent travelling avant | `EP.cinema = true` (coupe sans zoom), `cam2()` + `push(lt)` |
| Voix | Narrateur masculin posé, « tu », phrases très courtes, répliques des personnages jouées entre guillemets | Gemini « Orus » avec `gemini_style` du script pilote |
| Fin | Coupure sèche sur un cliffhanger, la suite dans la partie suivante | `cinemaEnd()` : « À SUIVRE… / PARTIE N+1 » + question |

## Recette d'une histoire

1. **Accroche (0-10 s)** : situation banale et un peu triste, chiffre au compteur (« Sur ton compte : 3 euros »).
2. **Le pacte (10-25 s)** : un inconnu étrange énonce **une règle magique simple, chiffrée** (« chaque mensonge te rapportera 100 € »), puis disparaît.
3. **Ça marche (25-50 s)** : premières utilisations, petites scènes du quotidien drôles, le compteur grimpe (pop + son à chaque gain).
4. **Le prix caché (50-75 s)** : le 2e chiffre du HUD bouge, le héros comprend la vraie règle. Visages en gros plan.
5. **Le piège (75-90 s)** : il refait l'erreur sans réfléchir, conséquence forte, puis cliffhanger (message, appel, personnage qui réapparaît).
6. **Fin** : « À suivre — Partie N+1 » + question au public.

- 1 min 20 à 2 min par partie, 2 à 4 parties par histoire, toujours une **règle chiffrée + un compteur** qui donne envie de voir la suite.
- Les jours s'enchaînent (« Jour un… Jour deux… ») : le HUD `JOUR` change en même temps que la voix.
- Idées de règles : chaque mensonge = +100 € mais quelqu'un t'oublie ; chaque nuit ton compte ×10 (y compris les dettes) ; chaque pas te fait gagner 1 minute de vie ; chaque like reçu = 1 € mais tu perds 1 souvenir ; chaque porte que tu ouvres te téléporte au hasard ; tu entends le prix de tout ce que pensent les gens. **Toujours une histoire originale**, ne jamais reprendre l'intrigue d'une vidéo existante.

## Fabrication

```bash
cd videos
TTS_PROVIDER=draft python3 engine/build_audio.py <dossier> .build/<x>   # brouillon muet pour caler l'image (sans clé)
GEMINI_API_KEY=... ELEVEN_KEY=... python3 engine/build_audio.py <dossier> .build/<x>   # vraie voix
node engine/render.js <dossier> .build/<x> --check
node engine/render.js <dossier> .build/<x> --stills 5,20,40
node engine/render.js <dossier> .build/<x>
ffmpeg -f concat -safe 0 -i .build/<x>/segs.txt -i .build/<x>/audio.wav -c:v copy -c:a aac -shortest <dossier>/tiktok.mp4
```
