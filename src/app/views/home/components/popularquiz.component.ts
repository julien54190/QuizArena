import { Component, computed, Input, signal } from '@angular/core';
import { IPlayQuiz } from '../../../interfaces/quiz';
import { PLAY_QUIZZES_DATA } from '../../../data/quiz.data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popularquiz',
  imports: [CommonModule],
  template: `
  <div class="mt-20 card card-shadow">
    <h2 class="text-center text-xlg">Quiz populaires</h2>
    <div class="flex flex-wrap gap-16 filed w-full justify-content-center">
      @for (quiz of filteredQuizzes(); track quiz.id) {
        <div
          (click)="playQuiz(quiz)"
          class="card card-white mt-10 card-size text-center flex flex-col justify-content-between card-hover">
          <div class="flex flex-col justify-content-between h-full">
            <div>
              <div class="text-lg mb-10">🎯</div>
              <h3 class="text-bold mb-10">{{ quiz.title }}</h3>
              <p class="text-sm">{{ quiz.description }}</p>
            </div>
            <div class="mt-auto">
              <span class="mr-10 text-sm text-semibold badge-info">{{ quiz.questionCount }} questions</span>
              <span class="text-sm text-semibold" [ngClass]="getDifficultyClass(quiz.difficulty)">{{ quiz.difficulty }}</span>
            </div>
          </div>
        </div>
      }
  </div>

  <!-- État vide -->
  @if (filteredQuizzes().length === 0) {
    <div>
      <div>🔍</div>
      <div>Aucun quiz trouvé</div>
      <div>
        {{ (searchTerm || categoryFilter || difficultyFilter) ?
          'Aucun quiz ne correspond à vos critères de recherche.' :
          'Aucun quiz disponible pour le moment.' }}
      </div>
    </div>
  }
    </div>
  `,
  styles: ``
})
export class PopularQuizComponent {
  // Données des quiz
  quizzes = signal<IPlayQuiz[]>(PLAY_QUIZZES_DATA);

  // Recevoir les données de recherche du composant parent
  private _searchTerm = signal('');
  private _categoryFilter = signal('');
  private _difficultyFilter = signal('');

  @Input() set searchTerm(value: string) {
    this._searchTerm.set(value);
  }
  get searchTerm() {
    return this._searchTerm();
  }

  @Input() set categoryFilter(value: string) {
    this._categoryFilter.set(value);
  }
  get categoryFilter() {
    return this._categoryFilter();
  }

  @Input() set difficultyFilter(value: string) {
    this._difficultyFilter.set(value);
  }
  get difficultyFilter() {
    return this._difficultyFilter();
  }

  // Filtrer les quiz en fonction des critères de recherche
  filteredQuizzes = computed(() => {
    const searchTerm = this._searchTerm();
    const categoryFilter = this._categoryFilter();
    const difficultyFilter = this._difficultyFilter();

    let filtered = this.quizzes();

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (categoryFilter) {
      filtered = filtered.filter(quiz => quiz.category === categoryFilter);
    }

    // Filtre par difficulté
    if (difficultyFilter) {
      filtered = filtered.filter(quiz => quiz.difficulty === difficultyFilter);
    }

    // Trier par popularité (nombre de parties jouées) et limiter à 6
    return filtered
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, 6);
  })

  playQuiz(quiz: IPlayQuiz) {
    console.log('Jouer au quiz:', quiz.title);
  }

  // Obtenir la classe CSS pour la difficulté  // Méthode pour obtenir la classe CSS selon la difficulté
  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'facile': return 'badge-success';
      case 'moyen': return 'badge-warning';
      case 'difficile': return 'badge-danger';
      default: return 'badge-info';
    }
  }

}
