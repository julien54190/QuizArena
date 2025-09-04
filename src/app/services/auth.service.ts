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

  constructor() {
    const storage = this.getStorage();
    if (storage) {
      const saved = storage.getItem('qa_auth');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { email: string };
          if (parsed?.email) {
            this.currentUserEmail.set(parsed.email);
            this.isAuthenticated.set(true);
          }
        } catch {
          // ignore
        }
      }
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }>
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
    this.currentUserEmail.set(email);
    this.isAuthenticated.set(true);
    this.persist();
    return { success: true };
  }

  async register(payload: RegisterPayload): Promise<{ success: boolean; message?: string }>
  {
    await this.delay(500);
    if (!payload.email || !payload.password || !payload.firstname || !payload.lastname) {
      return { success: false, message: 'Champs requis manquants' };
    }
    // Démo: on considère l'inscription réussie et on connecte l'utilisateur
    this.currentUserEmail.set(payload.email);
    this.isAuthenticated.set(true);
    this.persist();
    return { success: true };
  }

  logout(): void {
    this.currentUserEmail.set('');
    this.isAuthenticated.set(false);
    const storage = this.getStorage();
    storage?.removeItem('qa_auth');
  }

  private persist(): void {
    const storage = this.getStorage();
    storage?.setItem('qa_auth', JSON.stringify({ email: this.currentUserEmail() }));
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
}


