import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AdminOverview {
  users: number;
  quizzes: number;
  sessions: number;
}

export interface RecentUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface RecentQuiz {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: {
    firstname: string;
    lastname: string;
    username: string;
  };
}

export interface RecentActions {
  recentUsers: RecentUser[];
  recentQuizzes: RecentQuiz[];
}

export interface AdminUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

export interface UpdateUserDto {
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  role?: string;
  status?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
}

export interface AdminQuiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
  _count: {
    questions: number;
    sessions: number;
  };
}

export interface QuizStats {
  totalQuizzes: number;
  publicQuizzes: number;
  privateQuizzes: number;
  totalQuestions: number;
  totalSessions: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/admin';

  // Signals pour le cache des données
  private overviewSignal = signal<AdminOverview | null>(null);
  private recentActionsSignal = signal<RecentActions | null>(null);
  private usersSignal = signal<AdminUser[]>([]);
  private userStatsSignal = signal<UserStats | null>(null);
  private quizzesSignal = signal<AdminQuiz[]>([]);
  private quizStatsSignal = signal<QuizStats | null>(null);

  // Computed signals pour l'accès aux données
  overview = computed(() => this.overviewSignal());
  recentActions = computed(() => this.recentActionsSignal());
  users = computed(() => this.usersSignal());
  userStats = computed(() => this.userStatsSignal());
  quizzes = computed(() => this.quizzesSignal());
  quizStats = computed(() => this.quizStatsSignal());

  async getOverview(): Promise<AdminOverview> {
    const data = await firstValueFrom(this.http.get<AdminOverview>(`${this.baseUrl}/overview`));
    this.overviewSignal.set(data);
    return data;
  }

  async getRecentActions(): Promise<RecentActions> {
    const data = await firstValueFrom(this.http.get<RecentActions>(`${this.baseUrl}/recent-actions`));
    this.recentActionsSignal.set(data);
    return data;
  }

  async deleteRecentUser(userId: string): Promise<{ message: string }> {
    const result = await firstValueFrom(this.http.delete<{ message: string }>(`${this.baseUrl}/user/${userId}`));
    // Recharger les données après suppression
    await this.getRecentActions();
    return result;
  }

  async deleteRecentQuiz(quizId: string): Promise<{ message: string }> {
    const result = await firstValueFrom(this.http.delete<{ message: string }>(`${this.baseUrl}/quiz/${quizId}`));
    // Recharger les données après suppression
    await this.getRecentActions();
    return result;
  }

  // Gestion des utilisateurs
  async getUsers(): Promise<AdminUser[]> {
    const data = await firstValueFrom(this.http.get<AdminUser[]>(`${this.baseUrl}/users`));
    this.usersSignal.set(data);
    this.updateUserStats(data);
    return data;
  }

  async createUser(userData: CreateUserDto): Promise<{ message: string; user: AdminUser }> {
    const result = await firstValueFrom(this.http.post<{ message: string; user: AdminUser }>(`${this.baseUrl}/users`, userData));
    // Recharger la liste des utilisateurs
    await this.getUsers();
    return result;
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<{ message: string; user: AdminUser }> {
    const result = await firstValueFrom(this.http.put<{ message: string; user: AdminUser }>(`${this.baseUrl}/users/${id}`, userData));
    // Recharger la liste des utilisateurs
    await this.getUsers();
    return result;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await firstValueFrom(this.http.delete<{ message: string }>(`${this.baseUrl}/users/${id}`));
    // Recharger la liste des utilisateurs
    await this.getUsers();
    return result;
  }

  async suspendUser(id: string): Promise<{ message: string }> {
    const result = await firstValueFrom(this.http.put<{ message: string }>(`${this.baseUrl}/users/${id}/suspend`, {}));
    // Recharger la liste des utilisateurs
    await this.getUsers();
    return result;
  }

  async banUser(id: string): Promise<{ message: string }> {
    const result = await firstValueFrom(this.http.put<{ message: string }>(`${this.baseUrl}/users/${id}/ban`, {}));
    // Recharger la liste des utilisateurs
    await this.getUsers();
    return result;
  }

  async activateUser(id: string): Promise<{ message: string }> {
    const result = await firstValueFrom(this.http.put<{ message: string }>(`${this.baseUrl}/users/${id}/activate`, {}));
    // Recharger la liste des utilisateurs
    await this.getUsers();
    return result;
  }

  private updateUserStats(users: AdminUser[]): void {
    const stats: UserStats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'ACTIVE').length,
      adminUsers: users.filter(u => u.role === 'ADMIN').length,
      suspendedUsers: users.filter(u => u.status === 'SUSPENDED').length,
      bannedUsers: users.filter(u => u.status === 'BANNED').length,
    };
    this.userStatsSignal.set(stats);
  }

  private updateQuizStats(quizzes: AdminQuiz[]): void {
    const stats: QuizStats = {
      totalQuizzes: quizzes.length,
      publicQuizzes: quizzes.filter(q => q.isPublic).length,
      privateQuizzes: quizzes.filter(q => !q.isPublic).length,
      totalQuestions: quizzes.reduce((sum, q) => sum + q._count.questions, 0),
      totalSessions: quizzes.reduce((sum, q) => sum + q._count.sessions, 0),
    };
    this.quizStatsSignal.set(stats);
  }

  // Méthodes pour recharger les données
  async refreshOverview(): Promise<void> {
    await this.getOverview();
  }

  async refreshRecentActions(): Promise<void> {
    await this.getRecentActions();
  }

  async refreshUsers(): Promise<void> {
    await this.getUsers();
  }

  // Gestion des quizzes
  async getQuizzes(): Promise<AdminQuiz[]> {
    const data = await firstValueFrom(this.http.get<AdminQuiz[]>(`${this.baseUrl}/quizzes`));
    this.quizzesSignal.set(data);
    this.updateQuizStats(data);
    return data;
  }

  async deleteQuiz(id: string): Promise<{ message: string }> {
    const result = await firstValueFrom(this.http.delete<{ message: string }>(`${this.baseUrl}/quizzes/${id}`));
    // Recharger la liste des quizzes
    await this.getQuizzes();
    return result;
  }

  async suspendQuiz(id: string): Promise<{ message: string }> {
    const result = await firstValueFrom(this.http.put<{ message: string }>(`${this.baseUrl}/quizzes/${id}/suspend`, {}));
    // Recharger la liste des quizzes
    await this.getQuizzes();
    return result;
  }

  async activateQuiz(id: string): Promise<{ message: string }> {
    const result = await firstValueFrom(this.http.put<{ message: string }>(`${this.baseUrl}/quizzes/${id}/activate`, {}));
    // Recharger la liste des quizzes
    await this.getQuizzes();
    return result;
  }

  async refreshQuizzes(): Promise<void> {
    await this.getQuizzes();
  }
}
