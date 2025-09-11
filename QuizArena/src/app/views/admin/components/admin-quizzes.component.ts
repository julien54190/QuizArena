import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminQuiz, QuizStats } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-quizzes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="home-container" role="main" aria-labelledby="admin-quizzes-title">
      <div class="home-content p-10">
        <header class="text-center mb-20">
          <h1 id="admin-quizzes-title" class="text-xlg text-bold mb-10">Gestion des Quizzes</h1>
          <p class="text-sm text-muted">Modérer et gérer tous les quizzes de la plateforme</p>
        </header>

        <!-- Statistiques -->
        <section class="mt-20" role="region" aria-labelledby="quiz-stats-title">
          <h2 id="quiz-stats-title" class="sr-only">Statistiques des quizzes</h2>
          <div class="flex flex-wrap gap-16" role="list" aria-label="Statistiques des quizzes">
            <article class="card card-white card-hover flex-1 text-center" role="listitem" tabindex="0">
              <div class="text-lg text-bold">{{ quizStats()?.totalQuizzes ?? 0 }}</div>
              <div class="text-sm text-muted">Total Quizzes</div>
            </article>
            <article class="card card-white card-hover flex-1 text-center" role="listitem" tabindex="0">
              <div class="text-lg text-bold">{{ quizStats()?.publicQuizzes ?? 0 }}</div>
              <div class="text-sm text-muted">Quizzes Publics</div>
            </article>
            <article class="card card-white card-hover flex-1 text-center" role="listitem" tabindex="0">
              <div class="text-lg text-bold">{{ quizStats()?.privateQuizzes ?? 0 }}</div>
              <div class="text-sm text-muted">Quizzes Privés</div>
            </article>
            <article class="card card-white card-hover flex-1 text-center" role="listitem" tabindex="0">
              <div class="text-lg text-bold">{{ quizStats()?.totalQuestions ?? 0 }}</div>
              <div class="text-sm text-muted">Total Questions</div>
            </article>
            <article class="card card-white card-hover flex-1 text-center" role="listitem" tabindex="0">
              <div class="text-lg text-bold">{{ quizStats()?.totalSessions ?? 0 }}</div>
              <div class="text-sm text-muted">Sessions Jouées</div>
            </article>
          </div>
        </section>

        <!-- Liste des quizzes (cartes) -->
        <section class="mt-20 card card-white card-shadow" role="region" aria-labelledby="quiz-list-title">
          <div class="p-20">
            <div class="flex justify-content-between align-items-center mb-20">
              <h2 id="quiz-list-title" class="text-lg text-bold m-0">Liste des Quizzes</h2>
              <div class="flex gap-12">
                <select class="form-control" [(ngModel)]="filterStatus" (change)="applyFilter()" aria-label="Filtrer par statut">
                  <option value="all">Tous les quizzes</option>
                  <option value="public">Publics</option>
                  <option value="private">Privés</option>
                </select>
              </div>
            </div>

            @if (filteredQuizzes().length > 0) {
              <div class="flex flex-col gap-12">
                @for (quiz of filteredQuizzes(); track quiz.id) {
                  <article class="card card-white p-16" role="listitem">
                    <div class="flex justify-content-between align-items-start gap-16">
                      <div class="flex-1">
                        <div class="text-semibold mb-5">{{ quiz.title }}</div>
                        <p class="text-sm text-muted m-0 mb-10">{{ quiz.description }}</p>
                        <div class="flex flex-wrap gap-8 align-items-center">
                          <span class="badge-secondary">{{ quiz.category?.name || 'Aucune catégorie' }}</span>
                          <span class="badge-success" *ngIf="quiz.difficulty === 'EASY'">Facile</span>
                          <span class="badge-warning" *ngIf="quiz.difficulty === 'MEDIUM'">Moyen</span>
                          <span class="badge-danger" *ngIf="quiz.difficulty === 'HARD'">Difficile</span>
                          <span class="badge-info">{{ quiz._count.questions }} questions</span>
                          <span class="badge-info">{{ quiz._count.sessions }} sessions</span>
                          <span class="badge-success" *ngIf="quiz.isPublic">Public</span>
                          <span class="badge-secondary" *ngIf="!quiz.isPublic">Privé</span>
                        </div>
                        <div class="text-sm text-muted mt-8">
                          Par {{ quiz.author.firstname }} {{ quiz.author.lastname }} · {{ formatDate(quiz.createdAt) }}
                        </div>
                      </div>
                      <div class="flex gap-8">
                        @if (quiz.isPublic) {
                          <button class="btn btn-warning btn-sm" (click)="suspendQuiz(quiz)">
                            <i class="fas fa-pause"></i> Suspendre
                          </button>
                        } @else {
                          <button class="btn btn-success btn-sm" (click)="activateQuiz(quiz)">
                            <i class="fas fa-check"></i> Activer
                          </button>
                        }
                        <button class="btn btn-danger btn-sm" (click)="deleteQuiz(quiz)">
                          <i class="fas fa-trash"></i> Supprimer
                        </button>
                      </div>
                    </div>
                  </article>
                }
              </div>
            } @else {
              <div class="text-center p-20 text-muted">Aucun quiz trouvé</div>
            }
          </div>
        </section>
      </div>
    </main>
  `,
  styles: []
})
export class AdminQuizzesComponent implements OnInit {
  private adminService = inject(AdminService);

  // Signals pour l'état du composant
  filterStatus = 'all';

  // Computed signals pour les données
  quizzes = this.adminService.quizzes;
  quizStats = this.adminService.quizStats;

  // Computed signal pour les quizzes filtrés
  filteredQuizzes = computed(() => {
    const allQuizzes = this.quizzes();
    if (this.filterStatus === 'all') {
      return allQuizzes;
    } else if (this.filterStatus === 'public') {
      return allQuizzes.filter(q => q.isPublic);
    } else if (this.filterStatus === 'private') {
      return allQuizzes.filter(q => !q.isPublic);
    }
    return allQuizzes;
  });

  async ngOnInit(): Promise<void> {
    await this.loadQuizzes();
  }

  private async loadQuizzes(): Promise<void> {
    try {
      await this.adminService.getQuizzes();
    } catch (error) {
      console.error('Erreur lors du chargement des quizzes:', error);
    }
  }

  applyFilter(): void {}

  async deleteQuiz(quiz: AdminQuiz): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le quiz \"${quiz.title}\" ?`)) {
      try {
        await this.adminService.deleteQuiz(quiz.id);
        alert('Quiz supprimé avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        alert(error.error?.message || 'Erreur lors de la suppression');
      }
    }
  }

  async suspendQuiz(quiz: AdminQuiz): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir suspendre le quiz \"${quiz.title}\" ?`)) {
      try {
        await this.adminService.suspendQuiz(quiz.id);
        alert('Quiz suspendu avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suspension:', error);
        alert(error.error?.message || 'Erreur lors de la suspension');
      }
    }
  }

  async activateQuiz(quiz: AdminQuiz): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir activer le quiz \"${quiz.title}\" ?`)) {
      try {
        await this.adminService.activateQuiz(quiz.id);
        alert('Quiz activé avec succès');
      } catch (error: any) {
        console.error('Erreur lors de l\'activation:', error);
        alert(error.error?.message || 'Erreur lors de l\'activation');
      }
    }
  }

  getDifficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'EASY': return 'Facile';
      case 'MEDIUM': return 'Moyen';
      case 'HARD': return 'Difficile';
      default: return difficulty;
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
}
