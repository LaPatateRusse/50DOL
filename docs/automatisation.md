# Production automatique quotidienne

Chaque jour à 08:31 (heure de Paris), une tâche programmée lance la fabrication de l'épisode suivant, publié à 09:05 via Buffer sur @etsi_scenario.

## Procédure d'un épisode

1. **Lire l'état** : `videos/serie.json` (dernier épisode, sa fin, le choix posé au public).
2. **Décider de la suite** :
   - Si le texte des commentaires est disponible (message de l'utilisateur dans la session, ou outil capable de les lire), compter les réponses au choix posé. La majorité décide, et l'épisode le dit : « Vous avez décidé : non. Max reste chez lui… ».
   - Sinon, ne jamais inventer un vote : Max fait lui-même le choix le plus prudent, sans l'attribuer au public.
3. **Écrire** `videos/blackout-jourN/script.json` et `scenes.js` (moteur `videos/engine/`, style `docs/style-video-survie.md`) : accroche sur le cliffhanger, 3-4 conseils de survie exacts et vérifiés, nouveau choix posé au public en fin d'épisode (« Commente OUI ou NON »), carton « JOUR N+1 ».
4. **Fabriquer** : voix (`build_audio.py`, variable `ELEVEN_KEY`), `render.js --check`, images de contrôle, rendu complet, `tiktok.mp4`, `descriptions.txt` (3 descriptions).
5. **Publier** : commit + push, puis `create_post` Buffer (`customScheduled` à 09:05 du jour, vidéo depuis l'URL raw GitHub, description n°1, `isAiGenerated: true`).
6. **Mettre à jour** `videos/serie.json` et `docs/REPRISE.md` (document de reprise pour un nouveau chat), puis commiter.

Si une étape échoue (clé ElevenLabs absente, Buffer en erreur…), rien n'est publié et l'utilisateur est prévenu.

## Personnage (depuis le 02/11) — prioritaire sur les consignes des tâches

- **Le héros de TOUTES les vidéos est le personnage de l'avatar** (`videos/avatar/avatar.png`) : tête ronde noire avec liseré bleu, deux yeux blancs, sweat orange, jambes grises. Dans le code : `hero(c, {...})` (même options que `drawMax`, défini dans `videos/engine/horreur.js`) ou `kid(c, {...})`. **Ne plus utiliser Max** (`drawMax`), sauf pour terminer la série Blackout (Jour 5, continuité).
- Les histoires sont racontées à la 2e personne (« tu ») : le héros n'a pas besoin de prénom.

## Voix (depuis le 02/11) — prioritaire sur les consignes des tâches

- **Gemini TTS gratuit en priorité.** Avant `build_audio.py`, exporter `GEMINI_API_KEY` (variable d'environnement, ou à défaut la clé Gemini fournie par l'utilisateur dans cette conversation) **et** `ELEVEN_KEY` (secours automatique si Gemini échoue). Ne jamais écrire ces clés dans le dépôt.
- **Demande de l'utilisateur (02/11)** :
  - Toutes les histoires « classiques » (survie, Et si…, mini-séries) : voix Gemini **« Orus »** avec le ton de `videos/etsi-compte-double-1/script.json` (`voice.gemini_style` : narrateur TikTok drôle et captivant, grave, rythme vif).
  - Horreur : voix **« Charon »**, **à voix normale, PAS de chuchotement** (l'utilisateur trouve ça nul). Style à copier depuis `videos/ascenseur-13-1/script.json`. Ne pas mettre de balise `[whispers]` dans les scripts.
- Après génération, vérifier dans `timeline.json` que chaque phrase a un débit de 14 à 24 caractères/s (sinon le découpage par silences s'est trompé : corriger avant le rendu).

## Planning (depuis le 02/11)

| Heure (Paris) | Série | Tâche programmée |
|---|---|---|
| 09:05 | Survie : Blackout général jusqu'au Jour 5, puis nouvelle série de survie de 5 épisodes | lancée à 08:31 |
| 12:00 | Horreur « Les règles de la nuit » | lancée à 11:13 |
| 18:00 | « Et si… ? » : vidéo unique scientifique (`docs/style-etsi.md`, `videos/etsi.json`) | lancée à 14:47 |
| 21:30 | Horreur « Les règles de la nuit » | lancée à 20:43 |

## Horreur

- Style et idées : `docs/style-horreur.md` ; accessoires : `videos/engine/horreur.js` ; état : `videos/horreur.json`.
- Chaque histoire = 3 ou 4 parties max (dossiers `videos/<histoire>-N/`), la dernière conclut avec un twist, puis nouvelle histoire originale (nouveau lieu, nouvelle règle, nouvelle créature).
- Même procédure que Blackout (voix, rendu, contrôle, push, Buffer `customScheduled`, description n°1, `isAiGenerated`), puis mise à jour de `videos/horreur.json` et `docs/REPRISE.md`.
