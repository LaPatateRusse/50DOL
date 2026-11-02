# Document de reprise — à coller dans un nouveau chat

> Dernière mise à jour : 2026-11-02 (après publication du Jour 3).
> Colle tout ce document dans un nouveau chat Claude Code ouvert sur le dépôt `LaPatateRusse/50DOL` (branche `claude/tech-services-dashboard-dj8dG`), puis écris : « Reprends à partir de ce document. »

## Qui / quoi

- Utilisateur : Jules (julessoyer@gmail.com), répond en français, veut que tout soit fait automatiquement.
- Projet : série TikTok **« Blackout général »** (vidéos verticales de survie, style « Et si… »), publiée sur **@etsi_scenario** via **Buffer**.
- Le dépôt contient aussi un ancien projet sans rapport (site Next.js « TechAssist ») : ne pas y toucher.

## Où sont les choses

| Chemin | Rôle |
|---|---|
| `docs/style-video-survie.md` | Bible de style (personnage Max, palette, sous-titres, HUD, structure narrative, livraison) |
| `docs/automatisation.md` | Procédure quotidienne de fabrication + publication |
| `videos/serie.json` | État de la série : épisodes publiés, fin de chaque épisode, choix posé au public, ids Buffer |
| `videos/engine/` | Moteur commun : `engine.js` (Max, décors, HUD, sous-titres), `props.js` (accessoires), `render.html`, `render.js` (rendu Chromium → ffmpeg), `build_audio.py` (voix ElevenLabs + bruitages) |
| `videos/blackout/` | Jour 1 (version autonome antérieure au moteur) |
| `videos/blackout-jour2/`, `videos/blackout-jour3/` | Un dossier par épisode : `script.json`, `scenes.js`, `tiktok.mp4`, `descriptions.txt` |
| `videos/.build/` | Fichiers temporaires (ignorés par git) |

## Fabriquer un épisode

```bash
cd videos
export ELEVEN_KEY=...   # variable d'environnement ; ne jamais commiter la clé
python3 engine/build_audio.py blackout-jourN .build/jourN
node engine/render.js blackout-jourN .build/jourN --check
node engine/render.js blackout-jourN .build/jourN --stills 5,20,40   # images de contrôle à relire
node engine/render.js blackout-jourN .build/jourN
ffmpeg -f concat -safe 0 -i .build/jourN/segs.txt -i .build/jourN/audio.wav -c:v copy -c:a aac -shortest blackout-jourN/tiktok.mp4
```

- Voix : Gemini TTS gratuit si `GEMINI_API_KEY` est défini (clé AI Studio dans un projet SANS facturation ; une requête par vidéo, secours ElevenLabs automatique ; voix « Orus » pour survie et Et si…, « Charon » pour l'horreur via `voice.gemini_voice`), sinon ElevenLabs, modèle `eleven_v3`, voix **Adam** (`pNInz6obpgDQGcFmaJgB`), générée scène par scène, balises `[whispers]`, `[serious]`, `[sighs]`. La clé n'a pas la permission `voices_read`.
- Sous-titres : `[mot]` = rouge (danger), `{mot}` = jaune (ressource), calés sur l'horodatage ElevenLabs.
- Livraison : chaque dossier contient `tiktok.mp4` + `descriptions.txt` (3 descriptions : question, liste, suspense).
- Réseau : `api.elevenlabs.io` et `api.buffer.com` autorisés ; TikTok non accessible.

## Publication (Buffer)

- Connecteur Buffer : organisation `6ae857cdecb73df5e4545083`, chaîne TikTok `6ae85bb5e29c69a1713612e1` (@etsi_scenario), fuseau Europe/Paris.
- Vidéo envoyée via l'URL publique : `https://raw.githubusercontent.com/LaPatateRusse/50DOL/claude/tech-services-dashboard-dj8dG/videos/<dossier>/tiktok.mp4` (le dépôt est public, il faut donc pousser avant de publier).
- `create_post` : `customScheduled` à 09:05, description n°1, `metadata.tiktok.isAiGenerated: true`.
- Buffer ne fournit pas le texte des commentaires (seulement leur nombre). L'utilisateur donne le résultat des votes (« OUI » / « NON ») dans le chat avant 8 h 30 ; sinon Max fait le choix le plus prudent, sans inventer de vote.

## Automatisation

- Tâche programmée **« Épisode TikTok quotidien — Blackout général »** (`trig_01J7u5zn3rs1CeJXLkzJLkbA`), tous les jours à **08:31 Europe/Paris**, rattachée à l'ancienne session `session_01PqzQssP7MpuaAhZ7vR1vhe`.
- **Dans un nouveau chat** : désactiver l'ancienne tâche (update_trigger enabled=false) puis en recréer une identique rattachée au nouveau chat, sinon les épisodes continuent dans l'ancien chat.

## Histoire jusqu'ici

1. **Jour 1** (publié le 30/10) : blackout en plein hiver. Max remplit la baignoire (180 L), se réfugie dans la plus petite pièce, erreur des voisins = barbecue/groupe électrogène à l'intérieur (monoxyde de carbone). Fin : sa bougie est la seule fenêtre allumée de la ville.
2. **Jour 2** (publié le 31/10) : 3 h du matin, on frappe ; on n'ouvre pas ; lampe frontale et rideaux ; batterie (mode avion), radio à piles ; congélateur 48 h / frigo 4 h ; chasse d'eau avec un seau (réserve 168 L). Fin : message du voisin du 5e « Je sais que tu as de l'eau. Ouvre-moi. »
3. **Jour 3** (publié le 02/11, post Buffer `6ae85ec1bc7258b27b3cfeb8`) : le voisin a entendu la baignoire via les tuyaux ; on parle sans ouvrir ; Max pose un bidon de 10 L sur le palier (réserve 158 L) ; Kobe 1995 : la plupart des survivants sauvés par leurs voisins ; viande décongelée tiède depuis 2 h = poubelle ; conserves froides ; radio : distribution d'eau au gymnase à 2 km. Fin : le bidon a disparu, un mot dit « Merci. Mais fais attention… ils t'attendent en bas. »
   - **Choix posé au public** : Max sort-il chercher de l'eau au gymnase ? (OUI / NON)

## Autre série : « Les règles de la nuit » (horreur)

- État détaillé : `videos/horreur.json` ; style : `docs/style-horreur.md` ; accessoires : `videos/engine/horreur.js`.
- `videos/nuit-mamie/` : **Ne réponds pas — Partie 1**, publiée le 02/11 à 12:30.
- `videos/nuit-mamie-2/` : **Partie 2**, programmée le 02/11 à 21:30 (fin : appel de « Mamie » depuis son téléphone resté dans la cuisine, tenu par des doigts gris ; choix « Tu décroches ? »). La Partie 3 conclut l'histoire.
- Style différent du Blackout : bleu nuit, formes plates sans contours, personnage « toi » (tête noire ronde, deux yeux blancs, sweat orange), créature « le Copieur » (grand, maigre, gris, yeux jaunes), HUD lieu + horodatage `03:00:SS` (Roboto Mono), sous-titres en haut (Montserrat 900, mot rouge `#FF4B4B`) via `EP.subs`.
- Histoire : chez Mamie à la campagne, 3 h du matin ; SMS « Si tu m'entends t'appeler depuis le jardin… ne réponds pas » ; voix de Mamie sous la fenêtre ; créature dans le jardin ; SMS « Ce n'est pas moi. Il copie les voix. » ; la porte d'entrée grince. Choix posé : « Tu aurais répondu ? OUI / NON ».

## Planning automatique

- 09:05 survie (tâche 08:31 `trig_01J7u5zn3rs1CeJXLkzJLkbA`) : Blackout jusqu'au Jour 5 = conclusion, puis nouvelle série de survie de 5 épisodes.
- 18:00 « Et si… ? » (tâche 14:47 `trig_01KMDU1Xf47e9nvmw13qWeTA`) : vidéo unique scientifique, style `docs/style-etsi.md`, état `videos/etsi.json`.
- 12:00 et 21:30 horreur (tâches 11:13 `trig_01FQT8pfNGWeVMQvgcEGRwNy` et 20:43 `trig_01TVdCcFBnasaoaTh94P1j9g`), mini-séries de 3-4 parties.
- Dans un nouveau chat : désactiver ces 4 tâches et les recréer rattachées au nouveau chat.
- Voir `docs/automatisation.md`.

## Programmé le 03/11 (fait à l'avance le 02/11)

- 09:05 Blackout Jour 4 (`videos/blackout-jour4`) · 12:00 Ne réponds pas Partie 3, FIN (`videos/nuit-mamie-3`) · 18:00 Et si ton compte doublait — P1 (`videos/etsi-compte-double-1`, mini-série) · 21:30 L'ascenseur du 13e — P1 (`videos/ascenseur-13-1`).
- Voix Gemini + alignement des sous-titres par reconnaissance vocale locale (sherpa-onnx, modèle français téléchargé auto dans `videos/.build/asr`).

- Avatar du compte : `videos/avatar/avatar.png` (Max lumineux, fond jaune-orangé, bulle « ? »).
- 18:00 à partir du 05/11 : histoires de super-pouvoirs longues (2 min 30-3 min), voir `docs/style-etsi.md`.

## Prochaine étape

- 02/11 : premier « Et si… ? » (traverser la Terre, voix Gemini Orus) programmé à 18:00, « Ne réponds pas » Partie 2 à 21:30.
- 03/11 : Blackout Jour 4 à 09:05, Ne réponds pas Partie 3 (fin) à 12:00, nouvelle histoire Partie 1 à 21:30.
