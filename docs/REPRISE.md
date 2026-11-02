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

- Voix : ElevenLabs, modèle `eleven_v3`, voix **Adam** (`pNInz6obpgDQGcFmaJgB`), générée scène par scène, balises `[whispers]`, `[serious]`, `[sighs]`. La clé n'a pas la permission `voices_read`.
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

## Prochaine étape

- Jour 4 prévu le 03/11 à 09:05.
