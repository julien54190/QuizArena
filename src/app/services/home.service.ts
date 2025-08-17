import { Injectable, signal, computed } from '@angular/core';
import { IPlayQuiz } from '../interfaces/quiz';
import { IUser } from '../interfaces/user';
import { ICategory } from '../interfaces/category';
import { PLAY_QUIZZES_DATA } from '../data/quiz.data';
import { USERS_DATA } from '../data/users.data';
import { CATEGORIES_DATA } from '../data/categories.data';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  // Données brutes
  private _quizzes = signal<IPlayQuiz[]>(PLAY_QUIZZES_DATA);
  private _users = signal<IUser[]>(USERS_DATA);
  private _categories = signal<ICategory[]>(CATEGORIES_DATA);

  // Filtres de recherche
  private _searchTerm = signal('');
  private _categoryFilter = signal('');
  private _difficultyFilter = signal('');
  private _minQuestions = signal(0);
  private _minScore = signal(0);

  // Données exposées
  quizzes = this._quizzes.asReadonly();
  users = this._users.asReadonly();

    // Catégories avec le nombre de quiz calculé dynamiquement
  categories = computed(() => {
    const categoriesData = this._categories();
    const quizzesData = this._quizzes();

    return categoriesData.map(category => ({
      ...category,
      quizCount: quizzesData.filter(quiz => quiz.categories.includes(category.name)).length
    }));
  });

  // Filtres exposés
  searchTerm = this._searchTerm.asReadonly();
  categoryFilter = this._categoryFilter.asReadonly();
  difficultyFilter = this._difficultyFilter.asReadonly();
  minQuestions = this._minQuestions.asReadonly();
  minScore = this._minScore.asReadonly();

  // Statistiques globales
  totalQuizzes = computed(() => this._quizzes().length);
  totalCategories = computed(() => this._categories().length);
  totalUsers = computed(() => this._users().filter(user => user.status === 'active').length);

  averageScore = computed(() => {
    const scores = this._quizzes().map(quiz => quiz.averageScore);
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, score) => acc + score, 0);
    return Math.round(total / scores.length);
  });

  totalPlays = computed(() => {
    return this._quizzes().reduce((sum, quiz) => sum + quiz.totalPlays, 0);
  });

  // Méthodes pour mettre à jour les filtres
  updateSearchFilters(filters: {
    searchTerm: string;
    categoryFilter: string;
    difficultyFilter: string;
    minQuestions: number;
    minScore: number;
  }) {
    this._searchTerm.set(filters.searchTerm);
    this._categoryFilter.set(filters.categoryFilter);
    this._difficultyFilter.set(filters.difficultyFilter);
    this._minQuestions.set(filters.minQuestions);
    this._minScore.set(filters.minScore);
  }

  resetFilters() {
    this._searchTerm.set('');
    this._categoryFilter.set('');
    this._difficultyFilter.set('');
    this._minQuestions.set(0);
    this._minScore.set(0);
  }
}
