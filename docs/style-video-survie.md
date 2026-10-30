# Bible de style — vidéos « Survie de Max » (format court vertical)

Référence analysée : short vertical FR « Épidémie zombie — Jour 1 » (chalet de montagne, coupure imminente, eau/chauffage).
Ce document sert de cahier des charges pour reproduire le style à l'identique sur n'importe quel scénario.

---

## 1. Format

| Paramètre | Valeur |
|---|---|
| Ratio | 9:16 vertical, 1080×1920 |
| Durée | 60–120 s |
| Rythme | un plan toutes les 1,5–3 s, jamais d'image fixe > 3 s |
| Langue / ton | français familier, tutoiement (« tu »), phrases courtes, punchlines |
| Fréquence | 30 fps |

**Zone de sécurité** : rien d'important dans les 200 px du haut ni les 450 px du bas (UI TikTok/Reels). Les sous-titres sont à ~58 % de la hauteur (y ≈ 1120 px).

---

## 2. Direction artistique

**Flat design vectoriel**, style « explainer animé » : aplats, contours sombres épais (4–6 px), quasi aucun dégradé (sauf ciel et vignettage), ombres portées douces très légères, profondeur de champ simulée par flou sur les éléments de premier plan.

### Palette

| Rôle | Couleur | Hex |
|---|---|---|
| Ciel / brume | gris bleuté | `#A9B0B8` → `#D9DDE1` |
| Montagnes | gris ardoise + sommets blancs | `#8C949E`, `#6F7782`, `#FFFFFF` |
| Neige / sol | blanc cassé | `#F2F3F4` |
| Sapins | vert sapin foncé + neige | `#2E4A3B` |
| Bois chalet | brun miel / brun foncé | `#A86B3F`, `#6B4226` |
| Intérieur chalet | lambris brun | `#9A6A45` |
| Pierre soubassement | gris | `#9EA2A6` |
| **Accent danger** | rouge | `#E53935` |
| **Accent ressource/clé** | jaune | `#F5C518` |
| Eau | bleu | `#4A90D9` |
| Fond infographie claire | papier quadrillé beige | `#F1EADB` + grille `#E2D8C3` |
| Fond infographie sombre | blueprint marine | `#141B26` + grille `#1F2937` |
| Carte tactique | quasi noir + courbes de niveau | `#15181C`, lignes `#2A2F35` |
| Label positif | vert | `#2EAD5B` |

### Personnage : Max
- Silhouette « stickman étoffé » : grosse tête ronde, corps fin, bras et jambes longs en « nouilles ».
- **Capuche noire** qui encadre le visage, avec **une pointe** sur le dessus (oreille de chat / pompon) — signe distinctif.
- Visage beige `#F4D9B8`, **joue rosée** (blush rond `#E8A598`), **sourcils froncés en V**, petits yeux points, bouche en trait : air déterminé/énervé en permanence.
- Veste noire, **sac à dos kaki/olive** `#7D7444` avec sangle, **jean bleu marine** `#3B4A6B`, chaussures marron.
- Toujours de profil ou trois-quarts ; poses : marcher, se pencher pour ramasser, tendre les bras, assis à table.

---

## 3. Typographie

### Sous-titres (élément central du style)
- Police : condensée grasse capitales — **Oswald Bold / Bebas Neue / Anton**.
- Taille ~90–100 px, blanc `#FFFFFF`, **contour noir 4 px + ombre portée** douce.
- Affichage **par groupe de 2 à 4 mots**, synchronisé sur la voix, centré horizontalement, position fixe (y ≈ 58 %).
- **Un seul mot-clé coloré par phrase** :
  - rouge = danger / erreur / menace (« REDESCENDS », « STUPIDE », « KILOMÈTRES »)
  - jaune = ressource / solution / notion clé (« L'EAU », « LITRES », « CHAUFFAGE »)
- Le point final reste collé au mot coloré et prend sa couleur.

### Textes graphiques
- Labels de cartes / schémas : même police condensée, capitales.
- Petits labels HUD : sans-serif large espacée (Montserrat Bold, letter-spacing 0.15em).

---

## 4. Éléments d'interface (HUD)

1. **Compte à rebours** — en haut à gauche : pilule noire `#1A1A1A`, bordure dorée `#C9A227` 3 px, icône horloge, gros chiffres blancs `34:36` + petit label `AVANT LA COUPURE`. Le chiffre défile en continu entre les plans (crée l'urgence).
2. **Jauge de ressource** — pilule noire « BOIS ■■■■■■ » : carrés arrondis beige/bois qui se vident ou se remplissent.
3. **Carte compteur** — carte blanche arrondie, bordure noire épaisse, ombre : « 💧 EAU STOCKÉE / **160 L** » + badge bleu `+30` qui pop.
4. **Carton de titre** — bandeau rouge « ÉPIDÉMIE ZOMBIE » (texte blanc), en dessous « JOUR 1 » énorme gris-blanc avec léger relief/ombre, puis pilule sombre « 9 H 12 » en jaune.
5. **Badges de distance** — pastilles rouges « 1 KM », « 3 KM » sur cercles pointillés rouges.

---

## 5. Bibliothèque de plans (réutilisables)

| # | Type de plan | Description |
|---|---|---|
| A | **Plan large extérieur** | montagnes en couches, rangée de sapins, chalet, tas de bois, flocons qui tombent |
| B | **Intérieur chalet** | lambris vertical, fenêtre à croisillons donnant sur la montagne, table, tasse fumante |
| C | **Gros plan objet** | téléphone tenu en main avec alerte rouge plein écran (triangle ⚠, « ALERTE D'URGENCE », « RESTEZ À L'ABRI ») ; arrière-plan flouté |
| D | **Vue de dessus (carte claire)** | neige blanche, sapins = cercles vert foncé avec motif de points blancs, route grise sinueuse, chalet rectangle, voiture rouge, traces de pas pointillées |
| E | **Carte tactique sombre** | fond noir + courbes de niveau, route en lacets, zone infectée = cercle rouge pulsant avec points rouges (zombies) et bâtiments gris, tracé pointillé blanc animé jusqu'au label vert « CHALET DE MAX » |
| F | **Infographie papier** | fond quadrillé beige, icônes (seaux ×10 → flèche → 1 L), légende en gras noir |
| G | **Schéma scientifique** | fond blueprint marine, tuyau (bordure orange `#C8763A`) avec eau bleue qui coule, puis glace qui gonfle avec flèches jaunes et « +9 % DE VOLUME » |
| H | **Action du perso** | Max qui ramasse de la neige au seau, remplit une baignoire, met une bûche dans le poêle |
| I | **Révélation menace** | plan large, colonne de fumée grise qui monte de la cheminée, cercles de détection, silhouettes de zombies noires au loin |

**Lumière d'ambiance** : intérieur = teinte chaude orangée + vignettage ; extérieur = gris froid ; scènes de danger = assombrissement + teinte rouge.

---

## 6. Animation & montage

- **Caméra** : push-in lent constant (Ken Burns 3–8 %), panoramiques latéraux, zooms rapides sur un détail, transitions par **zoom à travers** un objet ou par **flou**.
- **Particules** : neige en continu à l'extérieur, vapeur de tasse, fumée de cheminée, étincelles du poêle.
- **Motion graphics** : pop-in avec rebond (scale 0 → 1.1 → 1), compteurs qui défilent, tracés pointillés qui se dessinent, cercles rouges qui pulsent, flèches qui poussent.
- **Personnage** : animation par pantins (rotation des membres), mouvements simples et mécaniques ; visage fixe.
- **Coupes** sur la voix, souvent au milieu d'une phrase pour maintenir la tension.

---

## 7. Son

- Voix off masculine FR, débit rapide, ton grave et dramatique (type narrateur TikTok / TTS « documentaire »).
- Musique : nappe tension/suspense discrète en fond.
- Sound design : whoosh à chaque transition, « pop » sur les badges, tic-tac sur le compte à rebours, crépitement du feu, vent.

---

## 8. Structure narrative (template)

1. **Hook (0–5 s)** — injonction choc à la 2ᵉ personne : « Si une épidémie commence pendant que t'es au chalet… surtout, ne redescends pas. »
2. **Mise en contexte (5–15 s)** — alerte téléphone, carton « JOUR 1 / heure », carte de la menace.
3. **Teaser d'erreur (15–20 s)** — « Parce que sans le savoir, tu ne fais pas… une erreur très **stupide**. » → crée une boucle ouverte.
4. **Le protagoniste** — « Max a plutôt… » : on suit Max qui fait les bons choix.
5. **Compte à rebours** — déclencheur (« AVANT LA COUPURE ») qui reste à l'écran.
6. **Priorités numérotées** — « D'abord : **l'eau**. » « Ensuite : **le chauffage**. » Chaque priorité = un fait concret et chiffré (10 L de neige = 1 L d'eau ; la glace gonfle de 9 % → tuyaux qui éclatent), illustré par une infographie (plans F/G) puis l'action de Max (plan H).
7. **Retournement** — la solution crée un nouveau danger (fumée visible à des **kilomètres**).
8. **Cliffhanger** — fin ouverte / « Jour 2 » / partie suivante.

### Règles d'écriture
- Phrases de 3 à 10 mots. Une idée par plan.
- Chiffres précis et vérifiables à chaque étape (crédibilité « éducative »).
- Mots-clés colorés = 1 par phrase max.
- Connecteurs à suspense : « Parce que… », « Sauf que… », « Problème : », « Et c'est là que… ».

---

## 9. Comment je peux le reproduire

| Livrable | Méthode |
|---|---|
| **Script + découpage** | script voix off chronométré + tableau plan par plan (type de plan, HUD, sous-titres, mot coloré) |
| **Visuels fixes** | illustrations SVG dans la palette ci-dessus, ou prompts prêts à l'emploi pour un générateur d'images |
| **Vidéo animée** | composition HTML/SVG + animations (GSAP) rendue en MP4 1080×1920 via navigateur headless + ffmpeg, sous-titres et HUD inclus |
| **Voix** | nécessite un service TTS (clé API, ex. ElevenLabs) ou ta propre voix ; sinon vidéo livrée avec sous-titres + timing pour poser la voix au montage |

### Prompt type pour générateur d'images
> Flat vector illustration, 9:16 vertical, minimalist explainer animation style, thick dark outlines, muted palette (slate grey mountains with white peaks, dark green pine trees, warm brown wooden chalet, snowy white ground), soft vignette. Character: thin stickman-like figure with a big round beige face, rosy cheek, angry V-shaped eyebrows, black hoodie with a single pointed tip on top, olive backpack, navy jeans, brown boots. [SCÈNE]. No text.
