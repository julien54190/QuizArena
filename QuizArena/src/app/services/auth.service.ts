import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'STANDARD' | 'STUDENT' | 'COMPANY';
  studentEmail?: string;
  school?: string;
  siret?: string;
  phone?: string;
  companyAddress?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal<boolean>(false);
  readonly currentUserEmail = signal<string>('');
  readonly jwtToken = signal<string>('');
  readonly authError = signal<string>('');

  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    const storage = this.getStorage();
    if (storage) {
      const saved = storage.getItem('qa_auth');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { email: string; token?: string };
          if (parsed?.email) {
            this.currentUserEmail.set(parsed.email);
            this.isAuthenticated.set(true);
            if (parsed.token) {
              this.jwtToken.set(parsed.token);
              try { localStorage.setItem('auth_token', parsed.token); } catch {}
            }
          }
        } catch {
          // ignore
        }
      }
      // Fallback: si un token existe déjà dans localStorage (après reload), on le remet en mémoire
      try {
        const existingToken = localStorage.getItem('auth_token');
        if (existingToken && !this.jwtToken()) {
          this.jwtToken.set(existingToken);
          this.isAuthenticated.set(true);
        }
      } catch {}
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string; token?: string }> {
    this.authError.set('');

    try {
      const response = await firstValueFrom(
        this.http.post<{ user: any; token: string }>(
          `${this.API_URL}/auth/login`,
          { email, password }
        )
      );

      if (response?.token) {
        this.currentUserEmail.set(email);
        this.isAuthenticated.set(true);
        this.jwtToken.set(response.token);
        this.persist();
        return { success: true, token: response.token };
      }

      return { success: false, message: 'Erreur de connexion' };
    } catch (error: any) {
      const message = error?.error?.message || 'Erreur de connexion';
      this.authError.set(message);
      return { success: false, message };
    }
  }

  async register(payload: RegisterPayload): Promise<{ success: boolean; message?: string; token?: string }> {
    this.authError.set('');

    try {
      const response = await firstValueFrom(
        this.http.post<any>(
          `${this.API_URL}/auth/register`,
          payload
        )
      );

      if (response?.id) {
        // Inscription réussie, on redirige vers login
        return { success: true, message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' };
      }

      return { success: false, message: 'Erreur lors de l\'inscription' };
    } catch (error: any) {
      const message = error?.error?.message || 'Erreur lors de l\'inscription';
      this.authError.set(message);
      return { success: false, message };
    }
  }

  logout(): void {
    this.currentUserEmail.set('');
    this.isAuthenticated.set(false);
    this.jwtToken.set('');
    this.authError.set('');
    const storage = this.getStorage();
    storage?.removeItem('qa_auth');
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
    } catch {}
  }

  private persist(): void {
    const storage = this.getStorage();
    storage?.setItem('qa_auth', JSON.stringify({ email: this.currentUserEmail(), token: this.jwtToken() }));
    try {
      localStorage.setItem('auth_token', this.jwtToken());
      localStorage.setItem('user_email', this.currentUserEmail());
    } catch {}
  }


  private getStorage(): Storage | null {
    try {
      return typeof globalThis !== 'undefined' && 'localStorage' in globalThis
        ? (globalThis as any).localStorage as Storage
        : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    // Renvoie le token en mémoire, sinon fallback au localStorage (utile après un rafraîchissement)
    const inMemory = this.jwtToken();
    if (inMemory) return inMemory;
    try { return localStorage.getItem('auth_token'); } catch { return null; }
  }
}
