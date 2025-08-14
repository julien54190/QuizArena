import { Injectable, computed } from '@angular/core';
import { IUser } from '../interfaces/user';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private homeService: HomeService) {}

  // Tous les utilisateurs
  allUsers = computed(() => this.homeService.users());

  // Utilisateurs actifs uniquement
  activeUsers = computed(() =>
    this.homeService.users().filter(user => user.status === 'active')
  );

  // Top 3 des meilleurs joueurs par score moyen
  topPlayers = computed(() => {
    return this.activeUsers()
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);
  });

  // Top 10 des joueurs les plus actifs (par nombre de parties)
  mostActivePlayers = computed(() => {
    return this.activeUsers()
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, 10);
  });

  // Top créateurs de quiz
  topQuizCreators = computed(() => {
    return this.activeUsers()
      .sort((a, b) => b.quizzesCreated - a.quizzesCreated)
      .slice(0, 5);
  });

  // Statistiques des utilisateurs
  userStats = computed(() => {
    const users = this.homeService.users();
    const activeUsers = this.activeUsers();

    return {
      total: users.length,
      active: activeUsers.length,
      suspended: users.filter(u => u.status === 'suspended').length,
      banned: users.filter(u => u.status === 'banned').length,
      averageScore: Math.round(
        activeUsers.reduce((sum, user) => sum + user.averageScore, 0) / activeUsers.length
      ),
      averagePlays: Math.round(
        activeUsers.reduce((sum, user) => sum + user.totalPlays, 0) / activeUsers.length
      ),
      averageQuizzesCreated: Math.round(
        activeUsers.reduce((sum, user) => sum + user.quizzesCreated, 0) / activeUsers.length
      )
    };
  });

  // Utilisateurs par rôle
  usersByRole = computed(() => {
    const users = this.homeService.users();
    const roles = ['user', 'moderator', 'admin'];

    return roles.map(role => ({
      role,
      count: users.filter(user => user.role === role).length,
      users: users.filter(user => user.role === role)
    }));
  });

  // Utilisateurs par plan
  usersByPlan = computed(() => {
    const users = this.homeService.users();
    const plans = ['gratuit', 'etudiant', 'entreprise'];

    return plans.map(plan => ({
      plan,
      count: users.filter(user => user.plan === plan).length,
      users: users.filter(user => user.plan === plan)
    }));
  });

  // Méthode pour obtenir l'icône de médaille selon le classement
  getMedalIcon(index: number): string {
    switch (index) {
      case 0: return '🥇'; // 1er place - Or
      case 1: return '🥈'; // 2ème place - Argent
      case 2: return '🥉'; // 3ème place - Bronze
      default: return '🏆'; // Autres places
    }
  }

  // Méthode pour obtenir le nom complet d'un utilisateur
  getFullName(user: IUser): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
