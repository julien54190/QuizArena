import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-side-bar',
  imports: [CommonModule, RouterModule],
  template: `
      <aside class="flex flex-col h-screen sidebar" role="complementary" aria-label="Menu de navigation administrateur">
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
              <div class="admin-badge">ADMIN</div>
            </div>
            <div class="text-semibold">
              <h3 id="admin-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</h3>
              <p id="admin-role">ADMINISTRATEUR
                <span class="badge badge-light ml-8">{{ (currentUser()?.status || '').toString().toUpperCase() }}</span>
              </p>
            </div>
          </div>
        </div>

        <nav class="flex-1 py-24" role="navigation" aria-labelledby="admin-name">
          <ul role="list">
            <li role="listitem">
              <a routerLink="/admin/tableau-de-bord"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{exact: true}"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Aller au tableau de bord admin">
                <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
                <span>Tableau de bord</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/admin/utilisateurs"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Gérer les utilisateurs">
                <i class="fas fa-users" aria-hidden="true"></i>
                <span>Utilisateurs</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/admin/quizzes"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Gérer les quiz">
                <i class="fas fa-question-circle" aria-hidden="true"></i>
                <span>Quiz</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/admin/categories"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Gérer les catégories">
                <i class="fas fa-tags" aria-hidden="true"></i>
                <span>Catégories</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/admin/sessions"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Voir les sessions">
                <i class="fas fa-play-circle" aria-hidden="true"></i>
                <span>Sessions</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="p-25 sidebar-footer">
          <button (click)="goToUserDashboard()"
                  class="btn btn-secondary flex align-items-center gap-12 w-full mb-12"
                  aria-label="Retour au tableau de bord utilisateur">
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
            <span>Retour utilisateur</span>
          </button>
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
    .admin-badge {
      position: absolute;
      right: -6px;
      bottom: -6px;
      padding: 4px 8px;
      border-radius: 12px;
      background: #dc3545;
      color: #fff;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
    }
    @media (max-width: 920px) {
      :host { display: none; }
    }
  `]
})
export class AdminSideBarComponent {
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

	goToUserDashboard() {
		this.router.navigate(['/users/tableau-de-bord']);
	}
}
