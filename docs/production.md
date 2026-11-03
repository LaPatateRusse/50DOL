# Production automatique — règles communes (lues par chaque tâche programmée)

Compte TikTok @etsi_scenario via Buffer (organisation `6ae857cdecb73df5e4545083`, chaîne `6ae85bb5e29c69a1713612e1`, fuseau Europe/Paris).
Un autre chat Claude publie aussi sur ce compte (« Cent euros le mensonge », dossiers `videos/cinema-*`, `mensonge-kit.js`) : ne jamais modifier ses fichiers.

## Planning : 11 vidéos par jour (demande de l'utilisateur, 03/11)

| Heure | Contenu | État |
|---|---|---|
| 07:00 | « Et si… ? » science vécu comme un mini-film (chiffres réels vérifiés, 1 min 05-1 min 30) | `videos/etsi.json` (idees_restantes → publiees) |
| 12:10 | Survie : Blackout Jour 5 (FIN, ancien style Max) puis nouvelles séries de survie de 5 épisodes | `videos/serie.json` |
| 13:30 | Histoire originale complète en 1 partie | `videos/etsi.json` → one_shots |
| 14:30 | Histoire originale complète en 1 partie | idem |
| 15:00 | Horreur complète en 1 partie | `videos/horreur.json` → one_shots |
| 16:00 | Histoire originale complète en 1 partie | `videos/etsi.json` → one_shots |
| 16:30 | Histoire originale complète en 1 partie | idem |
| 17:30 | Mini-série originale de 3-5 parties (1 partie par jour) | `videos/<histoire>.json` |
| 19:15 | Horreur complète en 1 partie | `videos/horreur.json` → one_shots |
| 20:00 | Horreur mini-série (partie suivante) | `videos/horreur.json` → series |
| 21:00 | Horreur mini-série (partie suivante, même série que 20:00) | idem |

Séries déjà commencées : elles finissent dans LEUR style (Blackout J5 = style Max ; L'ascenseur du 13e P2-P3 = style docs/style-horreur.md). Tout le reste : style cinéma.

## Étapes de chaque tâche

0. Lire `docs/directives.md` (directives de l'agent stratège, `docs/agent-strategie.md`) et les appliquer en priorité sur le reste de ce document.

1. `git pull --ff-only origin claude/tech-services-dashboard-dj8dG`.
2. `list_posts` : si un post est déjà programmé à ±30 min du créneau aujourd'hui, ou s'il ne reste aucune place sous la limite Buffer de 10 posts programmés : ne rien faire.
3. Écrire l'histoire. Toujours ORIGINALE (jamais une intrigue, une règle ou un pouvoir déjà traité : vérifier les fichiers d'état), règle magique chiffrée ou compteur, accroche immédiate, émotion vraie, twist final qui boucle avec le début. Votes du public : seulement ceux que l'utilisateur écrit dans cette conversation, jamais inventés.
4. STYLE CINÉMA : `docs/BRIEF-STYLE-CINEMA.md` + `docs/style-cinema.md`, exemple complet `videos/histoire-carnet-excuses/`. Film 16:9 centré, titre au-dessus, HUD JOUR + compteur, AUCUN sous-titre (`EP = { cinema: true, hideSubs: () => true }`, `show` = `say` dans script.json), une source de lumière par plan, un plan toutes les 1-3 s (`shots()`), aucun plan figé, `film()`. Fin : carton « FIN » + question (histoire complète) ou « À SUIVRE / PARTIE N+1 » + question (série).
5. Voix : Gemini « Orus » (histoires, science, survie) ou « Charon » à voix normale, JAMAIS chuchotée (horreur). `TTS_PROVIDER=gemini` : relais automatique entre modèles Gemini puis ElevenLabs. Clés : variables d'environnement ou fournies dans la conversation, JAMAIS écrites dans le dépôt.
6. **Contrôle qualité en 3 passes (demande de l'utilisateur : « vérifie 3 fois, que tout soit le meilleur possible »)** :
   - Passe 1 (brouillon `TTS_PROVIDER=draft`) : `--check`, puis planche d'au moins 16 images (`--stills`) couvrant chaque plan, y compris en milieu de plan. Vérifier : bras et mains naturels (une main qui tient un objet le touche vraiment, pas de bras tordu ou flottant), personnages entiers dans le cadre, rien qui chevauche le HUD ou le titre, textes du décor lisibles et sans faute, coiffures qui ne ressemblent pas à un casque, décalages ou éléments qui sautent d'un plan à l'autre. Corriger et refaire la planche jusqu'à ce que tout soit bon.
   - **Bras (remarque de l'utilisateur : « les bras sont bizarres, la façon dont ils sont courbés »)** : avec `rig()`, `armF`/`armB` = [épaule, coude]. Le coude ne doit JAMAIS être négatif (pli à l'envers) : coude entre 0 et 1,2. Bras levé (épaule > 2,4) : coude 0. Mains sur les genoux / tenir un objet devant soi : [.75, .85]. Montrer / tendre la main : [1.3-1.6, 0-.2]. Le long du corps : laisser la valeur par défaut. Vérifier chaque bras sur la planche.
   - Passe 2 (vraie voix) : débit de chaque phrase 9-24 caractères/s (`timeline.json`), nouvelle planche calée sur la vraie voix : chaque plan montre bien ce que dit la phrase, le compteur change au bon moment. Corriger.
   - Passe 3 (vidéo finale) : extraire 5 images de `tiktok.mp4` avec ffmpeg et les relire ; durée et son présents (`ffprobe`). Ne publier que si les 3 passes sont bonnes.
7. Rendu : `node engine/render.js <dossier> .build/<x>` puis `ffmpeg -f concat -safe 0 -i segs.txt -i audio.wav -c:v libx264 -crf 23 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart <dossier>/tiktok.mp4` ; `descriptions.txt` (3 descriptions avec hashtags).
8. Vérifier l'absence des clés dans le dépôt, commit + push, vérifier l'URL raw (`…/videos/<dossier>/tiktok.mp4?v=1`, code 200), puis `create_post` : `schedulingType: automatic`, `customScheduled` à l'heure du créneau (15 min après le rendu si l'heure est passée), description n°1, `metadata.tiktok.isAiGenerated: false` (demande de l'utilisateur du 03/11 : ne PAS cocher la case « contenu créé avec l'IA »).
9. Mettre à jour le fichier d'état, commit + push, résumer en 1 ligne à l'utilisateur. En cas d'échec : ne rien publier et expliquer pourquoi.

## Stock et remplissage de Buffer (demande de l'utilisateur, 03/11)

« Réalise déjà toutes les vidéos, poste le plus possible jusqu'à la limite gratuite de Buffer, garde le reste, et dès qu'une vidéo est publiée mets-en une autre sur Buffer. »

- Les 11 tâches par créneau sont DÉSACTIVÉES. Une seule tâche toutes les heures (« Usine TikTok ») fait, dans cet ordre :
  1. **Remplir Buffer** : `list_posts` statut `scheduled` (toute l'organisation, y compris l'autre chat). Tant qu'il y a moins de 10 posts programmés et que `videos/stock.json → pret` n'est pas vide : prendre le prochain créneau libre de la grille (07:00, 12:10, 13:30, 14:30, 15:00, 16:00, 16:30, 17:30, 19:15, 20:00, 21:00), au moins 30 min dans le futur, sans post à ±20 min ; y mettre la plus ancienne vidéo du stock du TYPE de ce créneau (sinon, pour un créneau « histoire », « horreur » ou « science », n'importe quelle vidéo complète en 1 partie ; JAMAIS une partie de série hors de son créneau ni avant la partie précédente). `create_post` customScheduled, description n°1, isAiGenerated false. Déplacer l'entrée de `pret` vers `programmes` (avec l'id Buffer et l'heure).
  2. **Fabriquer** : si `pret` contient moins de 12 vidéos, fabriquer UNE nouvelle vidéo (en suivant les étapes 3 à 8 ci-dessus, contrôle qualité en 3 passes, mais sans programmer), du type le moins représenté dans le stock par rapport au planning (11 par jour : 1 science, 1 survie, 4 histoires, 2 horreurs complètes, 1 partie de série, 2 parties d'horreur-série). Commit + push, vérifier l'URL raw, l'ajouter à `pret` avec : dossier, type, titre, description n°1, partie (pour les séries).
  3. Refaire l'étape 1 (une place a pu se libérer), commit + push de `videos/stock.json`, résumer en 1 ligne.
- Séries fabriquées à l'avance : sans vote du public, le héros fait le choix le plus prudent (ne jamais inventer de vote). Si l'utilisateur écrit un vote dans la conversation, l'appliquer aux parties PAS encore fabriquées.

## Tableau Excel des statistiques (demande de l'utilisateur, 03/11)

`videos/stats/stats-tiktok.xlsx` (onglets « Vidéos » et « Résumé ») : date de fabrication, date de programmation et de publication, durée, vues, likes, commentaires, partages, personnes touchées, temps moyen regardé, % regardé, taux d'engagement.
À chaque passage de la tâche horaire, après le remplissage de Buffer : `list_posts` (chaîne TikTok, `includeMetrics: true`, `first: 100`) → enregistrer la réponse dans `videos/.build/posts.json` → `cd videos && python3 engine/stats_excel.py .build/posts.json stats/stats-tiktok.xlsx` → recalcul (`python3 <skill xlsx>/scripts/recalc.py videos/stats/stats-tiktok.xlsx`, à défaut le fichier reste valable, Excel recalcule à l'ouverture) → commit + push.

## YouTube Shorts (demande de l'utilisateur, 03/11) — chaîne « MalabarTv » `6ae9f1a3e29c69a1714b3729`

- File d'attente : `videos/youtube.json` (toutes les vidéos dans l'ordre de fabrication ; `statut` : a_publier → programme). Chaque nouvelle vidéo fabriquée (étape 2 du stock) est ajoutée à la FIN de cette file.
- **YouTube autorise 10 publications par JOUR au maximum** (refus « Limit reached » au-delà) et Buffer 10 programmées à la fois par chaîne.
- Rattrapage (demande de l'utilisateur, 03/11 : « poste toutes les anciennes vidéos à 10 min d'intervalle jusqu'à être en même temps que les posts TikTok ») : tant qu'il reste dans `videos/youtube.json` des vidéos `a_publier` DÉJÀ sorties sur TikTok, les programmer à 10 min d'intervalle (dès maintenant, ou à partir de 07:00 le lendemain si les 10 du jour sont pris), dans l'ordre de la file.
- Une fois rattrapé : chaque vidéo part sur YouTube à la MÊME heure que sur TikTok (même `dueAt`), dans la limite de 10 par jour (au-delà, le lendemain à 10 min d'intervalle dès 07:00).
- `create_post` : `channelId` YouTube, `schedulingType: automatic`, `customScheduled`, vidéo `…/videos/<dossier>/tiktok.mp4?v=yt`, texte = description n°1 en remplaçant `#apprendresurtiktok`, `#pourtoi` et `#fyp` par `#shorts`, et le MOT « demain » (mot entier, pas « lendemain ») par « bientôt » ; pour une description en plusieurs blocs, ne garder que le 1er. `metadata.youtube` = `{ title: "<titre> #Shorts" (≤ 100 caractères), categoryId: "24", privacy: "public", madeForKids: false, isAiGenerated: false, notifySubscribers: true }`.
- Les vidéos de l'autre chat (`cinema-mensonge-*`) : parties 1 → 5 dans l'ordre et JAMAIS avant leur date TikTok (P2 04/11, P3 05/11, P4 06/11, P5 07/11, à 18:00 ; demande de l'autre chat). Elles sont dans la file aussi (demande de l'utilisateur : republier toutes les anciennes vidéos).

## Faire percer le compte (demande de l'utilisateur : « fais tout pour que le compte perce »)

- 1re seconde : l'image la plus forte (danger, chiffre, visage choqué) + une phrase-choc immédiate ; jamais d'intro.
- Durée 1 min 05 à 1 min 40 (plus d'une minute pour la rémunération TikTok), rythme : un plan toutes les 1-3 s, une montée toutes les 8-10 s.
- Fin qui pousse à commenter (question à choix, « dis-le en commentaire ») et, pour les séries, « Abonne-toi pour la partie N+1 ».
- Descriptions : une question + 5 à 8 hashtags ciblés (thème + #histoire/#horreur + #pourtoi #fyp), pas de liens.
- Chaque jour, au premier passage horaire après 09:00 : relire `videos/stats/stats-tiktok.xlsx` ; la catégorie avec le meilleur « % regardé » et le plus de vues sur 2 jours reçoit plus de créneaux (remplacer une partie des « histoire » par cette catégorie) ; noter la décision dans `docs/REPRISE.md`.

## Formats longs YouTube (demande de l'utilisateur, 03/11)

- Outil : `python3 engine/long_format.py long/<nom>/config.json` (depuis `videos/`) → `long/<nom>/youtube-long.mp4` (1920×1080) + `description.txt` avec chapitres. Intro et fin INÉDITES (voix Gemini, durée vérifiée automatiquement), cartons de chapitre, vidéos verticales sur fond flou, vidéos style cinéma recadrées sur la bande 16:9. Couper les cartons de fin des parties (`cut_end`) sauf la dernière.
- Un format long dès qu'une série est terminée (toutes ses parties sorties sur TikTok), et une compilation thématique (4 histoires complètes du même genre : super-pouvoirs, horreur, science) dès qu'il y en a 4 nouvelles.
- Publication : entrée `"format": "long"` dans `videos/youtube.json` ; `create_post` YouTube avec la vidéo `…/videos/<fichier>?v=1`, le titre SANS `#Shorts` (≤ 100 caractères), texte = `description.txt`, `metadata.youtube` comme pour les Shorts. Au plus 1 format long par jour, à 18:30 (`heure_prevue`), en comptant dans la limite de 10 publications YouTube par jour.
- Fichier < 100 Mo (sinon GitHub refuse) : vérifier avec `ls -la` avant commit.
