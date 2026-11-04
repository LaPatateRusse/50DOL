# Analyse — 04/11/2026 08:50 (Paris) — 2e passage de l'Analyste

Sources : Buffer `list_posts` + `get_aggregated_post_metrics` (lecture seule). Fichiers bruts : `videos/.build/posts-tiktok.json`, `videos/.build/veille-0411.json`.
Fraîcheur : **TikTok au 04/11 09:47 (Paris)**. **YouTube : toujours au 03/11 20:17 (Paris)**, aucune mise à jour depuis le rapport d'hier ⇒ les chiffres YouTube sont identiques (voir rapport du 03/11 20:50, §2 et §3). Aucun Short YouTube du 04/11 n'est encore publié (premier à 09:40). Abonnés TikTok et YouTube : **non disponible**.
⚠️ Toutes les vidéos TikTok du 03/11 ont moins de 24 h et la Lune (07:00 le 04/11) moins de 2 h : conclusions **provisoires**.

## 1. Résumé
1. **TikTok reste très bas** : 7 jours = 19 vidéos, **235 vues**, 33 likes, 11 commentaires, 5 partages, 11,6 s regardées en moyenne ; 24 h = 9 vidéos, **54 vues**, 0 partage.
2. **Vues par vidéo en baisse** : 6,6 vues en moyenne pour les 9 vidéos du 03/11 (12 à 24 h d'âge), contre 19,6 pour les 9 vidéos publiées jusqu'au 02/11 (plus de 24 h). Âge différent, donc à confirmer le 05/11.
3. **Seul signe positif : la rétention des 3 dernières vidéos** : L'ascenseur P1 15,0 s (29 %), L'ascenseur P2 « Liftier » 16,3 s (27 %), La Lune 16,9 s (24,5 %, 2 h seulement), contre 9,9 s en moyenne pour les 7 autres vidéos du 03/11 et environ 15 % (médiane) de la durée avant. Leur script ne contient pas de « flash-forward » (recherche dans `script.json`) : la cause est inconnue.
4. YouTube : pas de nouveau chiffre ; le biais « 3 premiers Shorts forts puis chute » reste à tester avec l'espacement du 04/11 (mesure (a)).
5. Veille : @unknowwkil (origine du format « Le secret de… ») fait 19,0 M de vues sur ses 10 meilleures vidéos avec 19 800 abonnés ; ses vidéos durent **60 s**, 6 titres sur 10 suivent le schéma « Le secret de… / pas comme les autres.. ».

## 2. Tableau par format

### TikTok (@etsi_scenario), chiffres Buffer au 04/11 09:47
| Format | Âge | Vidéos | Vues moy. | Vues méd. | Likes | Comm. | Partages | Temps moy. regardé |
|---|---|---|---|---|---|---|---|---|
| Survie (style Max) | > 24 h | 3 | 24,3 | 22 | 9 | 2 | 0 | 13,0 s |
| Survie (Blackout J4) | < 24 h | 1 | 7 | 7 | 2 | 0 | 0 | 6,95 s |
| Horreur-série (Ne réponds pas P1-P2) | > 24 h | 2 | 23,0 | 23 | 5 | 3 | 5 | 8,3 s |
| Horreur-série / horreur (P3, ascenseur P1-P2, baby-phone) | < 24 h | 4 | 6,0 | 6 | 5 | 0 | 0 | 11,7 s |
| Histoire originale (télécommande, classe 3B, chat noir) | > 24 h | 3 | 14,0 | 15 | 4 | 5 | 0 | 10,9 s |
| Histoire / concept (mensonge P1, compte double P1, excuses, pensées) | < 24 h | 4 | 7,0 | 7 | 6 | 0 | 0 | 11,8 s |
| Science « Et si » (traverser la Terre) | > 24 h | 1 | 15 | 15 | 2 | 1 | 0 | 13,5 s |
| Science « Et si » (La Lune) | 2 h | 1 | 0 | 0 | 0 | 0 | 0 | 16,9 s |
| « Le secret de… », horreur complète, cinéma | — | 0 | non disponible (pas encore publiés ou sans chiffres) | | | | | |
Le « % regardé » exact n'est calculé qu'avec les durées Buffer : voir §3. Par heure et par accroche : échantillon trop petit (moins de 3 vidéos par case).

### YouTube (MalabarTv)
Inchangé depuis le rapport du 03/11 20:50 (Buffer n'a pas rafraîchi) : 10 Shorts, 2 514 vues, Blackout J1 à J3 = 847, 786, 680 vues, tous les autres sous 50. Temps regardé : non disponible. Format long « 4 super-pouvoirs » (Upload-Post, 09:05) : pas encore visible dans Buffer.

## 3. Top 3 / Flop 3 (TikTok, avec la réserve des 24 h)
**Top**
1. **La Lune disparaît (science, 04/11 07:00)** : 16,9 s regardées (24,5 % de 69 s) en 2 h, meilleur temps de la chaîne ; 0 vue comptée pour l'instant. À rechiffrer le 05/11.
2. **L'ascenseur P1 (51 s) et P2 « Liftier » (60 s)** : 15,0 s (29 %) et 16,3 s (27 %), 9 vues chacune. Vidéos courtes, danger immédiat dans le titre (« Ton immeuble a 12 étages… »). Les deux dépassent 25 % regardé, ce que n'atteint aucune autre vidéo de la période hors science (traverser la Terre, 24 %).
3. **Ne réponds pas P2 (02/11)** : 21 vues, **5 partages** et 4 likes (47,6 % d'engagement), le seul contenu partagé de la chaîne ; peur proche (la grand-mère, le téléphone resté dans la cuisine).

**Flop**
1. **Mensonge P1 « Chaque mensonge te rapporte 100 € » (84 s)** : 5 vues, malgré 15,8 s regardées (19 %) : distribution faible ; thème argent sans danger.
2. **Tu as survécu à la nuit… Mamie P3 (42 s)** et **Baby-phone (58 s)** : 3 vues chacune ; 6,4 s et 8,9 s regardées (15 %). Épisode final d'une série dont la partie 1 a fait 25 vues et dont les titres sont longs.
3. **Excuses sincères (101 s)** : 9 vues, 8,4 s regardées (8 %) : vidéo la plus longue (plus de 100 s) et le plus mauvais % de la période.

## 4. Veille (≈ 122 crédits Firecrawl)
Requêtes : `#famille #secret #animation` (aucun résultat indexé), `@unknowwkil` (34 vidéos indexées au total, 10 lues), `#histoireanimée #enigme` (aucun résultat), `#histoire` triée par engagement (hors niche : maquillage, football, santé), `#storytime #france` (7 résultats, vrais témoignages face caméra, 552 à 97 500 vues : hors niche). Recherche web de la semaine : rien d'exploitable.

**@unknowwkil**, FR, https://www.tiktok.com/@unknowwkil : 19 800 abonnés, 13 vidéos, la plus récente indexée le 24/09/2026 (publication ~1 vidéo tous les 3 à 4 jours du 08/08 au 24/09).
| Titre (début) | Vues | Likes | Partages | Vues/abonnés | Durée | Date | Miniature |
|---|---|---|---|---|---|---|---|
| Le secret de ses dents.. | 4,2 M | 356,8 k | 3,2 k | 212× | 60 s | 25/08 | https://social-catalog-static.oriane.xyz/oriane-contents/tiktok/7678013656587701536/thumbnail.webp |
| Un joueur pas comme les autre... | 4,0 M | 175,2 k | 8,2 k | 202× | 60 s | 11/08 | https://social-catalog-static.oriane.xyz/oriane-contents/tiktok/7672740853433027873/thumbnail.webp |
| Une enfance totalement différente.. | 3,1 M | 128,7 k | 1,5 k | 157× | 60 s | 08/08 | https://social-catalog-static.oriane.xyz/oriane-contents/tiktok/7671699252464143648/thumbnail.webp |
| Son frère découvre tout.. | 2,2 M | 148,0 k | 1,8 k | 111× | 60 s | 07/09 | https://social-catalog-static.oriane.xyz/oriane-contents/tiktok/7682788679072468256/thumbnail.webp |
| L'évasion qui tourne mal.. | 1,1 M | 52,4 k | **27,8 k** | 56× | non dispo. | 24/09 | (voir lien de la vidéo) |
Les 10 meilleures vidéos : 0,58 à 4,2 M de vues, 19,0 M au total. 6 titres sur 10 (14,3 M de vues) suivent le schéma « Le secret de son X.. » / « Un X pas comme les autres.. » (une différence physique ou de situation). Hashtags **identiques à chaque vidéo** : `#histoire #fruit #france #père #soeur` (l'univers « fruits » est le leur : on ne le reprend pas). 
**Pourquoi ça marche** : titre de 3 à 6 mots qui finit par « .. » et promet un secret sur une différence ; durée constante de 60 s ; thème familial (père, sœur, frère) très partageable ; rythme faible (1 vidéo tous les 3-4 jours) et blocs de hashtags stables.
**À reprendre (format seulement)** : titre de 3 à 6 mots + « .. », une différence/un secret dans la famille, 60 s pile, mêmes hashtags d'une vidéo à l'autre. À ne pas reprendre : fruits, intrigues, personnages, titres exacts.

Autres comptes (inchangés, voir `comptes-suivis.md`) : @secretzonetiktok, @carlos_name, @mr.craftss0, @knownshrimp : pas de nouveaux chiffres ce passage. Nouveau compte ajouté : aucun (les autres résultats sont hors niche).

## 5. Recommandations (par impact attendu)
1. **Continuer et élargir « Le secret de… » (Usine)**. Pourquoi : @unknowwkil, 6 titres sur 10 de ce schéma = 14,3 M de vues sur 19 800 abonnés. Reprendre sa durée stable de **60 s** (nos secret-concierge 71,7 s) et le titre court en « .. ». Mesure : vues, % regardé et partages de secret-gant et secret-gateau (04/11) puis du concierge, comparés aux histoires (14 vues, 10,9 s).
2. **Identifier ce qui a fait monter la rétention des 3 dernières vidéos** (Usine, via le Superviseur) : ascenseur P1, P2 et Lune = 25 à 29 % regardé contre 15 % avant. Le script ne contient pas de flash-forward : noter ce qui est commun (voix, 1re phrase, rythme, durée de 51 à 69 s) et le généraliser. Mesure : % regardé des vidéos du 04/11 (objectif au moins 25 %).
3. **Garder la survie en n° 1 et mesurer le Protocole de survie (Usine, Réalisateur)**. Pourquoi : survie = 24,3 vues et 13,0 s sur TikTok (meilleur format), 590 vues sur YouTube. Mesure : mesure (c), 05/11 à 19:15.
4. **Test de volume (Superviseur) : 2 jours à 6-7 vidéos TikTok au lieu de 11**, en gardant survie, « Le secret de… » et horreur-série. Pourquoi : @unknowwkil fait 1 vidéo tous les 3-4 jours et 1 à 4 M de vues ; nos 19 vidéos font 235 vues au total, et les vidéos du 03/11 font moins de vues que celles du 02/11. **Hypothèse, pas une preuve** : l'effet du volume n'est pas mesuré. Mesure : vues moyennes par vidéo sur 48 h, comparées au 02/11-03/11.
5. **Titres/légendes courts à « .. » et appel à enregistrer ou partager** (Usine) : seul contenu partagé = Ne réponds pas P2 (5 partages) ; @unknowwkil monte à 27,8 k partages sur une vidéo tendue (« L'évasion qui tourne mal.. »). Mesure : partages par vidéo (0,26 en moyenne aujourd'hui).
6. **Arrêter les vidéos de plus de 85 s** (Usine, Réalisateur) : excuses 101 s = 8 % regardé ; mensonge P1 84 s = 19 %. Le meilleur % est entre 51 et 69 s. Mesure : % regardé par tranche de durée.
7. **Science et histoires : réévaluation le 05/11 comme prévu** : Lune 24,5 % regardé en 2 h, chiffres de vues à recompter.

## 6. Expériences en cours
| Expérience | Depuis | Résultat | Décision |
|---|---|---|---|
| (a) Shorts YouTube espacés (1er à 09:40) | 04/11 | aucun Short publié, Buffer YouTube non rafraîchi | attendre le passage de 21:50 |
| (b) Format long « 4 super-pouvoirs » (09:05, Upload-Post) | 04/11 | pas encore visible | à demander au Superviseur si Buffer ne le voit pas |
| (c) Protocole de survie 19:15 | 05/11 | pas commencé | à suivre |
| (c) « Le secret de… » 13:30 et 16:00 | 04/11 | pas publié | à suivre au passage de 21:50 |
| Ouverture en flash-forward + 1re phrase de 8 mots | vidéos fabriquées depuis le 03/11 | compte-double P2, secret-gant, secret-gateau, cinéma-frère ont le marqueur ; aucun n'est publié | mesurable à partir du 05/11 |
| Excel `videos/stats/stats-tiktok.xlsx` | — | dernière mise à jour dans le dépôt : **03/11 18:29 UTC (19:29 Paris), soit plus de 13 h** | ⚠️ en retard (limite d'usage de 5 h, Usine à l'arrêt depuis 21:10) |
