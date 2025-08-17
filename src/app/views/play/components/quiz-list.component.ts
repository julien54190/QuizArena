import { Component, Input, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { IPlayQuiz } from '../../../interfaces/quiz';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule],
  template: `
    <section>
      <h2>{{ getCategoryName() }}</h2>

      @if (categoryStats()) {
        <div>
          <p>
            {{ categoryStats()?.totalQuizzes }} quiz •
            {{ categoryStats()?.totalQuestions }} questions •
            {{ categoryStats()?.totalPlays }} parties jouées •
            Score moyen: {{ categoryStats()?.averageScore }}%
          </p>
        </div>
      }



      @if (filteredQuizzes().length > 0) {
        <div>
          @for (quiz of filteredQuizzes(); track quiz.id) {
            <div (click)="selectQuiz(quiz)">

              <div>
                <h3>{{ quiz.title }}</h3>
                <span [ngClass]="getDifficultyClass(quiz.difficulty)" role="status" [attr.aria-label]="'Difficulté ' + quiz.difficulty">{{ quiz.difficulty }}</span>
              </div>

              <p>{{ quiz.description }}</p>

              <div>
                <span>{{ quiz.questionCount }} questions</span>
                <span>Score moyen: {{ quiz.averageScore }}%</span>
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
