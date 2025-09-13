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


### Configuration SSL pour production

#### 1. **Certificat SSL (Let's Encrypt recommandé)**
```bash
# Installation Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Génération du certificat
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 2. **Configuration Nginx (exemple)**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    # Configuration SSL sécurisée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de sécurité
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Proxy vers l'application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3. **Variables d'environnement production**
```bash
# backend/.env.production
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
JWT_SECRET="votre-secret-jwt-tres-long-et-securise"
PORT=3000
```

#### 4. **Déploiement avec PM2**
```bash
# Installation PM2
npm install -g pm2

# Configuration PM2
pm2 start dist/main.js --name "quizarena-backend"
pm2 startup
pm2 save
```

### Dépannage rapide
- Vérifiez que `DATABASE_URL` est correcte et accessible
- Après modification du schéma Prisma, relancer `npx prisma migrate dev`
- Ports par défaut: backend `3000`, frontend `4200`
- **SSL** : Vérifiez la validité du certificat avec `openssl x509 -in cert.pem -text -noout`
