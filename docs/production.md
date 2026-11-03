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

1. `git pull --ff-only origin claude/tech-services-dashboard-dj8dG`.
2. `list_posts` : si un post est déjà programmé à ±30 min du créneau aujourd'hui, ou s'il ne reste aucune place sous la limite Buffer de 10 posts programmés : ne rien faire.
3. Écrire l'histoire. Toujours ORIGINALE (jamais une intrigue, une règle ou un pouvoir déjà traité : vérifier les fichiers d'état), règle magique chiffrée ou compteur, accroche immédiate, émotion vraie, twist final qui boucle avec le début. Votes du public : seulement ceux que l'utilisateur écrit dans cette conversation, jamais inventés.
4. STYLE CINÉMA : `docs/BRIEF-STYLE-CINEMA.md` + `docs/style-cinema.md`, exemple complet `videos/histoire-carnet-excuses/`. Film 16:9 centré, titre au-dessus, HUD JOUR + compteur, AUCUN sous-titre (`EP = { cinema: true, hideSubs: () => true }`, `show` = `say` dans script.json), une source de lumière par plan, un plan toutes les 1-3 s (`shots()`), aucun plan figé, `film()`. Fin : carton « FIN » + question (histoire complète) ou « À SUIVRE / PARTIE N+1 » + question (série).
5. Voix : Gemini « Orus » (histoires, science, survie) ou « Charon » à voix normale, JAMAIS chuchotée (horreur). `TTS_PROVIDER=gemini` : relais automatique entre modèles Gemini puis ElevenLabs. Clés : variables d'environnement ou fournies dans la conversation, JAMAIS écrites dans le dépôt.
6. **Contrôle qualité en 3 passes (demande de l'utilisateur : « vérifie 3 fois, que tout soit le meilleur possible »)** :
   - Passe 1 (brouillon `TTS_PROVIDER=draft`) : `--check`, puis planche d'au moins 16 images (`--stills`) couvrant chaque plan, y compris en milieu de plan. Vérifier : bras et mains naturels (une main qui tient un objet le touche vraiment, pas de bras tordu ou flottant), personnages entiers dans le cadre, rien qui chevauche le HUD ou le titre, textes du décor lisibles et sans faute, coiffures qui ne ressemblent pas à un casque, décalages ou éléments qui sautent d'un plan à l'autre. Corriger et refaire la planche jusqu'à ce que tout soit bon.
   - Passe 2 (vraie voix) : débit de chaque phrase 9-24 caractères/s (`timeline.json`), nouvelle planche calée sur la vraie voix : chaque plan montre bien ce que dit la phrase, le compteur change au bon moment. Corriger.
   - Passe 3 (vidéo finale) : extraire 5 images de `tiktok.mp4` avec ffmpeg et les relire ; durée et son présents (`ffprobe`). Ne publier que si les 3 passes sont bonnes.
7. Rendu : `node engine/render.js <dossier> .build/<x>` puis `ffmpeg -f concat -safe 0 -i segs.txt -i audio.wav -c:v libx264 -crf 23 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart <dossier>/tiktok.mp4` ; `descriptions.txt` (3 descriptions avec hashtags).
8. Vérifier l'absence des clés dans le dépôt, commit + push, vérifier l'URL raw (`…/videos/<dossier>/tiktok.mp4?v=1`, code 200), puis `create_post` : `schedulingType: automatic`, `customScheduled` à l'heure du créneau (15 min après le rendu si l'heure est passée), description n°1, `metadata.tiktok.isAiGenerated: true`.
9. Mettre à jour le fichier d'état, commit + push, résumer en 1 ligne à l'utilisateur. En cas d'échec : ne rien publier et expliquer pourquoi.
