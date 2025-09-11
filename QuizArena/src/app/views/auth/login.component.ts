import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule],
  template: `
  <div class="home-container">
  <div class="home-content p-10">
    <header class="text-center mb-20">
      <h1 id="login-title" class="text-xlg text-bold mb-10">Se connecter</h1>
      <p class="text-sm">Ravi de vous revoir</p>
    </header>

    <section class="card card-shadow mt-20">
      <h2 class="text-lg text-bold mb-20">Identifiants</h2>

      <form class="flex flex-col gap-16" aria-labelledby="login-title" (submit)="onSubmit($event)">
        <div class="field w-full">
          <label for="email">Adresse e-mail</label>
          <input #emailRef class="w-full p-12 radius" id="email" name="email" type="email" autocomplete="email" placeholder="exemple@domaine.com" required (input)="touchedEmail.set(true)" (blur)="touchedEmail.set(true)" (keydown.enter)="onLogin(emailRef.value, passwordRef.value)" [style.borderColor]="touchedEmail() && !(emailRef?.value?.trim()) ? 'var(--danger)' : undefined">
          @if (touchedEmail() && !(emailRef?.validity?.valid)) {
            <p class="error">Veuillez renseigner une adresse e-mail valide.</p>
          }
        </div>

        <div class="field w-full">
          <label for="password">Mot de passe</label>
          <input #passwordRef class="w-full p-12 radius" id="password" name="password" type="password" autocomplete="current-password" placeholder="********" required (input)="touchedPassword.set(true)" (blur)="touchedPassword.set(true)" (keydown.enter)="onLogin(emailRef.value, passwordRef.value)" [style.borderColor]="touchedPassword() && !passwordRef.value.trim() ? 'var(--danger)' : undefined">
          @if (touchedPassword() && !passwordRef.value.trim()) {
            <p class="error">Le mot de passe est requis.</p>
          }
        </div>

        @if (authError()) {
          <div class="error">{{ authError() }}</div>
        }

        <div class="mt-20">
          <button class="btn btn-primary py-12 px-24 w-full" type="button" (click)="onLogin(emailRef.value, passwordRef.value)" [disabled]="!(emailRef?.value?.trim()) || !(passwordRef?.value?.trim())">Connexion</button>
        </div>

        <div class="flex justify-content-center align-items-center gap-12 mt-20">
          <span class="text-sm xs-text-normal">Pas de compte ?</span>
          <a class="btn btn-outline-primary py-12 px-24 radius" routerLink="/auth/inscription">Créer un compte</a>
        </div>
      </form>
    </section>
  </div>
  </div>
  `,
  styles: `
    @media screen and (max-width: 920px) {
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
    }
  `
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = signal(false);
  private seo = inject(SeoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);
  touchedEmail = signal(false);
  touchedPassword = signal(false);
  authError = signal<string>('');

  ngOnInit(): void {
    this.seo.updateSEO({
      title: 'Connexion - QuizArena',
      description: 'Connectez-vous à votre compte QuizArena pour continuer.',
      keywords: 'connexion, login, QuizArena'
    });
  }

  ngOnDestroy(): void {
    this.seo.resetToDefault();
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.querySelector('#email') as HTMLInputElement)?.value?.trim();
    const password = (form.querySelector('#password') as HTMLInputElement)?.value?.trim();
    if (!email || !password) return;
    this.isLoading.set(true);
    try {
      const res = await this.auth.login(email, password);
      this.authError.set(res.success ? '' : (res.message || 'Adresse e-mail ou mot de passe incorrect'));
      if (res.success) {
        await this.userService.loadCurrentUser();
        this.router.navigate(['/users', 'tableau-de-bord']);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  async onLogin(email: string, password: string) {
    email = (email || '').trim();
    password = (password || '').trim();
    if (!email || !password) return;
    this.isLoading.set(true);
    try {
      const res = await this.auth.login(email, password);
      this.authError.set(res.success ? '' : (res.message || 'Adresse e-mail ou mot de passe incorrect'));
      if (res.success) {
        await this.userService.loadCurrentUser();
        this.router.navigate(['/users', 'tableau-de-bord']);
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}


