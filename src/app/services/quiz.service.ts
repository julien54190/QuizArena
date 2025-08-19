import { Injectable, computed, signal } from '@angular/core';
import { IPlayQuiz, IQuestion, IQuizAnswer, IQuizSession } from '../interfaces/quiz';
import { HomeService } from './home.service';
import { getQuizQuestions as getQuestionsFromData } from '../data/questions.data';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor(private homeService: HomeService) {}

  // Signal pour la session de quiz actuelle
  private currentSession = signal<IQuizSession | null>(null);

  // Tous les quiz
  allQuizzes = computed(() => this.homeService.quizzes());

  // Quiz par catégorie
  quizzesByCategory = computed(() => {
    const quizzes = this.homeService.quizzes();
    const categories = this.homeService.categories();

    return categories.map(category => ({
      category: category.name,
      quizzes: quizzes.filter(quiz => quiz.categories.includes(category.name))
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

  // Méthode pour obtenir un quiz par ID
  getQuizById(id: number): IPlayQuiz | undefined {
    return this.allQuizzes().find(quiz => quiz.id === id);
  }

  // Méthode pour obtenir le nom de catégorie par ID
  getCategoryNameById(id: number): string {
    const categories = [
      { id: 1, name: 'Histoire' },
      { id: 2, name: 'Géographie' },
      { id: 3, name: 'Sciences' },
      { id: 4, name: 'Culture Générale' },
      { id: 5, name: 'Sport' },
      { id: 6, name: 'Technologie' },
      { id: 7, name: 'Cuisine' },
      { id: 8, name: 'Nature' },
      { id: 9, name: 'Cinéma' }
    ];
    return categories.find(cat => cat.id === id)?.name || '';
  }

  // Méthode pour obtenir les quiz d'une catégorie par ID
  getQuizzesByCategoryId(categoryId: number): IPlayQuiz[] {
    const categoryName = this.getCategoryNameById(categoryId);
    return this.allQuizzes().filter(quiz => quiz.categories.includes(categoryName));
  }

  // Méthode pour obtenir les statistiques d'une catégorie par ID
  getCategoryStatsById(categoryId: number) {
    const categoryName = this.getCategoryNameById(categoryId);
    const categoryQuizzes = this.allQuizzes().filter(quiz =>
      quiz.categories.includes(categoryName)
    );

    if (categoryQuizzes.length === 0) {
      return null;
    }

    const totalQuestions = categoryQuizzes.reduce((sum, quiz) => sum + quiz.questionCount, 0);
    const totalPlays = categoryQuizzes.reduce((sum, quiz) => sum + quiz.totalPlays, 0);
    const averageScore = Math.round(
      categoryQuizzes.reduce((sum, quiz) => sum + quiz.averageScore, 0) / categoryQuizzes.length
    );

    return {
      categoryName,
      totalQuizzes: categoryQuizzes.length,
      totalQuestions,
      totalPlays,
      averageScore,
      averageQuestionsPerQuiz: Math.round(totalQuestions / categoryQuizzes.length)
    };
  }

  // === NOUVELLES MÉTHODES POUR LES SESSIONS DE QUIZ ===

  // Démarrer une nouvelle session de quiz
  startQuizSession(quizId: number): IQuizSession {
    const session: IQuizSession = {
      quizId,
      startTime: new Date(),
      answers: [],
      currentQuestionIndex: 0,
      isCompleted: false
    };

    this.currentSession.set(session);
    return session;
  }

  // Obtenir les statistiques détaillées d'un quiz
  getQuizDetailedStats(quizId: number) {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return null;

    const questions = this.getQuizQuestions(quizId);
    const totalQuestions = questions.length;

    // Calculer la difficulté basée sur les questions
    const difficultyScores = questions.map(q => {
      // Logique simple : plus d'options = plus difficile
      return q.options.length > 4 ? 3 : q.options.length > 3 ? 2 : 1;
    });

    const averageDifficulty = Math.round(
      difficultyScores.reduce((sum, score) => sum + score, 0) / totalQuestions
    );

    return {
      quizId,
      title: quiz.title,
      totalQuestions,
      averageDifficulty,
      estimatedTime: Math.round(totalQuestions * 1.5), // 1.5 min par question
      categories: quiz.categories,
      difficulty: quiz.difficulty,
      creator: quiz.creator,
      createdAt: quiz.createdAt
    };
  }

  // Obtenir les questions par difficulté
  getQuestionsByDifficulty(quizId: number) {
    const questions = this.getQuizQuestions(quizId);
    const easyQuestions = questions.filter(q => q.options.length <= 3);
    const mediumQuestions = questions.filter(q => q.options.length === 4);
    const hardQuestions = questions.filter(q => q.options.length > 4);

    return {
      facile: easyQuestions,
      moyen: mediumQuestions,
      difficile: hardQuestions
    };
  }

  // Obtenir des questions aléatoires d'un quiz
  getRandomQuestions(quizId: number, count: number = 10): IQuestion[] {
    const questions = this.getQuizQuestions(quizId);
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  }

  // Vérifier si un quiz a des questions
  hasQuestions(quizId: number): boolean {
    const questions = this.getQuizQuestions(quizId);
    return questions.length > 0;
  }

  // Obtenir le temps estimé pour un quiz
  getEstimatedTime(quizId: number): number {
    const questions = this.getQuizQuestions(quizId);
    return Math.round(questions.length * 1.5); // 1.5 minutes par question
  }

  // Obtenir la session actuelle
  getCurrentSession(): IQuizSession | null {
    return this.currentSession();
  }

  // Répondre à une question
  answerQuestion(questionId: number, selectedAnswer: number, timeSpent: number): void {
    const session = this.currentSession();
    if (!session) return;

    const quiz = this.getQuizById(session.quizId);
    if (!quiz?.questions) return;

    const question = quiz.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedAnswer === question.correctAnswer;

    const answer: IQuizAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent
    };

    session.answers.push(answer);
    session.currentQuestionIndex++;

    // Vérifier si le quiz est terminé
    if (session.currentQuestionIndex >= quiz.questions.length) {
      this.completeQuizSession();
    }

    this.currentSession.set({ ...session });
  }

  // Terminer la session de quiz
  completeQuizSession(): void {
    const session = this.currentSession();
    if (!session) return;

    session.endTime = new Date();
    session.isCompleted = true;
    session.score = this.calculateScore(session);

    this.currentSession.set({ ...session });
  }

  // Calculer le score d'une session
  calculateScore(session: IQuizSession): number {
    if (session.answers.length === 0) return 0;

    const correctAnswers = session.answers.filter(answer => answer.isCorrect).length;
    return Math.round((correctAnswers / session.answers.length) * 100);
  }

  // Obtenir les questions d'un quiz
  getQuizQuestions(quizId: number): IQuestion[] {
    return getQuestionsFromData(quizId);
  }

  // Obtenir la question actuelle
  getCurrentQuestion(): IQuestion | null {
    const session = this.currentSession();
    if (!session) return null;

    const quiz = this.getQuizById(session.quizId);
    if (!quiz?.questions) return null;

    return quiz.questions[session.currentQuestionIndex] || null;
  }

  // Obtenir le progrès de la session
  getSessionProgress(): { current: number; total: number; percentage: number } {
    const session = this.currentSession();
    if (!session) return { current: 0, total: 0, percentage: 0 };

    const quiz = this.getQuizById(session.quizId);
    if (!quiz?.questions) return { current: 0, total: 0, percentage: 0 };

    const total = quiz.questions.length;
    const current = session.currentQuestionIndex;
    const percentage = Math.round((current / total) * 100);

    return { current, total, percentage };
  }

  // Réinitialiser la session
  resetSession(): void {
    this.currentSession.set(null);
  }

  // === MÉTHODES POUR L'ANALYSE ET LES STATISTIQUES ===

  // Obtenir les statistiques de performance d'un utilisateur
  getUserPerformanceStats(quizId: number, answers: IQuizAnswer[]) {
    if (answers.length === 0) return null;

    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
    const averageTime = Math.round(totalTime / answers.length);

    // Analyser les questions les plus difficiles
    const questionStats = answers.map(answer => ({
      questionId: answer.questionId,
      isCorrect: answer.isCorrect,
      timeSpent: answer.timeSpent
    }));

    return {
      quizId,
      totalQuestions: answers.length,
      correctAnswers,
      accuracy: Math.round((correctAnswers / answers.length) * 100),
      totalTime,
      averageTime,
      questionStats
    };
  }

  // Obtenir des suggestions d'amélioration
  getImprovementSuggestions(quizId: number, answers: IQuizAnswer[]) {
    const stats = this.getUserPerformanceStats(quizId, answers);
    if (!stats) return [];

    const suggestions = [];

    if (stats.accuracy < 50) {
      suggestions.push("Considérez revoir les bases de ce sujet");
    } else if (stats.accuracy < 70) {
      suggestions.push("Continuez à pratiquer pour améliorer votre score");
    } else if (stats.accuracy < 90) {
      suggestions.push("Excellent travail ! Quelques erreurs mineures à corriger");
    } else {
      suggestions.push("Parfait ! Vous maîtrisez parfaitement ce sujet");
    }

    if (stats.averageTime > 120) {
      suggestions.push("Essayez de répondre plus rapidement aux questions");
    }

    return suggestions;
  }

  // === MÉTHODES UTILES POUR SCORES ET TEMPS ===

  // Nombre de réponses correctes pour une session donnée
  getCorrectAnswersCount(session: IQuizSession | null): number {
    if (!session) return 0;
    return session.answers.filter(answer => answer.isCorrect).length;
  }

  // Libellé du temps total écoulé pour une session donnée
  getTotalTimeLabel(session: IQuizSession | null): string {
    if (!session?.endTime) return '0 min';

    const totalSeconds = Math.round(
      (session.endTime.getTime() - session.startTime.getTime()) / 1000
    );
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} s`;
  }

  // Classe CSS (nom logique) selon le score
  getScoreClass(score: number): string {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-average';
    return 'score-poor';
  }

  // Message utilisateur selon le score
  getScoreMessage(score: number): string {
    if (score >= 80) return 'Excellent ! Vous maîtrisez parfaitement ce sujet.';
    if (score >= 60) return 'Bien joué ! Vous avez de bonnes connaissances.';
    if (score >= 40) return 'Pas mal ! Continuez à vous améliorer.';
    return "N'abandonnez pas ! La pratique rend parfait.";
  }

  // Vérifier si un quiz est recommandé pour un utilisateur
  isQuizRecommended(quizId: number, userLevel: 'débutant' | 'intermédiaire' | 'expert' = 'intermédiaire'): boolean {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return false;

    const difficultyMap = {
      'facile': 1,
      'moyen': 2,
      'difficile': 3
    };

    const levelMap = {
      'débutant': 1,
      'intermédiaire': 2,
      'expert': 3
    };

    return difficultyMap[quiz.difficulty] <= levelMap[userLevel];
  }

  // Obtenir des quiz similaires
  getSimilarQuizzes(quizId: number, limit: number = 5): IPlayQuiz[] {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return [];

    const allQuizzes = this.allQuizzes();

    return allQuizzes
      .filter(q => q.id !== quizId && q.categories.some(cat => quiz.categories.includes(cat)))
      .sort((a, b) => {
        // Priorité aux quiz avec plus de catégories communes
        const aCommonCategories = a.categories.filter(cat => quiz.categories.includes(cat)).length;
        const bCommonCategories = b.categories.filter(cat => quiz.categories.includes(cat)).length;
        return bCommonCategories - aCommonCategories;
      })
      .slice(0, limit);
  }
}
