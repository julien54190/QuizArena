import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterModule],
  template: `
      <aside class="flex flex-col h-screen sidebar" role="complementary" aria-label="Menu de navigation utilisateur">
        <div class="p-25 sidebar-header">
          <div class="flex align-items-center gap-16">
            <div class="avatar-wrapper" role="img">
              @if (currentUser()?.avatar) {
                <img class="avatar-img" [src]="currentUser()!.avatar" alt="Avatar de {{ currentUser()?.firstName }} {{ currentUser()?.lastName }}">
              } @else {
                <svg class="avatar-img" viewBox="0 0 100 100" aria-label="Avatar par défaut">
                  <circle cx="50" cy="50" r="50" fill="#ECECEC" />
                  <path d="M50 54c11 0 20 9 20 20H30c0-11 9-20 20-20zm0-6a12 12 0 1 0 0-24 12 12 0 0 0 0 24z" fill="#B0B0B0" />
                </svg>
              }
              <button class="avatar-add" (click)="onAddPhoto()" aria-label="Ajouter une photo de profil">+</button>
            </div>
            <div class="text-semibold">
              <h3 id="user-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</h3>
              <p id="user-role">{{ (currentUser()?.role || '').toString().toUpperCase() }}
                <span class="badge badge-light ml-8">{{ (currentUser()?.status || '').toString().toUpperCase() }}</span>
              </p>
            </div>
          </div>
        </div>

        <nav class="flex-1 py-24" role="navigation" aria-labelledby="user-name">
          <ul role="list">
            <li role="listitem">
              <a routerLink="/users/tableau-de-bord"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{exact: true}"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Aller au tableau de bord">
                <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
                <span>Tableau de bord</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/profil"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Gérer mon profil">
                <i class="fas fa-user-edit" aria-hidden="true"></i>
                <span>Mon profil</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/statistiques"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Voir mes statistiques">
                <i class="fas fa-chart-bar" aria-hidden="true"></i>
                <span>Mes statistiques</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/creer-quiz"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Créer un nouveau quiz">
                <i class="fas fa-plus-circle" aria-hidden="true"></i>
                <span>Créer un quiz</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/abonnement"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Gérer mon abonnement">
                <i class="fas fa-credit-card" aria-hidden="true"></i>
                <span>Mon abonnement</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/parametres"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Accéder aux paramètres">
                <i class="fas fa-cog" aria-hidden="true"></i>
                <span>Paramètres</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="p-25 sidebar-footer">
          <button (click)="logout()"
                  class="btn btn-danger flex align-items-center gap-12 w-full"
                  aria-label="Se déconnecter">
            <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
  `,
  styles: [`
    .avatar-wrapper { position: relative; width: 72px; height: 72px; }
    .avatar-img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; }
    .avatar-add { position: absolute; right: -6px; bottom: -6px; width: 28px; height: 28px; border-radius: 50%; border: none; background: var(--primary); color: #fff; font-size: 18px; line-height: 28px; text-align: center; cursor: pointer; }
    @media (max-width: 920px) {
      :host { display: none; }
    }
  `]
})
export class SideBarComponent {
  private userService = inject(UserService);
	private router = inject(Router);

	currentUser = this.userService.currentUser;

	constructor() {
		this.userService.loadCurrentUser();
	}

	logout() {
		this.userService.logout();
		this.router.navigate(['/accueil']);
	}

	onAddPhoto() {
		alert('Ajout de photo prochainement');
	}
}
