import { Component, computed, signal } from '@angular/core';
import { PLAY_QUIZZES_DATA } from '../../../data/quiz.data';
import { CATEGORIES_DATA } from '../../../data/categories.data';

@Component({
  selector: 'app-statbar',
  imports: [],
  template: `
  <section class="mt-20 card card-shadow" role="region" aria-label="Statistiques de QuizArena">
    <div class="flex flex-wrap gap-16">
      <article class="card w-100 field text-center card-white" role="article">
        <div class="text-lg text-bold" aria-label="Nombre total de quiz disponibles">{{ totalQuizzes() }}</div>
        <div>Quiz disponibles</div>
      </article>
      <article class="card w-100 field text-center card-white" role="article">
        <div class="text-lg text-bold" aria-label="Nombre total de catégories">{{ totalCategories() }}</div>
        <div class="text-sm">Catégories</div>
      </article>
      <article class="card w-100 field text-center card-white" role="article">
        <div class="text-lg text-bold" aria-label="Score moyen des utilisateurs">{{ averageScore() }}%</div>
        <div>Score moyen</div>
      </article>
      <article class="card w-100 field text-center card-white" role="article">
        <div class="text-lg text-bold" aria-label="Nombre total de parties jouées">{{ totalPlays() }}</div>
        <div>Parties jouées</div>
      </article>
    </div>
  </section>
  `,
  styles: ``
})
export class StatbarComponent {
  quizzes = signal(PLAY_QUIZZES_DATA);
  categories = signal(CATEGORIES_DATA);

  totalQuizzes = computed(() => this.quizzes().length);
  totalCategories = computed(() => this.categories().length);

  averageScore = computed(() => {
    const scores = this.quizzes().map(quiz => quiz.averageScore);
    const total = scores.reduce((acc, score) => acc + score, 0);
    return Math.round(total / scores.length);
  });

  totalPlays = computed(() => {
    return this.quizzes().reduce((sum, quiz) => sum + quiz.totalPlays, 0);
  });

}
