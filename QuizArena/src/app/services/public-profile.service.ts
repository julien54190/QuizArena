import { Injectable, computed, signal } from '@angular/core';
import { IUser } from '../interfaces/user';

import { DASHBOARD_BADGES, LEVEL_TITLES, XP_REQUIREMENTS } from '../data/dashboard.data';
import { HomeService } from './home.service';
import { IBadge, IPublicUserProfile, IUserActivity, IUserExperience, IUserStats } from '../interfaces/dashoard';

@Injectable({
  providedIn: 'root'
})
export class PublicProfileService {
  private currentUserId = signal<string | null>(null); // devrait venir d'un service d'auth
  private selectedUserId = signal<string | null>(null);

  constructor(private homeService: HomeService) {}

  // Computed properties
  currentUserIdSignal = computed(() => this.currentUserId());
  selectedUserIdSignal = computed(() => this.selectedUserId());

  // Méthodes publiques
  setSelectedUser(userId: string) {
    this.selectedUserId.set(userId);
  }

  clearSelectedUser() {
    this.selectedUserId.set(null);
  }

  getPublicProfile(userId: string): IPublicUserProfile | null {
    const user = this.homeService.users().find(u => String(u.id) === String(userId));
    if (!user) return null;

    const isOwnProfile = String(userId) === String(this.currentUserId());
    const stats = this.calculateUserStats(user);
    const experience = this.calculateUserExperience(user);
    const unlockedBadges = this.getUnlockedBadgesForUser(user);
    const recentActivities = this.getRecentActivitiesForUser(user);

    return {
      id: String(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      avatar: user.avatar,
      stats,
      experience,
      unlockedBadges,
      recentActivities,
      isOwnProfile,
      canEdit: isOwnProfile
    };
  }

  getSelectedUserProfile(): IPublicUserProfile | null {
    const userId = this.selectedUserId();
    if (!userId) return null;
    return this.getPublicProfile(userId);
  }

  // Méthodes utilitaires privées
  private calculateUserStats(user: IUser): IUserStats {
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
      badgesUnlocked: this.getUnlockedBadgesForUser(user).length,
      badgesTotal: DASHBOARD_BADGES.length
    };
  }

  private calculateUserExperience(user: IUser): IUserExperience {
    const level = this.calculateLevel(user.totalPlays * 10 + user.averageScore * 5);
    const currentXp = user.totalPlays * 10 + user.averageScore * 5;
    const nextLevelXp = XP_REQUIREMENTS[level + 1] || XP_REQUIREMENTS[level];
    const xpPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

    return {
      level,
      currentXp,
      nextLevelXp,
      xpPercent,
      totalXp: currentXp,
      levelTitle: LEVEL_TITLES[level] || 'Inconnu'
    };
  }

  private calculateLevel(xp: number): number {
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

  private getUnlockedBadgesForUser(user: IUser): IBadge[] {
    // Simulation des badges débloqués basée sur les statistiques de l'utilisateur
    const unlockedBadges: IBadge[] = [];

    // Badge Quiz Master (10 quiz gagnés)
    if (user.totalPlays >= 10) {
      unlockedBadges.push(DASHBOARD_BADGES.find(b => b.id === 'quiz-master')!);
    }

    // Badge Endurant (50 quiz joués)
    if (user.totalPlays >= 50) {
      unlockedBadges.push(DASHBOARD_BADGES.find(b => b.id === 'endurance')!);
    }

    // Badge Champion (score moyen 90%)
    if (user.averageScore >= 90) {
      unlockedBadges.push(DASHBOARD_BADGES.find(b => b.id === 'champion')!);
    }

    // Badge Créateur (5 quiz créés)
    if (user.quizzesCreated >= 5) {
      unlockedBadges.push(DASHBOARD_BADGES.find(b => b.id === 'creator')!);
    }

    // Badge Stratège (score moyen élevé)
    if (user.averageScore >= 80) {
      unlockedBadges.push(DASHBOARD_BADGES.find(b => b.id === 'strategist')!);
    }

    return unlockedBadges;
  }

  private getRecentActivitiesForUser(user: IUser): IUserActivity[] {
    // Simulation d'activités récentes basées sur les statistiques
    const activities: IUserActivity[] = [];
    const now = new Date();

    // Activité récente de quiz terminé
    if (user.totalPlays > 0) {
      activities.push({
        id: '1',
        type: 'quiz_completed',
        icon: 'fas fa-gamepad',
        text: `${user.firstName} a terminé un quiz avec un score de ${user.averageScore}%`,
        time: 'Il y a 2 heures',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        metadata: {
          score: user.averageScore
        }
      });
    }

    // Activité de quiz créé
    if (user.quizzesCreated > 0) {
      activities.push({
        id: '2',
        type: 'quiz_created',
        icon: 'fas fa-plus-circle',
        text: `${user.firstName} a créé un nouveau quiz`,
        time: 'Il y a 1 jour',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000)
      });
    }

    // Activité de badge débloqué
    const unlockedBadges = this.getUnlockedBadgesForUser(user);
    if (unlockedBadges.length > 0) {
      const latestBadge = unlockedBadges[0];
      activities.push({
        id: '3',
        type: 'badge_unlocked',
        icon: 'fas fa-trophy',
        text: `${user.firstName} a débloqué le badge "${latestBadge.name}"`,
        time: 'Il y a 3 jours',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        metadata: {
          badgeName: latestBadge.name
        }
      });
    }

    // Activité de progression
    activities.push({
      id: '4',
      type: 'score_improved',
      icon: 'fas fa-chart-line',
      text: `${user.firstName} a amélioré son score moyen`,
      time: 'Il y a 1 semaine',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    });

    return activities.slice(0, 4); // Limite à 4 activités
  }

  // Méthodes de tracking pour les performances
  trackByBadge(index: number, badge: IBadge): string {
    return badge.id;
  }

  trackByActivity(index: number, activity: IUserActivity): string {
    return activity.id;
  }



  getBadgeTitle(badge: IBadge): string {
    return `Badge: ${badge.name} — ${badge.hint ?? 'Badge obtenu grâce aux performances'}`;
  }
}
