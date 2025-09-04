import { Injectable, signal } from '@angular/core';

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'standard' | 'student' | 'company';
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

  constructor() {
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
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string; token?: string }>
  {
    // Démo débutant: on accepte tout email/password non vides après une petite attente
    await this.delay(400);
    if (!email || !password) {
      return { success: false, message: 'Email ou mot de passe manquant' };
    }
    // Mini validation pour pouvoir afficher un message d'erreur côté UI
    const isEmailValid = /.+@.+\..+/.test(email);
    const isPasswordValid = password.length >= 6;
    if (!isEmailValid || !isPasswordValid) {
      return { success: false, message: 'Adresse e-mail ou mot de passe incorrect' };
    }
    // Démo: on simule un JWT
    const token = this.generateMockJwt(email);
    this.currentUserEmail.set(email);
    this.isAuthenticated.set(true);
    this.jwtToken.set(token);
    this.persist();
    return { success: true, token };
  }

  async register(payload: RegisterPayload): Promise<{ success: boolean; message?: string; token?: string }>
  {
    await this.delay(500);
    if (!payload.email || !payload.password || !payload.firstname || !payload.lastname) {
      return { success: false, message: 'Champs requis manquants' };
    }
    // Démo: on considère l'inscription réussie et on connecte l'utilisateur
    // Démo: on simule un JWT
    const token = this.generateMockJwt(payload.email);
    this.currentUserEmail.set(payload.email);
    this.isAuthenticated.set(true);
    this.jwtToken.set(token);
    this.persist();
    return { success: true, token };
  }

  logout(): void {
    this.currentUserEmail.set('');
    this.isAuthenticated.set(false);
    this.jwtToken.set('');
    const storage = this.getStorage();
    storage?.removeItem('qa_auth');
  }

  private persist(): void {
    const storage = this.getStorage();
    storage?.setItem('qa_auth', JSON.stringify({ email: this.currentUserEmail(), token: this.jwtToken() }));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    return this.jwtToken() || null;
  }

  private generateMockJwt(email: string): string {
    // Simple token factice pour démo uniquement
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: email, iat: Date.now() / 1000 }));
    const signature = 'mock-signature';
    return `${header}.${payload}.${signature}`;
  }
}


