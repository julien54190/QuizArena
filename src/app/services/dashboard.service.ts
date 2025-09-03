import { Injectable, computed, signal } from '@angular/core';
import { IUser } from '../interfaces/user';

import { DASHBOARD_BADGES, DASHBOARD_ACTIONS, LEVEL_TITLES, XP_REQUIREMENTS } from '../data/dashboard.data';
import { IBadge, IDashboardAction, IUserActivity, IUserExperience, IUserStats } from '../interfaces/dashoard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Données utilisateur (normalement viendraient d'un service d'authentification)
  private currentUserSignal = signal<IUser | null>({
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    username: 'jeandupont',
    email: 'jean.dupont@email.com',
    role: 'user',
    status: 'active',
    plan: 'gratuit',
    quizzesCreated: 5,
    totalPlays: 42,
    averageScore: 78
  });

  // Activités récentes
  private activitiesSignal = signal<IUserActivity[]>([
    {
      id: '1',
      type: 'quiz_completed',
      icon: 'fas fa-gamepad',
      text: 'Vous avez terminé le quiz "Culture Générale" avec un score de 85%',
      time: 'Il y a 2 heures',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: {
        quizName: 'Culture Générale',
        score: 85
      }
    },
    {
      id: '2',
      type: 'quiz_created',
      icon: 'fas fa-plus-circle',
      text: 'Vous avez créé un nouveau quiz "Histoire de France"',
      time: 'Il y a 1 jour',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      metadata: {
        quizName: 'Histoire de France'
      }
    },
    {
      id: '3',
      type: 'badge_unlocked',
      icon: 'fas fa-trophy',
      text: 'Félicitations ! Vous avez débloqué le badge "Quiz Master"',
      time: 'Il y a 3 jours',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      metadata: {
        badgeName: 'Quiz Master'
      }
    },
    {
      id: '4',
      type: 'score_improved',
      icon: 'fas fa-chart-line',
      text: 'Votre score moyen a augmenté de 5% ce mois-ci',
      time: 'Il y a 1 semaine',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  // Computed properties
  currentUser = computed(() => this.currentUserSignal());
  activities = computed(() => this.activitiesSignal());

  // Statistiques utilisateur
  userStats = computed(() => {
    const user = this.currentUserSignal();
    if (!user) return null;

    const level = this.calculateLevel(user.totalPlays * 10 + user.averageScore * 5);
    const currentXp = user.totalPlays * 10 + user.averageScore * 5;
    const nextLevelXp = XP_REQUIREMENTS[level + 1] || XP_REQUIREMENTS[level];
    const xpPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

    return {
      totalPlays: user.totalPlays,
      averageScore: user.averageScore,
      quizzesCreated: user.quizzesCreated,
      plan: user.plan,
      level,
      currentXp,
      nextLevelXp,
      xpPercent,
      badgesUnlocked: this.getUnlockedBadges().length,
      badgesTotal: DASHBOARD_BADGES.length
    } as IUserStats;
  });

  // Expérience utilisateur
  userExperience = computed(() => {
    const stats = this.userStats();
    if (!stats) return null;

    return {
      level: stats.level,
      currentXp: stats.currentXp,
      nextLevelXp: stats.nextLevelXp,
      xpPercent: stats.xpPercent,
      totalXp: stats.currentXp,
      levelTitle: LEVEL_TITLES[stats.level] || 'Inconnu'
    } as IUserExperience;
  });

  // Badges débloqués
  unlockedBadges = computed(() =>
    DASHBOARD_BADGES.filter(badge => badge.unlocked)
  );

  // Badges verrouillés
  lockedBadges = computed(() =>
    DASHBOARD_BADGES.filter(badge => !badge.unlocked)
  );

  // Actions disponibles
  availableActions = computed(() =>
    DASHBOARD_ACTIONS.filter(action => action.available)
  );

  // Actions par catégorie
  actionsByCategory = computed(() => {
    const actions = this.availableActions();
    const categories = ['creation', 'analysis', 'profile', 'subscription'];

    return categories.map(category => ({
      category,
      actions: actions.filter(action => action.category === category)
    }));
  });

  // Méthodes publiques
  getUnlockedBadges(): IBadge[] {
    return this.unlockedBadges();
  }

  getLockedBadges(): IBadge[] {
    return this.lockedBadges();
  }

  getAvailableActions(): IDashboardAction[] {
    return this.availableActions();
  }

  getActionsByCategory() {
    return this.actionsByCategory();
  }

  getUserStats(): IUserStats | null {
    return this.userStats();
  }

  getUserExperience(): IUserExperience | null {
    return this.userExperience();
  }

  getRecentActivities(): IUserActivity[] {
    return this.activities();
  }

  // Méthodes utilitaires
  calculateLevel(xp: number): number {
    const levels = Object.keys(XP_REQUIREMENTS).map(Number).sort((a, b) => a - b);
    let level = 1;

    for (const lvl of levels) {
      if (xp >= XP_REQUIREMENTS[lvl]) {
        level = lvl;
      } else {
        break;
      }
    }

    return level;
  }

  getBadgeTitle(badge: IBadge): string {
    if (badge.unlocked) {
      return `Débloqué: ${badge.name} — ${badge.hint ?? 'Badge obtenu grâce à vos performances'}`;
    } else {
      return `À débloquer: ${badge.name} — ${badge.hint ?? 'Atteignez l\'objectif indiqué pour débloquer ce badge'}`;
    }
  }

  // Timestamps mémorisés pour éviter les changements constants
  private memoizedTimestamps = new Map<string, string>();

  getActivityDateTime(timeString: string): string {
    // Vérifier si le timestamp est déjà mémorisé
    if (this.memoizedTimestamps.has(timeString)) {
      return this.memoizedTimestamps.get(timeString)!;
    }

    // Calculer le timestamp une seule fois
    let timestamp: number;
    const now = Date.now();

    if (timeString.includes('heures')) {
      const hours = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      timestamp = now - (hours * 60 * 60 * 1000);
    } else if (timeString.includes('jour')) {
      const days = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      timestamp = now - (days * 24 * 60 * 60 * 1000);
    } else if (timeString.includes('semaine')) {
      const weeks = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      timestamp = now - (weeks * 7 * 24 * 60 * 60 * 1000);
    } else {
      // Pour les autres cas, utiliser un timestamp fixe
      timestamp = now - (24 * 60 * 60 * 1000);
    }

    // Mémoriser le résultat
    const result = new Date(timestamp).toISOString();
    this.memoizedTimestamps.set(timeString, result);

    return result;
  }

  // Méthodes de mise à jour (pour les futures fonctionnalités)
  updateUser(user: IUser) {
    this.currentUserSignal.set(user);
  }

  addActivity(activity: IUserActivity) {
    const currentActivities = this.activitiesSignal();
    this.activitiesSignal.set([activity, ...currentActivities.slice(0, 9)]); // Garde max 10 activités
  }

  unlockBadge(badgeId: string) {
    const badge = DASHBOARD_BADGES.find(b => b.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      badge.unlockedAt = new Date();

      // Ajouter une activité
      this.addActivity({
        id: Date.now().toString(),
        type: 'badge_unlocked',
        icon: 'fas fa-trophy',
        text: `Félicitations ! Vous avez débloqué le badge "${badge.name}"`,
        time: 'À l\'instant',
        timestamp: new Date(),
        metadata: {
          badgeName: badge.name
        }
      });
    }
  }

  // Méthodes de tracking pour les performances
  trackByBadge(index: number, badge: IBadge): string {
    return badge.id;
  }

  trackByActivity(index: number, activity: IUserActivity): string {
    return activity.id;
  }

  trackByAction(index: number, action: IDashboardAction): string {
    return action.id;
  }
}
