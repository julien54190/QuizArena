import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { UserService } from './user.service';

import { DASHBOARD_BADGES, DASHBOARD_ACTIONS, LEVEL_TITLES, XP_REQUIREMENTS } from '../data/dashboard.data';
import { IBadge, IDashboardAction, IUserActivity, IUserExperience, IUserStats } from '../interfaces/dashoard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private readonly api = 'http://localhost:3000';

  // Données utilisateur (chargées depuis l'API)
  private currentUserSignal = signal<IUser | null>(null);

  // Activités récentes
  private activitiesSignal = signal<IUserActivity[]>([]);

  // Computed properties
  currentUser = computed(() => this.userService.currentUser());
  activities = computed(() => this.activitiesSignal());

  // Statistiques utilisateur
  userStats = computed(() => {
    const user = this.currentUser();
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
  async loadFromApi(): Promise<void> {
    if (!this.userService.isAuthenticated()) {
      return;
    }

    // S'assurer que l'utilisateur courant est chargé avant de calculer des stats
    await this.userService.loadCurrentUser();

    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } as any : undefined;
    const { firstValueFrom } = await import('rxjs');

    try {
      const [stats, myBadges, sessions, myQuizzes] = await Promise.all([
        firstValueFrom(this.http.get<any>(`${this.api}/quiz-session/my-stats`, { headers })),
        firstValueFrom(this.http.get<any[]>(`${this.api}/badge/my-badges`, { headers })),
        firstValueFrom(this.http.get<any[]>(`${this.api}/quiz-session/my-sessions`, { headers })),
        firstValueFrom(this.http.get<any[]>(`${this.api}/quiz/my-quizzes`, { headers })),
      ]);

      // Mettre à jour stats utilisateur
      this.userService.updateCurrentUser({
        totalPlays: stats?.totalSessions ?? 0,
        averageScore: Math.round(stats?.averageScore ?? 0),
        quizzesCreated: Array.isArray(myQuizzes) ? myQuizzes.length : 0,
      });

      // Badges
      const unlockedIds = new Set((myBadges || []).map(b => String(b.id)));
      for (const b of DASHBOARD_BADGES) {
        (b as any).unlocked = unlockedIds.has(String(b.id));
      }

      // Activités
      const completedActivities: IUserActivity[] = (sessions || []).slice(0, 10).map((s: any, idx: number) => ({
        id: `completed-${String(s.id ?? idx)}`,
        type: 'quiz_completed',
        icon: 'fas fa-gamepad',
        text: `Vous avez terminé le quiz "${s.quiz?.title ?? 'Quiz'}" avec un score de ${Math.round(s.score ?? 0)}%`,
        time: new Date(s.endTime ?? s.startTime ?? Date.now()).toLocaleString(),
        timestamp: new Date(s.endTime ?? s.startTime ?? Date.now()),
        metadata: { quizName: s.quiz?.title ?? 'Quiz', score: Math.round(s.score ?? 0) }
      }));

      const createdActivities: IUserActivity[] = (myQuizzes || []).slice(0, 10).map((q: any, idx: number) => ({
        id: `created-${String(q.id ?? idx)}`,
        type: 'quiz_created',
        icon: 'fas fa-plus-circle',
        text: `Vous avez créé le quiz "${q.title ?? 'Nouveau quiz'}"`,
        time: new Date(q.createdAt ?? Date.now()).toLocaleString(),
        timestamp: new Date(q.createdAt ?? Date.now()),
        metadata: { quizName: q.title ?? 'Quiz' }
      }));

      const all = [...completedActivities, ...createdActivities]
        .sort((a, b) => (b.timestamp as any) - (a.timestamp as any))
        .slice(0, 10);
      this.activitiesSignal.set(all);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    }
  }
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
