import { Injectable, computed } from '@angular/core';
import { IPlayQuiz } from '../interfaces/quiz';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private homeService: HomeService) {}

  // Quiz filtrés selon les critères de recherche
  filteredQuizzes = computed(() => {
    const quizzes = this.homeService.quizzes();
    const searchTerm = this.homeService.searchTerm();
    const categoryFilter = this.homeService.categoryFilter();
    const difficultyFilter = this.homeService.difficultyFilter();
    const minQuestions = this.homeService.minQuestions();
    const minScore = this.homeService.minScore();

    let filtered = quizzes;

    // Filtre par terme de recherche
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

    // Filtre par nombre minimum de questions
    if (minQuestions > 0) {
      filtered = filtered.filter(quiz => quiz.questionCount >= minQuestions);
    }

    // Filtre par score minimum
    if (minScore > 0) {
      filtered = filtered.filter(quiz => quiz.averageScore >= minScore);
    }

    return filtered;
  });

  // Quiz populaires (top 6 par nombre de parties)
  popularQuizzes = computed(() => {
    return this.filteredQuizzes()
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, 6);
  });

  // Méthode pour vérifier si des filtres sont actifs
  hasActiveFilters = computed(() => {
    return !!this.homeService.searchTerm() ||
          !!this.homeService.categoryFilter() ||
          !!this.homeService.difficultyFilter() ||
          this.homeService.minQuestions() > 0 ||
          this.homeService.minScore() > 0;
  });

  // Méthode pour obtenir le nombre de résultats
  resultCount = computed(() => this.filteredQuizzes().length);
}
