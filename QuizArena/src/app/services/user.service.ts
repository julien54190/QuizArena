import { Injectable, computed, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private readonly api = 'http://localhost:3000';

  // Etat réactif d'authentification
  private _isAuth = signal<boolean>(false);
  isAuthenticatedSignal() { return this._isAuth(); }

  // Signal pour l'utilisateur courant
  private currentUserSignal = signal<IUser | null>(null);

  // Computed property pour l'utilisateur courant
  currentUser = computed(() => this.currentUserSignal());

  // Charger l'utilisateur courant depuis l'API
  async loadCurrentUser(): Promise<IUser | null> {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('auth_token') : null;
    if (!token) {
      this.currentUserSignal.set(null);
      this._isAuth.set(false);
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
      this._isAuth.set(true);
      return mapped;
    } catch (error: any) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      this.currentUserSignal.set(null);
      if (error?.status === 401 && isPlatformBrowser(this.platformId)) {
        // Token invalide/expiré: nettoyer silencieusement sans rediriger
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
      }
      this._isAuth.set(false);
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
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
    }
    this.currentUserSignal.set(null);
    this._isAuth.set(false);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    // Par défaut: non authentifié côté serveur
    if (!isPlatformBrowser(this.platformId)) return false;
    // Côté client: on se base sur l'état réactif mis à jour par loadCurrentUser()/logout()
    return this._isAuth();
  }

  // Obtenir l'email de l'utilisateur connecté
  getCurrentUserEmail(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('user_email') : null;
  }
}
