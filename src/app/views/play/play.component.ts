import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectCategoryComponent } from "./components/select-category.component";
import { QuizListComponent } from "./components/quiz-list.component";
import { HomeService } from '../../services/home.service';
import { QuizService } from '../../services/quiz.service';
import { QuizGameComponent } from './components/quiz-game.component';

@Component({
  selector: 'app-play',
  imports: [SelectCategoryComponent, QuizListComponent, QuizGameComponent],
  template: `
  <div class="home-container">
    <div class="home-content">
      <div class="text-center mb-20">
        <h1 class="text-xlg text-bold mb-10">Jouer aux Quiz</h1>
        <p class="text-sm">Choisissez une catégorie, sélectionnez un quiz et testez vos connaissances !
        Relevez le défi et améliorez votre score.</p>
      </div>

      @if (selectedQuizId()) {
        <!-- Affichage du jeu -->
        <app-quiz-game [quizId]="selectedQuizId()!"></app-quiz-game>
      } @else if (selectedCategoryId()) {
        <!-- Affichage des quiz de la catégorie sélectionnée -->
        <div class="text-center mb-20">
          <button (click)="goBack()" class="btn btn-outline-primary mb-10">
            ← Retour aux catégories
          </button>
          <h2 class="text-lg text-bold">{{ selectedCategory()?.name }}</h2>
          <p class="text-sm">{{ selectedCategory()?.description }}</p>
        </div>

        <!-- Affichage des quiz de la catégorie -->
        <app-quiz-list [categoryId]="selectedCategoryId()!"></app-quiz-list>
      } @else {
        <!-- Affichage des catégories -->
        <app-select-category></app-select-category>
      }
    </div>
  </div>
  `,
  styles: ``
})
export class PlayComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private homeService = inject(HomeService);
  private quizService = inject(QuizService);

  // Signaux pour la gestion de l'état
  selectedCategoryId = signal<string | null>(null);
  selectedQuizId = signal<number | null>(null);

  // Données exposées
  categories = this.homeService.categories;

  // Computed pour la catégorie sélectionnée
  selectedCategory = computed(() => {
    const categoryId = this.selectedCategoryId();
    if (!categoryId) return null;
    return this.categories().find(cat => cat.id.toString() === categoryId);
  });

  constructor() {
    // Écouter les changements de paramètres de route
    this.route.params.subscribe(params => {
      const categoryId = params['categoryId'];
      this.selectedCategoryId.set(categoryId || null);

      const quizIdParam = params['quizId'];
      this.selectedQuizId.set(quizIdParam ? Number(quizIdParam) : null);
    });
  }

  // Méthodes
  goBack(): void {
    // Si on est dans un quiz, retour à la liste de la catégorie si possible, sinon aux catégories
    if (this.selectedQuizId()) {
      if (this.selectedCategoryId()) {
        this.router.navigate(['/jouer', this.selectedCategoryId()!]);
      } else {
        this.router.navigate(['/jouer']);
      }
    } else {
      this.router.navigate(['/jouer']);
    }
  }
}
