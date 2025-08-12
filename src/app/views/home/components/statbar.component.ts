import { Component, computed, signal } from '@angular/core';
import { PLAY_QUIZZES_DATA } from '../../../data/quiz.data';
import { CATEGORIES_DATA } from '../../../data/categories.data';

@Component({
  selector: 'app-statbar',
  imports: [],
  template: `
        <div>
          <div>
            <div>
              <div>{{ totalQuizzes() }}</div>
              <div>Quiz disponibles</div>
            </div>
            <div>
              <div>{{ totalCategories() }}</div>
              <div class="text-sm">Catégories</div>
            </div>
            <div>
              <div>{{ averageScore() }}%</div>
              <div>Score moyen</div>
            </div>
            <div>
              <div>{{ totalPlays() }}</div>
              <div>Parties jouées</div>
            </div>
          </div>
        </div>
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
