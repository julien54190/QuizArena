import { Component, Input, inject, computed, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { IPlayQuiz } from '../../../../interfaces/quiz';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule],
  template: `
    <section class="mt-20 card card-shadow" role="main" aria-labelledby="category-title">
      <h2 id="category-title" class="text-center text-xlg">{{ getCategoryName() }}</h2>

      @if (categoryStats()) {
        <div class="text-center mb-20" role="status" aria-live="polite">
          <p class="text-sm text-muted" id="category-stats">
            {{ categoryStats()?.totalQuizzes }} quiz •
            {{ categoryStats()?.totalQuestions }} questions •
            {{ categoryStats()?.totalPlays }} parties jouées •
            Score moyen: {{ categoryStats()?.averageScore }}%
          </p>
        </div>
      }

      @if (filteredQuizzes().length > 0) {
        <div class="flex flex-wrap gap-16 filed w-full justify-content-center" role="list" [attr.aria-label]="'Liste des quiz de la catégorie ' + getCategoryName()">
          @for (quiz of filteredQuizzes(); track quiz.id) {
            <div
              (click)="selectQuiz(quiz)"
              (keydown.enter)="selectQuiz(quiz)"
              (keydown.space)="selectQuiz(quiz)"
              class="card card-white mt-10 card-size text-center flex flex-col justify-content-between card-hover"
              role="listitem"
              tabindex="0"
              [attr.aria-label]="'Quiz ' + quiz.title + ' - ' + getQuizCategories(quiz) + ' - Difficulté ' + quiz.difficulty"
              [attr.aria-describedby]="'quiz-desc-' + quiz.id + ' quiz-stats-' + quiz.id">

              <div>
                <h3 class="text-bold mb-10" id="quiz-title-{{ quiz.id }}">{{ quiz.title }}</h3>
                <span
                  class="text-sm text-semibold"
                  [ngClass]="getDifficultyClass(quiz.difficulty)"
                  role="status"
                  [attr.aria-label]="'Difficulté ' + quiz.difficulty">{{ quiz.difficulty }}</span>
              </div>

              <p class="text-sm" id="quiz-desc-{{ quiz.id }}">{{ quiz.description }}</p>

              <div class="flex flex-col mb-10" id="quiz-stats-{{ quiz.id }}">
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
        <div role="status" aria-live="polite">
          <p>Aucun quiz disponible pour cette catégorie.</p>
        </div>
      }
    </section>
  `,
  styles: ``
})
export class QuizListComponent implements OnInit, OnChanges {
  @Input() categoryId!: string;

  private quizService = inject(QuizService);
  private router = inject(Router);

  // Données locales chargées depuis l'API
  private _list = signal<IPlayQuiz[]>([]);
  filteredQuizzes = computed(() => this._list());

  // Statistiques de la catégorie
  categoryStats = computed(() => {
    const list = this._list();
    return {
      totalQuizzes: list.length,
      totalQuestions: (list as any[]).reduce((a, q) => a + (q.questionCount ?? 0), 0),
      totalPlays: (list as any[]).reduce((a, q) => a + (q.totalPlays ?? 0), 0),
      averageScore: list.length > 0 ? Math.round((list as any[]).reduce((a, q) => a + (q.averageScore ?? 0), 0) / list.length) : 0,
    } as any;
  });



  // Méthodes
  selectQuiz(quiz: IPlayQuiz): void {
    console.log('Sélection du quiz:', quiz.title);
    this.router.navigate(['/jouer/quiz', quiz.id]);
  }

  // Obtenir la classe CSS pour la difficulté
  getDifficultyClass(difficulty: string): string {
    return this.quizService.getDifficultyClass(difficulty);
  }

  // Obtenir le nom de la catégorie
  getCategoryName(): string {
    return this.quizService.getCategoryNameById(this.categoryId);
  }

  // Obtenir les catégories de manière sécurisée
  getQuizCategories(quiz: any): string {
    if (!quiz) return '';
    if (Array.isArray(quiz.categories)) {
      return quiz.categories.join(', ');
    }
    if (quiz.category?.name) {
      return quiz.category.name;
    }
    return '';
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryId']) {
      this.load();
    }
  }

  private load(): void {
    const cat = String(this.categoryId);
    this.quizService.getQuizzesByCategory(cat).subscribe((qs) => this._list.set(qs ?? []));
  }
}
