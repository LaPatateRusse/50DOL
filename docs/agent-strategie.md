# Agent stratège — veille + directives (demande de l'utilisateur, 03/11)

« Crée un super agent qui va voir ce qui fonctionne sur TikTok etc., s'en inspirer, envoyer les images de référence ou directement la vidéo à toi ou à l'autre chat, et vous dire quoi faire pour poster ; gère YouTube de façon à poster des longues parties directement en vidéo. »

Tâche programmée « Agent stratège » : 2 fois par jour (06:40 et 18:40, Europe/Paris). Elle ne fabrique pas de vidéo : elle observe, décide et donne des ordres.

## À chaque passage
1. **Veille TikTok / YouTube** (outils Firecrawl, budget max ~200 crédits par passage) :
   - `firecrawl_scrape` alexandria `oriane / tiktok/posts-search` (projection `default`, tri `viewsCount:desc`, limit 10) sur 3 à 4 requêtes de notre niche : `#histoire`, `#horreur`, `#storytime`, `#animation`, `#creepypasta`, `#survie`, `#superpouvoir`, `#etsi`… (varier ; l’index couvre mal « #histoirehorreur » : préférer `#creepypasta`, `#mystere`, `#famille`, `#secret`, `#enigme`). Retenir les vidéos à fort ratio vues/abonnés (`viewsRatePerFollowers`) et fort engagement : ce sont les formats qui percent.
   - Tendances France : `https://ads.tiktok.com/creative/creativeCenter/trends/hashtag?region=FR&period=7` (scrape markdown) et `firecrawl_search` (web, dernière semaine) sur les formats viraux de YouTube Shorts et de TikTok en français.
   - Ne jamais copier une vidéo, une intrigue ou des personnages : on s'inspire d'un FORMAT (accroche, durée, structure, type de titre, hashtags), on écrit une histoire originale.
2. **Nos statistiques** : `list_posts` TikTok + YouTube avec `includeMetrics: true` → `videos/.build/posts.json` → `python3 engine/stats_excel.py` → lire « % regardé », vues, abonnés gagnés. Repérer ce qui marche chez nous et ce qui ne marche pas.
3. **Rapport** : `docs/veille/AAAA-MM-JJ[-soir]/rapport.md` avec, pour chaque référence : lien du profil (et de la vidéo si connu), miniature (`thumbnailMediaUrl` ; la télécharger dans le dossier si le réseau le permet), chiffres, POURQUOI ça marche, ce qu'on en retient.
4. **Directives** : réécrire `docs/directives.md` (lu en PREMIER par l'usine horaire avant chaque fabrication) : idées d'histoires prioritaires (originales), formats/accroches à appliquer, titres et hashtags, répartition des types de vidéos, durées, ce qu'il faut arrêter.
5. **Autre chat** (`session_01PqzQsrwnrHoFwrhXKuhVhq`, série cinéma) : `send_message` avec les directives qui le concernent et les liens des références (format inspirant, accroche, titres). Il reste libre de son histoire ; ne pas lui demander d'action risquée.
6. **YouTube long** : décider les prochains formats longs (`videos/long/<nom>/config.json`, `engine/long_format.py`) : séries terminées, compilations thématiques de 4 histoires, et à partir de maintenant **une histoire longue originale par jour en vidéo horizontale directement** dès qu'il y a de quoi (voir `docs/production.md`, section Formats longs). Les mettre dans `videos/youtube.json` (`format: long`, `heure_prevue` 18:30, 1 à 2 par jour max).
7. Commit + push, résumé en 3 lignes à l'utilisateur (ce qui marche, ce qu'on change, ce qui est prévu).
