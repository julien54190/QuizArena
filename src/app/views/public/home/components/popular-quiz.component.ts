import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../../../../services/search.service';
import { QuizService } from '../../../../services/quiz.service';

@Component({
  selector: 'app-popular-quiz',
  imports: [CommonModule],
  template: `
  <section class="mt-20 card card-shadow" role="region" aria-labelledby="popular-quizzes-title">
    <h2 id="popular-quizzes-title" class="text-center text-xlg">Quiz populaires</h2>

    <div class="flex flex-wrap gap-16 filed w-full justify-content-center" role="list" aria-label="Liste des quiz populaires">
      @for (quiz of popularQuizzes(); track quiz.id) {
        <article
          (click)="playQuiz(quiz)"
          (keydown.enter)="playQuiz(quiz)"
          (keydown.space)="playQuiz(quiz)"
          class="card card-white mt-10 card-size text-center flex flex-col justify-content-between card-hover"
          role="listitem"
          tabindex="0"
          [attr.aria-label]="'Quiz ' + quiz.title + ' - ' + quiz.categories.join(', ') + ' - Difficulté ' + quiz.difficulty"
          [attr.aria-describedby]="'quiz-desc-' + quiz.id">
          <div class="flex flex-col justify-content-between h-full">
            <div>
              <div class="text-lg mb-10" role="img" [attr.aria-label]="'Icône ' + quiz.categories[0]">{{ getCategoryIcon(quiz.categories[0]) }}</div>
              <h3 class="text-bold mb-10">{{ quiz.title }}</h3>
              <p id="quiz-desc-{{ quiz.id }}" class="text-sm">{{ quiz.description }}</p>
            </div>
            <div class="mt-auto">
              <span class="mr-10 text-sm text-semibold badge-info" role="status" [attr.aria-label]="quiz.questionCount + ' questions'">{{ quiz.questionCount }} questions</span>
              <span class="text-sm text-semibold" [ngClass]="getDifficultyClass(quiz.difficulty)" role="status" [attr.aria-label]="'Difficulté ' + quiz.difficulty">{{ quiz.difficulty }}</span>
            </div>
          </div>
        </article>
      }
    </div>

    <!-- État vide -->
    @if (popularQuizzes().length === 0) {
      <div role="status" aria-live="polite" class="text-center card card-white mt-10">
        <div role="img" aria-label="Icône de recherche">🔍</div>
        <h3>Aucun quiz trouvé</h3>
        <p>
          {{ hasActiveFilters() ?
            'Aucun quiz ne correspond à vos critères de recherche.' :
            'Aucun quiz disponible pour le moment.' }}
        </p>
      </div>
    }
  </section>
  `,
  styles: ``
})
export class PopularQuizComponent {
  private searchService = inject(SearchService);
  private quizService = inject(QuizService);
  private router = inject(Router);

  // Quiz populaires depuis le service
  popularQuizzes = this.searchService.popularQuizzes;
  hasActiveFilters = this.searchService.hasActiveFilters;

  // Méthode pour jouer à un quiz
  playQuiz(quiz: any) {
    // Appeler le service pour logger
    this.quizService.playQuiz(quiz);

    // Naviguer vers la page de jeu avec l'ID du quiz
    this.router.navigate(['/jouer/quiz', quiz.id]);
  }

  // Obtenir la classe CSS pour la difficulté
  getDifficultyClass(difficulty: string): string {
    return this.quizService.getDifficultyClass(difficulty);
  }

  // Obtenir l'icône selon la catégorie
  getCategoryIcon(category: string): string {
    return this.quizService.getCategoryIcon(category);
  }
}
