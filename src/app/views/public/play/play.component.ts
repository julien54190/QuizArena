import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectCategoryComponent } from "./components/select-category.component";
import { QuizListComponent } from "./components/quiz-list.component";
import { QuizGameComponent } from './components/quiz-game.component';
import { HomeService } from '../../../services/home.service';
import { QuizService } from '../../../services/quiz.service';
import { SeoService } from '../../../services/seo.service';

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
export class PlayComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private homeService = inject(HomeService);
  private quizService = inject(QuizService);
  private seoService = inject(SeoService);

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

  ngOnInit(): void {
    // SEO par défaut pour la page play
    this.seoService.setPlayPage();
  }

  constructor() {
    // Écouter les changements de paramètres de route
    this.route.params.subscribe(params => {
      const categoryId = params['categoryId'];
      this.selectedCategoryId.set(categoryId || null);

      const quizIdParam = params['quizId'];
      this.selectedQuizId.set(quizIdParam ? Number(quizIdParam) : null);

      // Mettre à jour le SEO selon les paramètres
      if (categoryId && !quizIdParam) {
        const category = this.categories().find(cat => cat.id.toString() === categoryId);
        if (category) {
          this.seoService.setCategoryPage(category.name);
        }
      }
    });
  }

  // Méthodes
  goBack(): void {
    this.router.navigate(
      this.selectedQuizId() && this.selectedCategoryId()
        ? ['/jouer', this.selectedCategoryId()!]
        : ['/jouer']
    );
  }

}
