import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-content p-10">
      <header class="text-center mb-20">
        <h1 class="text-xlg text-bold mb-10">Admin - Tableau de bord</h1>
        <p class="text-sm">Vue d'ensemble des statistiques de la plateforme</p>
      </header>

      <!-- Statistiques globales -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Utilisateurs</h3>
          <p>{{ stats()?.users ?? 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Quiz</h3>
          <p>{{ stats()?.quizzes ?? 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Sessions</h3>
          <p>{{ stats()?.sessions ?? 0 }}</p>
        </div>
      </div>

      <!-- Actions récentes -->
      <div class="actions-grid">
        <!-- Dernières inscriptions -->
        <section class="action-section">
          <h2><i class="fas fa-user-plus"></i> Dernières inscriptions</h2>
          @if (hasRecentUsers()) {
            @for (user of recentUsers(); track user.id) {
              <div class="action-item">
                <div class="action-info">
                  <div class="avatar-small">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="action-details">
                    <h4>{{ user.firstname }} {{ user.lastname }}</h4>
                    <p>{{ user.username }}</p>
                    <p class="date">{{ formatDate(user.createdAt) }}</p>
                  </div>
                </div>
                <button
                  class="btn-delete"
                  (click)="deleteUser(user.id, user.firstname, user.lastname)"
                  title="Supprimer cet utilisateur">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            }
          } @else {
            <div class="empty-state">
              <i class="fas fa-user-slash"></i>
              <p>Aucune inscription récente</p>
            </div>
          }
        </section>

        <!-- Derniers quiz créés -->
        <section class="action-section">
          <h2><i class="fas fa-question-circle"></i> Derniers quiz créés</h2>
          @if (hasRecentQuizzes()) {
            @for (quiz of recentQuizzes(); track quiz.id) {
              <div class="action-item">
                <div class="action-info">
                  <div class="avatar-small">
                    <i class="fas fa-question-circle"></i>
                  </div>
                  <div class="action-details">
                    <h4>{{ quiz.title }}</h4>
                    <p>par {{ quiz.author.firstname }} {{ quiz.author.lastname }}</p>
                    <p class="date">{{ formatDate(quiz.createdAt) }}</p>
                  </div>
                </div>
                <button
                  class="btn-delete"
                  (click)="deleteQuiz(quiz.id, quiz.title)"
                  title="Supprimer ce quiz">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            }
          } @else {
            <div class="empty-state">
              <i class="fas fa-question-circle"></i>
              <p>Aucun quiz récent</p>
            </div>
          }
        </section>
      </div>
    </div>
  `,
         styles: [`
           .stats-grid {
             display: grid;
             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
             gap: 20px;
             margin-bottom: 30px;
           }
           .stat-card {
             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
             color: white;
             padding: 24px;
             border-radius: 12px;
             text-align: center;
             box-shadow: 0 4px 15px rgba(0,0,0,0.1);
             transition: transform 0.2s ease;
           }
           .stat-card:hover {
             transform: translateY(-2px);
           }
           .stat-card h3 {
             margin: 0 0 8px 0;
             font-size: 14px;
             opacity: 0.9;
             text-transform: uppercase;
             letter-spacing: 0.5px;
           }
           .stat-card p {
             margin: 0;
             font-size: 32px;
             font-weight: bold;
           }
           .actions-grid {
             display: grid;
             grid-template-columns: 1fr 1fr;
             gap: 30px;
           }
           .action-section {
             background: white;
             border-radius: 12px;
             padding: 24px;
             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
           }
           .action-section h2 {
             margin: 0 0 20px 0;
             color: #2c3e50;
             font-size: 18px;
             border-bottom: 2px solid #3498db;
             padding-bottom: 10px;
           }
           .action-item {
             display: flex;
             align-items: center;
             justify-content: space-between;
             padding: 16px;
             border: 1px solid #e9ecef;
             border-radius: 8px;
             margin-bottom: 12px;
             transition: all 0.2s ease;
           }
           .action-item:hover {
             border-color: #3498db;
             box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
           }
           .action-item:last-child {
             margin-bottom: 0;
           }
           .action-info {
             display: flex;
             align-items: center;
             gap: 12px;
             flex: 1;
           }
           .avatar-small {
             width: 40px;
             height: 40px;
             border-radius: 50%;
             background: linear-gradient(135deg, #3498db, #2980b9);
             display: flex;
             align-items: center;
             justify-content: center;
             color: white;
             font-size: 16px;
           }
           .action-details h4 {
             margin: 0 0 4px 0;
             font-size: 14px;
             font-weight: 600;
             color: #2c3e50;
           }
           .action-details p {
             margin: 0;
             font-size: 12px;
             color: #7f8c8d;
           }
           .action-details .date {
             font-size: 11px;
             color: #95a5a6;
           }
           .btn-delete {
             background: #e74c3c;
             color: white;
             border: none;
             padding: 8px 12px;
             border-radius: 6px;
             cursor: pointer;
             transition: background 0.2s ease;
           }
           .btn-delete:hover {
             background: #c0392b;
           }
           .empty-state {
             text-align: center;
             padding: 40px 20px;
             color: #7f8c8d;
           }
           .empty-state i {
             font-size: 48px;
             margin-bottom: 16px;
             opacity: 0.5;
           }
           @media (max-width: 768px) {
             .actions-grid {
               grid-template-columns: 1fr;
               gap: 20px;
             }
             .stats-grid {
               grid-template-columns: 1fr;
             }
           }
         `]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  // Computed signals qui utilisent le service
  stats = this.adminService.overview;
  recentUsers = computed(() => this.adminService.recentActions()?.recentUsers ?? []);
  recentQuizzes = computed(() => this.adminService.recentActions()?.recentQuizzes ?? []);
  hasRecentUsers = computed(() => this.recentUsers().length > 0);
  hasRecentQuizzes = computed(() => this.recentQuizzes().length > 0);

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      await Promise.all([
        this.adminService.getOverview(),
        this.adminService.getRecentActions()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données admin:', error);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

         async deleteUser(userId: string, firstname: string, lastname: string): Promise<void> {
           if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${firstname} ${lastname}" ?`)) {
             try {
               await this.adminService.deleteRecentUser(userId);
               alert('Utilisateur supprimé avec succès');
               // Les données se rechargent automatiquement via le service
             } catch (error) {
               console.error('Erreur lors de la suppression:', error);
               alert('Erreur lors de la suppression de l\'utilisateur');
             }
           }
         }

  async deleteQuiz(quizId: string, quizTitle: string): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le quiz "${quizTitle}" ?`)) {
      try {
        await this.adminService.deleteRecentQuiz(quizId);
        alert('Quiz supprimé avec succès');
        // Les données se rechargent automatiquement via le service
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du quiz');
      }
    }
  }
}
