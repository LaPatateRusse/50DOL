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

## Planning (depuis le 02/11)

| Heure (Paris) | Série | Tâche programmée |
|---|---|---|
| 09:05 | Blackout général, jusqu'au Jour 5 (conclusion), puis arrêt | lancée à 08:31 |
| 12:00 | Horreur « Les règles de la nuit » | lancée à 11:13 |
| 21:30 | Horreur « Les règles de la nuit » | lancée à 20:43 |

## Horreur

- Style et idées : `docs/style-horreur.md` ; accessoires : `videos/engine/horreur.js` ; état : `videos/horreur.json`.
- Chaque histoire = 3 ou 4 parties max (dossiers `videos/<histoire>-N/`), la dernière conclut avec un twist, puis nouvelle histoire originale (nouveau lieu, nouvelle règle, nouvelle créature).
- Même procédure que Blackout (voix, rendu, contrôle, push, Buffer `customScheduled`, description n°1, `isAiGenerated`), puis mise à jour de `videos/horreur.json` et `docs/REPRISE.md`.
