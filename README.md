### QuizArena

Application complète de quiz avec un backend NestJS (API + Prisma) et un frontend Angular (SPA/SSR). Elle permet l’authentification, la gestion des quiz, questions, catégories, badges et des sessions de quiz multi-joueurs.

### Fonctionnalités principales
- **Authentification JWT**: inscription/connexion, rôles (admin/utilisateur)
- **Gestion des quiz**: création, édition, suppression, publication
- **Questions**: création, options de réponses, validation
- **Catégories**: organisation des quiz par thèmes
- **Badges & expérience**: attribution de badges et XP selon les performances
- **Sessions de quiz**: création, participation, suivi des scores

### Prérequis
- **Node.js** 18+ (recommandé LTS)
- **npm** 9+
- **Base de données**: PostgreSQL (via Prisma)

### Installation (monorepo)
1. Installer les dépendances backend et frontend
```bash
cd "backend" && npm install
cd "../QuizArena" && npm install
```

2. Configurer l’environnement du backend
- Créer un fichier `.env` dans `backend/` avec au minimum:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
JWT_SECRET="votre_secret_jwt"
```

3. Préparer la base de données (Prisma)
```bash
cd "backend"
npx prisma migrate dev
npx prisma generate
```

4. (Optionnel) Seeder des données
```bash
# Créer un administrateur (si script disponible)
npm run seed:admin
# Autres seeds éventuels: voir `backend/src/scripts/*`
```

### Lancer en développement
- Backend (NestJS)
```bash
cd "backend"
npm run start:dev
# Par défaut: http://localhost:3000
```

- Frontend (Angular)
```bash
cd "QuizArena"
npm start
# Par défaut: http://localhost:4200
```

### Build et exécution en production
- Backend
```bash
cd "backend"
npm run build
npm run start:prod
```

- Frontend (SPA)
```bash
cd "QuizArena"
npm run build
# Les fichiers seront générés dans `dist/`
```

- Frontend (SSR, si souhaité)
```bash
cd "QuizArena"
npm run build
npm run serve:ssr:QuizArena
```

### Structure du projet
- `backend/`: API NestJS, Prisma, scripts
- `QuizArena/`: application Angular (client)

### Dépannage rapide
- Vérifiez que `DATABASE_URL` est correcte et accessible
- Après modification du schéma Prisma, relancer `npx prisma migrate dev`
- Ports par défaut: backend `3000`, frontend `4200`
