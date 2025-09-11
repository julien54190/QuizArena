import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IPlayQuiz, IQuestion } from '../interfaces/quiz';
import { HomeService } from './home.service';

import { DashboardService } from './dashboard.service';
import { LeaderboardService } from './leaderbord.service';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);
  private readonly api = 'http://localhost:3000';
  private homeService = inject(HomeService);
  private leaderboardService = inject(LeaderboardService);
  private dashboardService = inject(DashboardService);
  // Etat local pour compatibilité avec les composants existants
  private _quizzes = signal<IPlayQuiz[]>([]);
  public allQuizzes = this._quizzes.asReadonly();

  // Session locale minimale (compat front)
  private _session = signal<{
    quizId: string;
    index: number;
    start: number;
    isCompleted?: boolean;
    score?: number;
    questions: IQuestion[];
    answers: { questionId: string; selected: number; isCorrect: boolean; timeSpent: number }[];
    backendSessionId?: string;
  } | null>(null);

  private getAuthHeaders() {
    const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('auth_token') : null;
    return token ? { Authorization: `Bearer ${token}` } as any : undefined;
  }

  getAllQuizzes() {
    return this.http.get<IPlayQuiz[]>(`${this.api}/quiz`);
  }

  getQuizzesByCategory(categoryId: string | number) {
    const id = String(categoryId);
    return this.http.get<IPlayQuiz[]>(`${this.api}/quiz/category/${id}`);
  }

  getQuestionsByQuiz(quizId: string) {
    return this.http.get<any[]>(`${this.api}/question`, {
      params: { quizId },
    }).pipe(
      map(questions => questions.map(q => ({
        id: q.id,
        question: q.text,
        options: q.answers.map((a: any) => a.text),
        correctAnswer: q.answers.findIndex((a: any) => a.isCorrect),
        explanation: q.explanation || ''
      })))
    );
  }

  // --- Compatibilité méthodes attendues par les composants ---

  // Chargement mémoire
  loadAllQuizzes(): void {
    this.getAllQuizzes().subscribe(qs => this._quizzes.set(qs));
  }

  getQuizzesByCategoryId(categoryId: string | number) {
    return this.getQuizzesByCategory(categoryId);
  }

  getCategoryStatsById(_categoryId: string | number) {
    const qs = this._quizzes();
    return {
      totalQuizzes: qs.length,
      totalQuestions: (qs as any[]).reduce((a, q) => a + (q.questionCount ?? 0), 0),
      totalPlays: (qs as any[]).reduce((a, q) => a + (q.totalPlays ?? 0), 0),
      averageScore: Math.round(qs.reduce((a, q) => a + (((q as any).averageScore) ? (q as any).averageScore : 0), 0) / (qs.length || 1)),
    } as any;
  }

  getCategoryNameById(categoryId: string | number) {
    return String(categoryId);
  }

  getDifficultyClass(difficulty: string | undefined) {
    const d = (difficulty ?? '').toString().toLowerCase();
    if (d.includes('facile') || d.includes('facile'.toLowerCase()) || d.includes('facile') || d.includes('facile')) return 'badge badge-success';
    if (d.includes('diffic')) return 'badge badge-danger';
    return 'badge badge-warning';
  }

  getCategoryIcon(_category: string) {
    return '📘';
  }

  playQuiz(_quiz: IPlayQuiz) {
    // Laisser au composant/router la navigation; ici no-op pour compat
  }

  getQuizById(id: string | number) {
    const key = String(id);
    return this._quizzes().find((q: any) => String(q.id) === key || q.slug === key || q.title === key) ?? null;
  }

  // Gestion de session locale (front-only) pour compat
  startQuizSession(quizId: string | number) {
    const qid = String(quizId);
    this.getQuestionsByQuiz(qid).subscribe((questions) => {
      const base = { quizId: qid, index: 0, start: Date.now(), questions, answers: [] as any[] };
      const headers = this.getAuthHeaders();
      if (headers) {
        // Créer une session côté backend pour l'utilisateur connecté
        this.http.post<any>(`${this.api}/quiz-session`, { quizId: qid }, { headers }).subscribe({
          next: (s) => this._session.set({ ...base, backendSessionId: s?.id }),
          error: () => this._session.set(base),
        });
      } else {
        this._session.set(base);
      }
    });
  }

  getCurrentSession() {
    return this._session();
  }

  getCurrentQuestion() {
    const s = this._session();
    if (!s) return null;
    return s.questions[s.index] ?? null;
  }

  getSessionProgress() {
    const s = this._session();
    if (!s) return { current: 0, total: 0 };
    const current = Math.min(s.index + 1, s.questions.length);
    const total = s.questions.length;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    return { current, total, percentage } as any;
  }

  getQuizDetailedStats(_quizId: string | number) {
    const s = this._session();
    if (!s) return { correct: 0, total: 0, time: 0 };
    const correct = s.answers.filter(a => a.isCorrect).length;
    const total = s.questions.length;
    const time = Math.floor((Date.now() - s.start) / 1000);
    return { correct, total, time };
  }

  getUserPerformanceStats(_quizId: string | number, _answers: any[]) {
    const total = _answers?.length ?? 0;
    const correct = (_answers ?? []).filter(a => a.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const averageTime = total > 0 ? Math.round((_answers ?? []).reduce((a, x) => a + (x.timeSpent ?? 0), 0) / total) : 0;
    return { accuracy, averageTime } as any;
  }

  getImprovementSuggestions(_quizId: string | number, _answers: any[]) {
    return [] as string[];
  }

  getQuizQuestions(quizId: string | number) {
    // Pour compat dans le template/composant qui attend un tableau synchronement
    const s = this._session();
    if (s && String(s.quizId) === String(quizId)) return s.questions;
    return [] as IQuestion[];
  }

  // Utilisé par les templates qui attendent un tableau directement
  filteredQuizzes() {
    return this._quizzes();
  }

  answerQuestion(selectedIndex: number, correctIndexOrTime: number, timeSpentOpt?: number) {
    const s = this._session();
    if (!s) return;
    const q = s.questions[s.index];
    const providedCorrectIndex = (timeSpentOpt !== undefined) ? correctIndexOrTime : undefined;
    const timeSpentSec = (timeSpentOpt !== undefined) ? timeSpentOpt : (correctIndexOrTime ?? 0);
    const isCorrect = providedCorrectIndex !== undefined
      ? selectedIndex === providedCorrectIndex
      : selectedIndex === (q as any).correctAnswer;
    s.answers.push({ questionId: (q as any).id?.toString?.() ?? `${s.index}`, selected: selectedIndex, isCorrect, timeSpent: timeSpentSec });
    // Envoyer la réponse au backend si une session existe et que l'utilisateur est connecté
    if (s.backendSessionId) {
      const headers = this.getAuthHeaders();
      if (headers) {
        this.http.post(`${this.api}/quiz-session/${s.backendSessionId}/answer`, {
          questionId: (q as any).id,
          selectedAnswer: selectedIndex,
          timeSpent: timeSpentSec,
        }, { headers }).subscribe({ next: () => {}, error: () => {} });
      }
    }
    s.index = Math.min(s.index + 1, s.questions.length);
    if (s.index >= s.questions.length) {
      s.isCompleted = true;
      const correct = s.answers.filter(a => a.isCorrect).length;
      s.score = Math.round((correct / (s.questions.length || 1)) * 100);
      // Si session backend, marquer comme complétée pour l'utilisateur connecté
      if (s.backendSessionId) {
        const headers = this.getAuthHeaders();
        if (headers) {
          this.http.post(`${this.api}/quiz-session/${s.backendSessionId}/complete`, {}, { headers }).subscribe({ next: () => {}, error: () => {} });
        }
      }
      // Sauvegarder la session en base de données
      this.saveSessionToDatabase(s);

      // Rafraîchir stats d'accueil et leaderboard
      this.homeService.loadHomeData();
      this.leaderboardService.load(3);
      // Rafraîchir le tableau de bord utilisateur
      this.dashboardService.loadFromApi();
    }
    this._session.set({ ...s });
  }

  private saveSessionToDatabase(session: any) {
    const headers = this.getAuthHeaders();
    if (headers && session.backendSessionId) {
      // Déjà stocké pour l'utilisateur connecté via endpoints dédiés
      return;
    }
    // Sinon: session invité (fallback)
    const sessionData = {
      quizId: session.quizId,
      startTime: new Date(session.start).toISOString(),
      endTime: new Date().toISOString(),
      isCompleted: true,
      score: session.score
    };
    this.http.post(`${this.api}/quiz-session/guest`, sessionData).subscribe({ next: () => {}, error: () => {} });
  }

  resetSession() {
    this._session.set(null);
  }

  getCorrectAnswersCount(curr: { answers: { isCorrect: boolean }[] } | null) {
    return curr?.answers?.filter(a => a.isCorrect).length ?? 0;
  }

  getTotalTimeLabel(curr: { start: number } | null) {
    if (!curr) return '00:00';
    const sec = Math.floor((Date.now() - curr.start) / 1000);
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  getScoreClass(score: number) {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  }

  getScoreMessage(score: number) {
    if (score >= 80) return 'Excellent !';
    if (score >= 50) return 'Bien joué, continue !';
    return 'Tu peux faire mieux, réessaie !';
  }
}
