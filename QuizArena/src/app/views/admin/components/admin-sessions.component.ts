import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-sessions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <h1 class="text-xl text-bold">Gestion des Sessions</h1>
        <p class="text-muted">Analyser les sessions de quiz et les performances</p>
      </header>

      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-number">{{ stats().totalSessions }}</div>
          <div class="stat-label">Total Sessions</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats().completedSessions }}</div>
          <div class="stat-label">Sessions Terminées</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats().averageScore }}%</div>
          <div class="stat-label">Score Moyen</div>
        </div>
      </div>

      <div class="admin-content">
        <div class="content-header">
          <h2 class="text-lg text-bold">Statistiques des Sessions</h2>
          <div class="header-actions">
            <select class="form-select">
              <option>Dernières 24h</option>
              <option>Dernière semaine</option>
              <option>Dernier mois</option>
              <option>Tout</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Quiz</th>
                <th>Date</th>
                <th>Score</th>
                <th>Durée</th>
                <th>Statut</th>
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

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .form-select {
      padding: 8px 12px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--surface);
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
export class AdminSessionsComponent implements OnInit {
  private http = inject(HttpClient);

  stats = signal({
    totalSessions: 0,
    completedSessions: 0,
    averageScore: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.stats.set({
      totalSessions: 1247,
      completedSessions: 1156,
      averageScore: 73
    });
  }
}
