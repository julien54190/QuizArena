import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <h1 class="text-xl text-bold">Gestion des Catégories</h1>
        <p class="text-muted">Créer et gérer les catégories de quizzes</p>
      </header>

      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-number">{{ stats().totalCategories }}</div>
          <div class="stat-label">Total Catégories</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats().activeCategories }}</div>
          <div class="stat-label">Catégories Actives</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats().totalQuizzes }}</div>
          <div class="stat-label">Quizzes par Catégorie</div>
        </div>
      </div>

      <div class="admin-content">
        <div class="content-header">
          <h2 class="text-lg text-bold">Liste des Catégories</h2>
          <button class="btn btn-primary">Ajouter une Catégorie</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Icône</th>
                <th>Couleur</th>
                <th>Description</th>
                <th>Quizzes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="6" class="text-center text-muted">
                  Fonctionnalité en cours de développement...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 20px;
    }

    .page-header {
      margin-bottom: 30px;
    }

    .admin-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: var(--surface);
      padding: 20px;
      border-radius: 8px;
      border: 1px solid var(--border);
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: var(--primary);
    }

    .stat-label {
      color: var(--text-muted);
      margin-top: 8px;
    }

    .admin-content {
      background: var(--surface);
      border-radius: 8px;
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid var(--border);
    }

    .table-container {
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }

    .admin-table th,
    .admin-table td {
      padding: 12px 20px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }

    .admin-table th {
      background: var(--surface-hover);
      font-weight: 600;
    }
  `]
})
export class AdminCategoriesComponent implements OnInit {
  private http = inject(HttpClient);

  stats = signal({
    totalCategories: 0,
    activeCategories: 0,
    totalQuizzes: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.stats.set({
      totalCategories: 12,
      activeCategories: 10,
      totalQuizzes: 156
    });
  }
}
