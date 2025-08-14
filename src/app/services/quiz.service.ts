import { Injectable, computed } from '@angular/core';
import { IPlayQuiz } from '../interfaces/quiz';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor(private homeService: HomeService) {}

  // Tous les quiz
  allQuizzes = computed(() => this.homeService.quizzes());

  // Quiz par catégorie
  quizzesByCategory = computed(() => {
    const quizzes = this.homeService.quizzes();
    const categories = this.homeService.categories();

    return categories.map(category => ({
      category: category.name,
      quizzes: quizzes.filter(quiz => quiz.category === category.name)
    }));
  });

  // Quiz par difficulté
  quizzesByDifficulty = computed(() => {
    const quizzes = this.homeService.quizzes();
    const difficulties = ['facile', 'moyen', 'difficile'];

    return difficulties.map(difficulty => ({
      difficulty,
      quizzes: quizzes.filter(quiz => quiz.difficulty === difficulty)
    }));
  });

  // Statistiques des quiz
  quizStats = computed(() => {
    const quizzes = this.homeService.quizzes();

    return {
      total: quizzes.length,
      byDifficulty: {
        facile: quizzes.filter(q => q.difficulty === 'facile').length,
        moyen: quizzes.filter(q => q.difficulty === 'moyen').length,
        difficile: quizzes.filter(q => q.difficulty === 'difficile').length
      },
      averageQuestions: quizzes.length > 0 ? Math.round(
        quizzes.reduce((sum, quiz) => sum + quiz.questionCount, 0) / quizzes.length
      ) : 0,
      averageScore: quizzes.length > 0 ? Math.round(
        quizzes.reduce((sum, quiz) => sum + quiz.averageScore, 0) / quizzes.length
      ) : 0
    };
  });

  // Méthode pour obtenir l'icône de catégorie
  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'histoire': return '🏛️';
      case 'géographie': return '🌍';
      case 'sciences': return '🔬';
      case 'littérature': return '📚';
      case 'sport': return '⚽';
      case 'musique': return '🎵';
      case 'cinéma': return '🎬';
      case 'technologie': return '💻';
      case 'art': return '🎨';
      case 'cuisine': return '👨‍🍳';
      case 'nature': return '🌱';
      default: return '🎯';
    }
  }

  // Méthode pour obtenir la classe CSS de difficulté
  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'facile': return 'badge-success';
      case 'moyen': return 'badge-warning';
      case 'difficile': return 'badge-danger';
      default: return 'badge-info';
    }
  }

  // Méthode pour jouer à un quiz
  playQuiz(quiz: IPlayQuiz) {
    console.log('Jouer au quiz:', quiz.title);
    // Ici on pourrait ajouter la logique de navigation vers la page de jeu
  }
}
