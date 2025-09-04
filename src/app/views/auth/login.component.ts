import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="home-container">
  <div class="home-content p-10">
    <header class="text-center mb-20">
      <h1 class="text-xlg text-bold mb-10">Se connecter</h1>
      <p class="text-sm">Ravi de vous revoir</p>
    </header>

    <section class="card card-shadow mt-20">
      <h2 class="text-lg text-bold mb-20">Identifiants</h2>

      <form class="flex flex-col gap-16">
        <div class="field w-full">
          <label>Adresse e-mail</label>
          <input class="w-full p-12 radius" id="email" name="email" type="email" autocomplete="email" placeholder="exemple@domaine.com" required>
        </div>

        <div class="field w-full">
          <label>Mot de passe</label>
          <input class="w-full p-12 radius" id="password" name="password" type="password" autocomplete="current-password" placeholder="********" required>
        </div>

        <div class="mt-20">
          <button class="btn btn-primary py-12 px-24 w-full" type="submit">Connexion</button>
        </div>

        <div class="flex justify-content-center align-items-center gap-12 mt-20">
          <span class="text-sm xs-text-normal">Pas de compte ?</span>
          <a class="btn btn-outline-primary py-12 px-24 radius" routerLink="/inscription">Créer un compte</a>
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
export class LoginComponent {
  isLoading = signal(false);
}


