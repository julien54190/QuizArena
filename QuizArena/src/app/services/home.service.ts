import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPlayQuiz } from '../interfaces/quiz';
import { IUser } from '../interfaces/user';
import { ICategory } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private http = inject(HttpClient);
  private readonly api = 'http://localhost:3000';

  // Données brutes
  private _quizzes = signal<IPlayQuiz[]>([]);
  private _users = signal<IUser[]>([]);
  private _categories = signal<ICategory[]>([]);

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

    return categoriesData.map((category: any) => {
      const count = quizzesData.filter((quiz: any) => {
        const list = Array.isArray(quiz?.categories) ? quiz.categories : [];
        const byList = list.includes?.(category?.name);
        const byName = (quiz?.category?.name && category?.name) ? quiz.category.name === category.name : false;
        const byId = (quiz?.categoryId && category?.id) ? String(quiz.categoryId) === String(category.id) : false;
        return !!(byList || byName || byId);
      }).length;
      return { ...category, quizCount: count };
    });
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
    const scores = this._quizzes().map(quiz => quiz.averageScore || 0).filter(score => !isNaN(score));
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, score) => acc + score, 0);
    return Math.round(total / scores.length);
  });

  totalPlays = computed(() => {
    return this._quizzes().reduce((sum, quiz) => sum + (quiz.totalPlays || 0), 0);
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

  // Chargement initial depuis l'API backend
  loadHomeData(): void {
    this.http.get<ICategory[]>(`${this.api}/category`).subscribe((categories) => {
      this._categories.set(categories);
    });
    this.http.get<IPlayQuiz[]>(`${this.api}/quiz`).subscribe((quizzes) => {
      this._quizzes.set(quizzes);
    });
    // Optionnel: charger des stats utilisateurs si un endpoint existe
    // this.http.get<IUser[]>(`${this.api}/user`).subscribe((users) => this._users.set(users));
  }
}
