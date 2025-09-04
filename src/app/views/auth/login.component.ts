import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-login',
  standalone: true,
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

      <form class="flex flex-col gap-16" aria-labelledby="login-title">
        <div class="field w-full">
          <label for="email">Adresse e-mail</label>
          <input class="w-full p-12 radius" id="email" name="email" type="email" autocomplete="email" placeholder="exemple@domaine.com" required>
        </div>

        <div class="field w-full">
          <label for="password">Mot de passe</label>
          <input class="w-full p-12 radius" id="password" name="password" type="password" autocomplete="current-password" placeholder="********" required>
        </div>

        <div class="mt-20">
          <button class="btn btn-primary py-12 px-24 w-full" type="submit">Connexion</button>
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
}


