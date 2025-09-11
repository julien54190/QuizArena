# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-09-11

## [0.21.1] - 2025-09-11

### 📚 Documentation

- *(readme)* :memo: ajout du README.md

## [0.21.0] - 2025-09-11

### 🚀 Features

- *(admin)* :sparkles: preparation connexion gaurd et backend pour admin
- *(admin)* :sparkles: finition partie admin principal a l'utilisation

## [0.20.2] - 2025-09-10

### 🐛 Bug Fixes

- *(back/front)* :bug: correction des bug de connexion entre le back et le front

## [0.20.1] - 2025-09-08

### ⚙️ Miscellaneous Tasks

- *(seed)* Ajout des seed et migration bdd

## [0.20.0] - 2025-09-08

### 🚀 Features

- *(back/quiz)* :sparkles: Back : implementation quiz
- *(back/quiz)* :sparkles: Back : implementation question
- *(back/quiz)* :sparkles: Back : implementation badges
- *(back/quiz)* :sparkles: Back : implementation quizz-session
- *(back/quiz)* :sparkles: Back : implementation experience
- *(back/quiz)* :sparkles: Back : implementation category

## [0.19.0] - 2025-09-07

### 🚀 Features

- *(back/auth)* :sparkles: Back : modèle Back : POST /auth/register (hash password avec bcrypt)
- *(back/auth)* :sparkles: Back : POST /auth/login (JWT signé)
- *(back/auth)* :sparkles: Back : Guard JwtAuthGuard pour routes protégées
- *(auth)* :sparkles: front connexion  back front

## [0.18.0] - 2025-09-04

### 🚀 Features

- *(auth)* :sparkles: stocker le JWT (localStorage) avec ajout auth.interceptor
- *(auth)* :sparkles: Front : Guard pour routes protégées
- *(back/auth)* :sparkles: Back : modèle User avec Prisma

## [0.17.0] - 2025-09-04

### 🚀 Features

- *(auth)* :sparkles: ajout du formulaire inscription
- *(auth)* :sparkles: ajout du formulaire connexion
- *(auth)* :sparkles: ajout du seo connexion et inscription
- *(auth)* :sparkles: AuthService avec register() et login()

### 💼 Other

- *(auth)* :wheelchair: ajout accessibilite  connexion et inscription

### 🎨 Styling

- *(auth)* :lipstick: style pour la page connexion

## [0.16.0] - 2025-09-03

### 🚀 Features

- *(user)* :sparkles: ajout partie abonnement user

### 🐛 Bug Fixes

- *(user/routes,et recharge date contunue dashboard)* :bug: amelioration et correction des route pour user, et erreur de charment date dans Dashbord.service

### 💼 Other

- *(user)* :wheelchair: ajout accessibilite  partie abonement user

### 🎨 Styling

- *(user)* :lipstick: ajout style  partie abonement user

## [0.15.0] - 2025-09-03

### 🚀 Features

- *(user)* :sparkles: ajout partie creer quiz user

### 💼 Other

- *(user)* :wheelchair: ajout accessibilite  partie create quiz user

### 🎨 Styling

- *(user)* :lipstick: ajout style  partie create quizz user
- *(sidebar)* :lipstick: amélioration responsive sideBar

## [0.14.0] - 2025-09-03

### 🚀 Features

- *(user)* :sparkles: ajout partie modification user
- *(user/seo)* :sparkles: ajout seo  partie modification user et dashboard user

### 💼 Other

- *(user)* :wheelchair: ajout accessibilite  partie modification user

### 🎨 Styling

- *(user)* :lipstick: ajout style  partie modification user

## [0.13.0] - 2025-08-23

### 🚀 Features

- *(user)* :sparkles: ajout affichage du profil d'un utilisteur par un autre

## [0.12.0] - 2025-08-23

### 🚀 Features

- *(user)* :sparkles: ajout du dashboard

### 🐛 Bug Fixes

- *(user)* :bug: correction faute de frappe dans une classe css

### 💼 Other

- *(user)* :wheelchair: ajout de l'accessibilité pour le dashboard

### 🚜 Refactor

- *(user)* :recycle: partage en interface/service et data

### 🎨 Styling

- *(user)* :lipstick: ajout du style dashboard

## [0.11.0] - 2025-08-22

### 🚀 Features

- *(user)* :sparkles: ajout de la side-bar pour les utilisateur

### 💼 Other

- *(sidebar)* :wheelchair: ajout de l'accessibilité

### 🎨 Styling

- *(sidebar)* :lipstick: ajout du style et du responsive

## [0.10.0] - 2025-08-20

### 🚀 Features

- *(seo)* :sparkles: ajout du seo pour acceuil et quiz

## [0.9.0] - 2025-08-20

### 🚀 Features

- *(home/play)* :sparkles: connection quiz populaire au quiz

### 🧪 Testing

- :test_tube: ajout des test partie play  et correction du code

## [0.8.0] - 2025-08-19

### 🚀 Features

- *(play)* :sparkles: ajout de la partie pour repondre au quiz

### 🐛 Bug Fixes

- *(play)* :bug: correction ou ca arriver a 11/10 pour les question quand affichage resultat
- *(play)* :bug: correction du style sur mobile

### 💼 Other

- *(play)* :wheelchair: ajout de l'accessibiliter pour la partie repondre au quiz

### 🎨 Styling

- *(play)* :lipstick: mise en forme de la partie repondre au quiz

## [0.7.0] - 2025-08-17

### 🚀 Features

- *(play)* :sparkles: ajout de la partie catégotie
- *(play)* :sparkles: ajout des quizz par catégorie

### 💼 Other

- *(play)* :wheelchair: ajout de la partie Accessibilité pour choisir categorie
- *(play)* :wheelchair: ajout de la partie Accessibilité pour les quizz dans categorie

### 🎨 Styling

- *(play)* :lipstick: ajout style pour les catégories
- *(play)* :lipstick: ajout style pour les quizz dans catégorie

## [0.5.2] - 2025-08-14

### 🧪 Testing

- :test_tube: ajout des test et correction du code

## [0.5.1] - 2025-08-14

### 🚜 Refactor

- *(service)* :recycle: refactorisation du code en utilisant les service

## [0.5.0] - 2025-08-14

### 🚀 Features

- *(home)* :sparkles: ajout bouton jouer avec sotn style et sont accessibilité

## [0.4.0] - 2025-08-14

### 🚀 Features

- *(home)* :sparkles: Ajout de la partie statistiques
- *(home)* :sparkles: Ajouts des quiz populaire et du systeme de recherche

### 💼 Other

- *(home)* :wheelchair: ajout Accessibilité pour les stat
- *(home)* :wheelchair: ajout de l'Accessibilité Quiz populaire
- *(home)* :wheelchair: ajout Accessibilité pour best players

### 🎨 Styling

- *(home)* :lipstick: style des card statistique
- *(home)* :lipstick: style des pour les quiz populaire

## [0.3.0] - 2025-08-10

### 🚀 Features

- *(header)* Structure du header
- *(footer)* :sparkles: structure footer
- *(home)* :sparkles: barre de recherche + filtres

### 💼 Other

- *(header)* Focus header
- *(footer)* :wheelchair: liens descriptifs
- *(headerr)* :wheelchair: liens descriptifs
- *(home)* :wheelchair: ajout de l'Accessibilité bar de recherche

### 📚 Documentation

- *(changelog)* VX.Y.Z

### 🎨 Styling

- *(header)* Responsive + menu-burger ajout de fa-icon
- *(footer)* :lipstick: mise en place du style  + responsive
- *(home)* :lipstick: mise en forme de la barre de recherche et de la couleur de fond de la page

### ⚙️ Miscellaneous Tasks

- *(changelog)* Update for v0.2.0
- Modification du cliff.toml

### 💼 Other

- Release vX.Y.Z

### 📚 Documentation

- *(changelog)* VX.Y.Z

<!-- generated by git-cliff -->
