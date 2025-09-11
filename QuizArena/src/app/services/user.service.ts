import { Injectable, computed, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { IUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private readonly api = 'http://localhost:3000';
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signal pour l'utilisateur courant
  private currentUserSignal = signal<IUser | null>(null);
  // Signal d'état d'authentification (pour éviter toute écriture dans des computed externes)
  private authenticatedSignal = signal<boolean>(false);

  // Computed property pour l'utilisateur courant
  currentUser = computed(() => this.currentUserSignal());
  isAuthenticatedSignal = computed(() => this.authenticatedSignal());

  constructor() {
    // Init rapide à partir du token pour l'affichage initial (seulement côté navigateur)
    if (this.isBrowser) {
      this.authenticatedSignal.set(!!localStorage.getItem('auth_token'));
    }
  }

  // Charger l'utilisateur courant depuis l'API
  async loadCurrentUser(): Promise<IUser | null> {
    if (!this.isBrowser) return null;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.currentUserSignal.set(null);
      this.authenticatedSignal.set(false);
      return null;
    }

    const headers = { Authorization: `Bearer ${token}` };
    try {
      const user = await (await import('rxjs')).firstValueFrom(
        this.http.get<any>(`${this.api}/auth/me`, { headers })
      );
      const mapped: IUser = {
        id: user.id,
        firstName: user.firstname || '',
        lastName: user.lastname || '',
        username: user.username || user.email?.split('@')[0] || '',
        email: user.email,
        role: (user.role || 'user').toString().toLowerCase(),
        status: (user.status || 'active').toString().toLowerCase(),
        plan: (user.plan || 'gratuit').toString().toLowerCase(),
        quizzesCreated: 0,
        totalPlays: 0,
        averageScore: 0,
        avatar: user.avatar || ''
      };
      this.currentUserSignal.set(mapped);
      this.authenticatedSignal.set(true);
      return mapped;
    } catch (error: any) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      this.currentUserSignal.set(null);
      this.authenticatedSignal.set(false);
      if (error?.status === 401) {
        this.logout();
      }
      return null;
    }
  }

  // Mettre à jour l'utilisateur courant
  updateCurrentUser(updates: Partial<IUser>): void {
    const currentUser = this.currentUserSignal();
    if (currentUser) {
      this.currentUserSignal.set({ ...currentUser, ...updates });
    }
  }

  // Déconnexion
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      // Supprime aussi l'éventuelle persistance utilisée par AuthService
      try { localStorage.removeItem('qa_auth'); } catch {}
    }
    this.currentUserSignal.set(null);
    this.authenticatedSignal.set(false);
    this.router.navigate(['/auth/connexion']);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.authenticatedSignal();
  }

  // Obtenir l'email de l'utilisateur connecté
  getCurrentUserEmail(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('user_email');
  }
}
