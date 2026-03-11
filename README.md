# TechAssist — Site de services tech + Dashboard admin

Site vitrine professionnel + dashboard de gestion pour technicien informatique freelance.

**Stack** : Next.js 14 · Tailwind CSS · Prisma · PostgreSQL · Resend

---

## Fonctionnalités

### Site public (`/`)
- Page d'accueil avec hero, services & tarifs, processus, avis clients
- Formulaire de commande (nom, email, service, description)
- Design dark tech, responsive mobile-first

### Dashboard admin (`/admin`)
- Authentification par mot de passe
- Liste de toutes les commandes avec filtres par statut
- Changement de statut en un clic (En attente / En cours / Terminé / Payé)
- Envoi d'email de réponse au client (via Resend)
- Statistiques : total commandes, CA encaissé, CA potentiel, taux de conversion

### API
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/commande` | Créer une commande (public) |
| `GET` | `/api/commandes` | Lister toutes les commandes (admin) |
| `PATCH` | `/api/commande/:id` | Mettre à jour le statut (admin) |
| `POST` | `/api/envoyer-email` | Envoyer un email client (admin) |
| `POST` | `/api/admin/login` | Connexion admin |
| `POST` | `/api/admin/logout` | Déconnexion admin |

---

## Déploiement sur Vercel en 10 minutes

### Étape 1 — Créer la base de données PostgreSQL (gratuit)

**Option A : Neon (recommandé)**
1. Allez sur [neon.tech](https://neon.tech) → Créez un compte gratuit
2. Créez un nouveau projet → Copiez la **Connection string** (format `postgresql://...`)

**Option B : Vercel Postgres**
1. Dans votre dashboard Vercel → Storage → Create Database → Postgres
2. Copiez la variable `DATABASE_URL` générée automatiquement

### Étape 2 — Configurer Resend (emails gratuits)

1. Allez sur [resend.com](https://resend.com) → Créez un compte gratuit
2. Settings → API Keys → Create API Key → Copiez la clé
3. Domains → Add Domain → Vérifiez votre domaine (ou utilisez `onboarding@resend.dev` pour tester)

### Étape 3 — Déployer sur Vercel

1. **Fork / importez** ce repo dans votre compte GitHub

2. Allez sur [vercel.com](https://vercel.com) → New Project → Importez le repo

3. Dans **Environment Variables**, ajoutez :

   | Variable | Valeur |
   |----------|--------|
   | `DATABASE_URL` | `postgresql://...` (depuis Neon ou Vercel Postgres) |
   | `ADMIN_PASSWORD` | Votre mot de passe admin |
   | `SESSION_SECRET` | Une chaîne aléatoire longue (ex: `openssl rand -base64 32`) |
   | `RESEND_API_KEY` | `re_xxxxx` (depuis Resend) |
   | `RESEND_FROM_EMAIL` | `TechAssist <contact@votredomaine.fr>` |
   | `NEXT_PUBLIC_CONTACT_EMAIL` | `contact@votredomaine.fr` |

4. Cliquez sur **Deploy**

### Étape 4 — Initialiser la base de données

Après le premier déploiement, exécutez en local :

```bash
# 1. Clonez le repo et installez les dépendances
git clone https://github.com/votre-username/tech-services.git
cd tech-services
npm install

# 2. Créez votre fichier .env.local (copiez .env.example)
cp .env.example .env.local
# Remplissez DATABASE_URL avec votre URL de prod Neon/Vercel

# 3. Poussez le schéma en base
npm run db:push

# Ou utilisez les migrations (recommandé pour la prod) :
npm run db:migrate
```

Votre site est maintenant en ligne ! 🎉

---

## Développement local

### Prérequis
- Node.js 18+
- PostgreSQL local **ou** une URL Neon/Supabase gratuite

### Installation

```bash
# 1. Cloner et installer
git clone ...
cd tech-services
npm install

# 2. Configurer l'environnement
cp .env.example .env.local
# Éditez .env.local avec vos valeurs

# 3. Initialiser la base de données
npm run db:push

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) — le site est prêt.
Dashboard admin : [http://localhost:3000/admin](http://localhost:3000/admin)

### Commandes utiles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run db:studio    # Interface Prisma Studio (visualiser la BDD)
npm run db:push      # Synchroniser le schéma sans migration
npm run db:migrate   # Créer et appliquer une migration
```

---

## Personnalisation

### Modifier les services et prix
Éditez le fichier `lib/services.ts` :
```typescript
export const SERVICES = [
  {
    id: 'installation-logiciel',
    nom: 'Installation logiciel',
    prix: 10,          // ← Modifier le prix ici
    // ...
  },
  // Ajoutez vos propres services
]
```

### Modifier les textes du site
- **Hero** : `components/Hero.tsx`
- **Services** : `components/Services.tsx` + `lib/services.ts`
- **Process** : `components/HowItWorks.tsx`
- **Avis** : `components/Reviews.tsx`
- **Footer** : `components/Footer.tsx`

### Changer les couleurs
Éditez `tailwind.config.ts` → couleur `brand` (actuellement bleu `#3b82f6`)

---

## Sécurité

- Le mot de passe admin est stocké uniquement en variable d'environnement
- Le cookie de session est `HttpOnly` (non accessible en JavaScript)
- Toutes les routes admin sont protégées côté serveur ET dans le middleware
- Validation des entrées utilisateur sur toutes les routes API
- Les données client ne sont jamais exposées sans authentification

---

## Architecture

```
/
├── app/
│   ├── page.tsx                    # Site vitrine public
│   ├── admin/
│   │   ├── page.tsx                # Dashboard (Server Component)
│   │   └── login/page.tsx          # Page de connexion
│   └── api/
│       ├── commande/route.ts       # POST — créer commande
│       ├── commande/[id]/route.ts  # PATCH — modifier statut
│       ├── commandes/route.ts      # GET — lister commandes
│       ├── envoyer-email/route.ts  # POST — envoyer email
│       └── admin/
│           ├── login/route.ts      # POST — authentification
│           └── logout/route.ts     # POST — déconnexion
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── HowItWorks.tsx
│   ├── Reviews.tsx
│   ├── OrderForm.tsx
│   ├── Footer.tsx
│   └── admin/
│       ├── AdminDashboard.tsx      # Dashboard client component
│       └── EmailModal.tsx          # Modal envoi email
├── lib/
│   ├── db.ts                       # Singleton Prisma client
│   ├── auth.ts                     # Fonctions d'authentification
│   └── services.ts                 # Liste des services & prix
├── prisma/
│   └── schema.prisma               # Schéma de la BDD
├── middleware.ts                   # Protection des routes admin
├── .env.example                    # Variables d'environnement
└── vercel.json                     # Configuration Vercel
```

---

## Licence

Projet personnel — libre d'utilisation et de modification.
