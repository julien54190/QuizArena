import { Component, Input, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { IPlayQuiz } from '../../../interfaces/quiz';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule],
  template: `
    <section class="mt-20 card card-shadow">
      <h2 class="text-center text-xlg">{{ getCategoryName() }}</h2>

      @if (categoryStats()) {
        <div class="text-center mb-20">
          <p class="text-sm text-muted">
            {{ categoryStats()?.totalQuizzes }} quiz •
            {{ categoryStats()?.totalQuestions }} questions •
            {{ categoryStats()?.totalPlays }} parties jouées •
            Score moyen: {{ categoryStats()?.averageScore }}%
          </p>
        </div>
      }



      @if (filteredQuizzes().length > 0) {
        <div class="flex flex-wrap gap-16 filed w-full justify-content-center">
          @for (quiz of filteredQuizzes(); track quiz.id) {
            <div (click)="selectQuiz(quiz)" class="card card-white mt-10 card-size text-center flex flex-col justify-content-between card-hover">

              <div>
                <h3 class="text-bold mb-10">{{ quiz.title }}</h3>
                <span class="text-sm text-semibold" [ngClass]="getDifficultyClass(quiz.difficulty)" role="status" [attr.aria-label]="'Difficulté ' + quiz.difficulty">{{ quiz.difficulty }}</span>
              </div>

              <p class="text-sm">{{ quiz.description }}</p>

              <div class="flex flex-col mb-10">
                <span class="text-sm">{{ quiz.questionCount }} questions</span>
                <span class="text-sm text-bold">Score moyen: {{ quiz.averageScore }}%</span>
              </div>

              <div>
                <span>{{ quiz.totalPlays }} parties</span>
              </div>
            </div>
          }
        </div>
      } @else {
        <div>
          <p>Aucun quiz disponible pour cette catégorie.</p>
        </div>
      }
    </section>
  `,
  styles: ``
})
export class QuizListComponent {
  @Input() categoryId!: string;

  private quizService = inject(QuizService);
  private router = inject(Router);

  // Données exposées
  quizzes = this.quizService.allQuizzes;

  // Computed pour filtrer les quiz par catégorie
  filteredQuizzes = computed(() => {
    const categoryId = parseInt(this.categoryId);
    return this.quizService.getQuizzesByCategoryId(categoryId);
  });

  // Statistiques de la catégorie
  categoryStats = computed(() => {
    const categoryId = parseInt(this.categoryId);
    return this.quizService.getCategoryStatsById(categoryId);
  });



  // Méthodes
  selectQuiz(quiz: IPlayQuiz): void {
    console.log('Sélection du quiz:', quiz.title);
    //this.router.navigate(['/jouer', quiz.id]);
  }

  // Obtenir la classe CSS pour la difficulté
  getDifficultyClass(difficulty: string): string {
    return this.quizService.getDifficultyClass(difficulty);
  }

  // Obtenir le nom de la catégorie
  getCategoryName(): string {
    const categoryId = parseInt(this.categoryId);
    return this.quizService.getCategoryNameById(categoryId);
  }
}
