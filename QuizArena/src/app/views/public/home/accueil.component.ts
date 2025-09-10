import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopularQuizComponent } from './components/popular-quiz.component';
import { SearchBarComponent } from './components/search-bar.component';
import { StatBarComponent } from './components/stat-bar.component';
import { BestPlayersComponent } from './components/best-players.component';
import { HomeService } from '../../../services/home.service';
import { SeoService } from '../../../services/seo.service';




@Component({
  selector: 'app-accueil',
  imports: [CommonModule, SearchBarComponent, StatBarComponent, PopularQuizComponent, BestPlayersComponent],
  template: `
  <div class="home-container">
    <div class="home-content">
      <div class="text-center mb-20">
        <h1 class="text-xlg text-bold mb-10">Bienvenue sur QuizArena</h1>
        <p class="text-sm">Découvrez des milliers de quiz passionnants et testez vos connaissances dans tous les domaines</p>
      </div>
      <!-- Barre de recherche -->
      <app-search-bar></app-search-bar>
      <!-- Composant Statbar -->
      <app-stat-bar></app-stat-bar>
      <!-- Composant PopularQuiz -->
      <app-popular-quiz></app-popular-quiz>
      <!-- Composant BestPlayer -->
      <app-best-players></app-best-players>

      <!-- Section Jouer -->
      <section class="text-center mt-20" role="region" aria-labelledby="play-section-title">
        <h2 id="play-section-title" class="sr-only">Section de jeu</h2>
        <button
          (click)="goToPlay()"
          (keydown.enter)="goToPlay()"
          (keydown.space)="goToPlay()"
          class="btn btn-primary text-lg"
          aria-label="Commencer à jouer - Accéder à la page de sélection de quiz"
          type="button">
          🎮 Jouer maintenant
        </button>
      </section>

    </div>
  </div>
  `,
  styles: `
    :host{display:block;}
  `
})
export class AccueilComponent implements OnInit {
  private router = inject(Router);
  private homeService = inject(HomeService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setHomePage();
    this.homeService.loadHomeData();
  }

  // Méthode pour rediriger vers la page jouer
  goToPlay() {
    this.router.navigate(['/jouer']);
  }
}
