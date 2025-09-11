import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-side-bar-mobile',
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Bouton menu burger pour mobile -->
    <button
      class="btn sidebar-toggle xs-show"
      (click)="toggleSidebar()"
      [attr.aria-label]="isOpen() ? 'Fermer le menu' : 'Ouvrir le menu'"
      [attr.aria-expanded]="isOpen()"
    >
      <i class="fas fa-bars" aria-hidden="true"></i>
    </button>

    <!-- Overlay -->
    @if (isOpen()) {
      <div class="sidebar-overlay xs-show" (click)="closeSidebar()" aria-hidden="true"></div>
    }

    <aside
      class="flex flex-col h-screen sidebar xs-show"
      [ngClass]="{ 'sidebar-open': isOpen(), 'sidebar-closed': !isOpen() }"
      role="complementary"
      aria-label="Menu de navigation utilisateur"
    >
      <div class="p-25 sidebar-header">
        <div class="flex align-items-center gap-16">
          <div class="avatar-wrapper">
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
        <button class="btn sidebar-close" (click)="closeSidebar()" aria-label="Fermer le menu">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>

      <nav class="flex-1 py-24" role="navigation" aria-labelledby="user-name">
        <ul role="list">
          <li role="listitem">
            <a routerLink="/tableau-de-bord" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="flex align-items-center gap-12 py-12 px-24 nav-link" (click)="closeSidebar()" aria-label="Aller au tableau de bord">
              <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
              <span>Tableau de bord</span>
            </a>
          </li>
          <li role="listitem">
            <a routerLink="/profil" routerLinkActive="active" class="flex align-items-center gap-12 py-12 px-24 nav-link" (click)="closeSidebar()" aria-label="Gérer mon profil">
              <i class="fas fa-user-edit" aria-hidden="true"></i>
              <span>Mon profil</span>
            </a>
          </li>
          <li role="listitem">
            <a routerLink="/statistiques" routerLinkActive="active" class="flex align-items-center gap-12 py-12 px-24 nav-link" (click)="closeSidebar()" aria-label="Voir mes statistiques">
              <i class="fas fa-chart-bar" aria-hidden="true"></i>
              <span>Mes statistiques</span>
            </a>
          </li>
          <li role="listitem">
            <a routerLink="/creer-quiz" routerLinkActive="active" class="flex align-items-center gap-12 py-12 px-24 nav-link" (click)="closeSidebar()" aria-label="Créer un nouveau quiz">
              <i class="fas fa-plus-circle" aria-hidden="true"></i>
              <span>Créer un quiz</span>
            </a>
          </li>
          <li role="listitem">
            <a routerLink="/abonnement" routerLinkActive="active" class="flex align-items-center gap-12 py-12 px-24 nav-link" (click)="closeSidebar()" aria-label="Gérer mon abonnement">
              <i class="fas fa-credit-card" aria-hidden="true"></i>
              <span>Mon abonnement</span>
            </a>
          </li>
          <li role="listitem">
            <a routerLink="/parametres" routerLinkActive="active" class="flex align-items-center gap-12 py-12 px-24 nav-link" (click)="closeSidebar()" aria-label="Accéder aux paramètres">
              <i class="fas fa-cog" aria-hidden="true"></i>
              <span>Paramètres</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="p-25 sidebar-footer">
        <button (click)="logout()" class="btn btn-danger flex align-items-center gap-12 w-full" aria-label="Se déconnecter">
          <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-toggle {
      position: fixed;
      top: 100px;
      left: 20px;
      z-index: 1000;
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
    }

    .sidebar-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    .sidebar {
      position: fixed;
      top: 0; left: 0;
      width: 280px; height: 100vh;
      background: var(--side);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      z-index: 1000;
      transition: transform 0.3s ease;
    }
    .sidebar-closed { transform: translateX(-100%); }
    .sidebar-open { transform: translateX(0); }

    .sidebar-close {
      position: absolute;
      top: 20px; right: 20px;
      background: none; border: none; color: var(--text-color); cursor: pointer; padding: 8px;
    }

    .avatar-wrapper { position: relative; width: 64px; height: 64px; }
    .avatar-img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
    .avatar-add { position: absolute; right: -6px; bottom: -6px; width: 24px; height: 24px; border-radius: 50%; border: none; background: var(--primary); color: #fff; font-size: 16px; line-height: 24px; text-align: center; cursor: pointer; }

    @media (min-width: 921px) {
      :host { display: none; }
    }
  `]
})
export class SideBarMobileComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  readonly currentUser = this.userService.currentUser;
  isOpen = signal(false);

  constructor() {
    this.userService.loadCurrentUser();
  }

  toggleSidebar() { this.isOpen.update(v => !v); }
  closeSidebar() { this.isOpen.set(false); }

  onAddPhoto() {
    alert('Ajout de photo prochainement');
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/accueil']);
  }
}
