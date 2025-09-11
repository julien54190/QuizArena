import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-admin-side-bar-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-mobile-header">
      <div class="admin-mobile-nav">
        <button class="mobile-menu-btn" (click)="toggleMenu()">
          <span class="hamburger">☰</span>
        </button>
        <h1 class="admin-mobile-title">Administration</h1>
        <button class="logout-btn" (click)="logout()">Déconnexion</button>
      </div>

      <div class="admin-mobile-menu" [class.open]="isMenuOpen">
        <nav class="admin-mobile-nav-links">
          <a routerLink="/admin/tableau-de-bord" routerLinkActive="active" (click)="closeMenu()" class="mobile-nav-link">
            <span class="nav-icon">📊</span>
            Tableau de bord
          </a>
          <a routerLink="/admin/utilisateurs" routerLinkActive="active" (click)="closeMenu()" class="mobile-nav-link">
            <span class="nav-icon">👥</span>
            Utilisateurs
          </a>
          <a routerLink="/admin/quizzes" routerLinkActive="active" (click)="closeMenu()" class="mobile-nav-link">
            <span class="nav-icon">📝</span>
            Quizzes
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active" (click)="closeMenu()" class="mobile-nav-link">
            <span class="nav-icon">🏷️</span>
            Catégories
          </a>
          <a routerLink="/admin/sessions" routerLinkActive="active" (click)="closeMenu()" class="mobile-nav-link">
            <span class="nav-icon">📈</span>
            Sessions
          </a>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .admin-mobile-header {
      display: none;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .admin-mobile-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
    }

    .mobile-menu-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 8px;
    }

    .admin-mobile-title {
      font-size: 16px;
      font-weight: bold;
      margin: 0;
    }

    .logout-btn {
      background: var(--danger);
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }

    .admin-mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .admin-mobile-menu.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .admin-mobile-nav-links {
      display: flex;
      flex-direction: column;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text);
      text-decoration: none;
      border-bottom: 1px solid var(--border);
    }

    .mobile-nav-link:hover,
    .mobile-nav-link.active {
      background: var(--primary);
      color: white;
    }

    .nav-icon {
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .admin-mobile-header {
        display: block;
      }
    }
  `]
})
export class AdminSideBarMobileComponent {
  private userService = inject(UserService);

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.userService.logout();
  }
}
