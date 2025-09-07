import { IBadge, IDashboardAction } from "../interfaces/dashoard";


export const DASHBOARD_BADGES: IBadge[] = [
  // Badges débloqués
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    icon: 'fas fa-trophy',
    hint: 'Gagner 10 quiz au total',
    category: 'achievement',
    unlocked: true,
    unlockedAt: new Date('2024-01-15'),
    requirement: 'Gagner 10 quiz'
  },
  {
    id: 'speed-runner',
    name: 'Rapide',
    icon: 'fas fa-bolt',
    hint: 'Terminer un quiz en moins de 2 minutes',
    category: 'milestone',
    unlocked: true,
    unlockedAt: new Date('2024-01-20'),
    requirement: 'Terminer un quiz en moins de 2 minutes'
  },
  {
    id: 'strategist',
    name: 'Stratège',
    icon: 'fas fa-chess-knight',
    hint: 'Réussir 5 quiz d\'affilée',
    category: 'achievement',
    unlocked: true,
    unlockedAt: new Date('2024-01-25'),
    requirement: 'Réussir 5 quiz d\'affilée'
  },
  {
    id: 'endurance',
    name: 'Endurant',
    icon: 'fas fa-heart',
    hint: 'Jouer 50 quiz',
    category: 'milestone',
    unlocked: true,
    unlockedAt: new Date('2024-02-01'),
    requirement: 'Jouer 50 quiz'
  },
  // Badges à débloquer
  {
    id: 'collector',
    name: 'Collectionneur',
    icon: 'fas fa-certificate',
    hint: 'Débloquer 10 badges',
    category: 'achievement',
    unlocked: false,
    requirement: 'Débloquer 10 badges'
  },
  {
    id: 'champion',
    name: 'Champion',
    icon: 'fas fa-medal',
    hint: 'Atteindre un score moyen de 90%',
    category: 'achievement',
    unlocked: false,
    requirement: 'Atteindre un score moyen de 90%'
  },
  {
    id: 'unbreakable',
    name: 'Incassable',
    icon: 'fas fa-shield-alt',
    hint: 'Ne jamais abandonner un quiz pendant 7 jours',
    category: 'milestone',
    unlocked: false,
    requirement: 'Ne jamais abandonner un quiz pendant 7 jours'
  },
  {
    id: 'scholar',
    name: 'Érudit',
    icon: 'fas fa-graduation-cap',
    hint: 'Réussir 20 quiz difficiles',
    category: 'achievement',
    unlocked: false,
    requirement: 'Réussir 20 quiz difficiles'
  },
  {
    id: 'creator',
    name: 'Créateur',
    icon: 'fas fa-pen-fancy',
    hint: 'Créer 5 quiz populaires',
    category: 'special',
    unlocked: false,
    requirement: 'Créer 5 quiz populaires'
  },
  {
    id: 'social',
    name: 'Social',
    icon: 'fas fa-users',
    hint: 'Partager 10 quiz avec la communauté',
    category: 'milestone',
    unlocked: false,
    requirement: 'Partager 10 quiz avec la communauté'
  }
];

export const DASHBOARD_ACTIONS: IDashboardAction[] = [
  {
    id: 'create-quiz',
    title: 'Créer un quiz',
    description: 'Créez votre propre quiz et partagez-le avec la communauté',
    icon: 'fas fa-plus-circle',
    route: 'creer-quiz',
    category: 'creation',
    available: true
  },
  {
    id: 'view-stats',
    title: 'Voir mes stats',
    description: 'Analysez vos performances et votre progression',
    icon: 'fas fa-chart-line',
    route: 'statistiques',
    category: 'analysis',
    available: true
  },
  {
    id: 'edit-profile',
    title: 'Modifier mon profil',
    description: 'Mettez à jour vos informations personnelles',
    icon: 'fas fa-user-edit',
    route: 'profil',
    category: 'profile',
    available: true
  },
  {
    id: 'manage-subscription',
    title: 'Gérer l\'abonnement',
    description: 'Passez à un plan supérieur pour plus de fonctionnalités',
    icon: 'fas fa-credit-card',
    route: 'abonnement',
    category: 'subscription',
    available: true
  },
  {
    id: 'export-data',
    title: 'Exporter mes données',
    description: 'Téléchargez vos statistiques et quiz créés',
    icon: 'fas fa-download',
    route: 'export',
    category: 'profile',
    available: false
  },
  {
    id: 'achievements',
    title: 'Mes réalisations',
    description: 'Consultez tous vos badges et récompenses',
    icon: 'fas fa-award',
    route: 'realisations',
    category: 'analysis',
    available: true
  }
];

export const LEVEL_TITLES: { [key: number]: string } = {
  1: 'Débutant',
  2: 'Apprenti',
  3: 'Élève',
  4: 'Étudiant',
  5: 'Connaisseur',
  6: 'Expert',
  7: 'Maître',
  8: 'Grand Maître',
  9: 'Légende',
  10: 'Mythique'
};

export const XP_REQUIREMENTS: { [key: number]: number } = {
  1: 0,
  2: 500,
  3: 1000,
  4: 2000,
  5: 3500,
  6: 5000,
  7: 7000,
  8: 10000,
  9: 15000,
  10: 25000
};
