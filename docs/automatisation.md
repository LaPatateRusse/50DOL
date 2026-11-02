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
