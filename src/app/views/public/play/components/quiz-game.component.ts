import { Component, Input, inject, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { SeoService } from '../../../../services/seo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-game',
  imports: [CommonModule],
  template: `
    <section class="quiz-game-container card card-shadow" role="main" aria-labelledby="quiz-title">
      @if (currentSession()) {
        <div class="quiz-header">
          <div class="flex justify-content-between align-items-center mb-20">
            <button (click)="quitQuiz()" class="btn btn-outline-primary">← Quitter le quiz</button>
          </div>

          <h1 id="quiz-title" class="text-center text-xlg text-bold mb-10">{{ currentQuiz()?.title }}</h1>

          <div class="progress-container mb-20">
            <div class="progress-bar">
              <div
                class="progress-fill"
                [style.width.%]="sessionProgress().percentage"
                role="progressbar"
                aria-label="Progression du quiz"
                [attr.aria-valuemin]="0"
                [attr.aria-valuenow]="sessionProgress().current"
                [attr.aria-valuemax]="sessionProgress().total">
              </div>
            </div>
            <div class="flex justify-content-between align-items-center mt-10">
              <span class="text-sm text-semibold">Question {{ displayQuestionNumber() }} sur {{ sessionProgress().total }}</span>
              <span class="text-sm text-semibold">{{ sessionProgress().percentage }}%</span>
            </div>
          </div>
        </div>

        @if (currentQuestion()) {
          <div class="card card-white mt-30" role="region" aria-labelledby="question-text">
            <div class="p-25">
              <div class="mb-20">
                <h2 id="question-text" class="text-lg text-bold">{{ currentQuestion()?.question }}</h2>
              </div>

              <div class="flex flex-col gap-16" role="radiogroup" [attr.aria-labelledby]="'question-text'">
                @for (option of currentQuestion()?.options; track $index) {
                  <div class="flex align-items-center gap-12">
                    <input
                      type="radio"
                      [id]="'option-' + $index"
                      name="quiz-option"
                      [value]="$index"
                      [checked]="selectedAnswer() === $index"
                      (change)="selectAnswer($index)"
                      [disabled]="showFeedback()"
                      class="sr-only">

                    <label
                      [for]="'option-' + $index"
                      class="option-label flex align-items-center flex-1 p-12 radius mr-10"
                      [class.selected]="selectedAnswer() === $index"
                      [class.correct]="showFeedback() && $index === currentQuestion()?.correctAnswer"
                      [class.incorrect]="showFeedback() && selectedAnswer() === $index && $index !== currentQuestion()?.correctAnswer"
                      tabindex="0"
                      (keydown.enter)="selectAnswer($index)"
                      (keydown.space)="selectAnswer($index)">
                      <span class="flex-1">{{ option }}</span>
                      @if (showFeedback() && $index === currentQuestion()?.correctAnswer) {
                        <span class="text-bold feedback-icon">✓</span>
                      }
                      @if (showFeedback() && selectedAnswer() === $index && $index !== currentQuestion()?.correctAnswer) {
                        <span class="text-bold feedback-icon">✗</span>
                      }
                    </label>
                  </div>
                }
              </div>

              @if (showFeedback()) {
                <div class="card mt-20" [class]="lastAnswer()?.isCorrect ? 'correct-feedback' : 'incorrect-feedback'" aria-live="polite">
                  <div class="text-center mb-10">
                    @if (lastAnswer()?.isCorrect) {
                      <span class="text-lg text-bold">✓ Correct !</span>
                    } @else {
                      <span class="text-lg text-bold">✗ Incorrect</span>
                    }
                  </div>
                  @if (currentQuestion()?.explanation) {
                    <div class="p-12 radius explanation">
                      <p class="text-sm explanation-text">{{ currentQuestion()?.explanation }}</p>
                    </div>
                  }
                </div>
              }

              <div class="text-center mt-20">
                @if (!showFeedback()) {
                  <button (click)="submitAnswer()" [disabled]="selectedAnswer() === null" class="btn btn-primary">
                    Valider
                  </button>
                } @else {
                  <button (click)="nextQuestion()" class="btn btn-primary">
                    Question suivante
                  </button>
                }
              </div>
            </div>
          </div>
        } @else if (currentSession()?.isCompleted) {
          <div class="card card-white" role="region" aria-labelledby="results-title">
            <div class="text-center p-25">
              <h2 id="results-title" class="text-center text-xlg text-bold mb-20">Quiz terminé !</h2>

              <div class="text-center mb-20">
                <div class="flex align-items-center justify-content-center score-circle radius" [class]="getScoreClass(currentSession()?.score || 0)">
                  <span class="text-xlg text-bold">{{ currentSession()?.score }}%</span>
                </div>
                <p class="text-lg text-semibold mt-10">{{ getScoreMessage(currentSession()?.score || 0) }}</p>
              </div>

              <div class="flex justify-content-between mb-20">
                <div class="stat-item text-center">
                  <span class="stat-label block text-sm mb-10">Réponses correctes :</span>
                  <span class="block text-lg text-bold">{{ getCorrectAnswers() }} / {{ sessionProgress().total }}</span>
                </div>
                <div class="text-center">
                  <span class="stat-label block text-sm mb-10">Temps total :</span>
                  <span class="block text-lg text-bold">{{ getTotalTime() }}</span>
                </div>
                @if (performanceStats()) {
                  <div class="text-center">
                    <span class="stat-label block text-sm mb-10">Temps moyen :</span>
                    <span class="block text-lg text-bold">{{ performanceStats()?.averageTime }}s</span>
                  </div>
                }
              </div>

              @if (improvementSuggestions().length > 0) {
                <div class="suggestions-container card my-20 ">
                  <h3 class="text-lg text-bold mb-10">Suggestions d'amélioration :</h3>
                  <ul>
                    @for (suggestion of improvementSuggestions(); track $index) {
                      <li class="suggestion-item text-sm ">{{ suggestion }}</li>
                    }
                  </ul>
                </div>
              }

              <div class="flex justify-content-center gap-16">
                <button (click)="restartQuiz()" class="btn btn-primary">Recommencer</button>
                <button (click)="quitQuiz()" class="btn btn-outline-primary">Retour aux quiz</button>
              </div>
            </div>
          </div>
        }
      } @else {
        <div class="card card-white text-center p-25">
          <p class="text-lg text-semibold">Chargement du quiz...</p>
        </div>
      }
    </section>
  `,
  styles: ``
})
export class QuizGameComponent implements OnInit, OnDestroy {
  @Input() quizId!: number;

  private quizService = inject(QuizService);
  private router = inject(Router);
  private seoService = inject(SeoService);

  // Signaux pour l'état du jeu
  selectedAnswer = signal<number | null>(null);
  private startTime = signal<number>(0);
  showFeedback = signal<boolean>(false);
  lastAnswer = signal<{ selected: number; correct: number; isCorrect: boolean } | null>(null);

  // Données exposées
  currentSession = computed(() => this.quizService.getCurrentSession());
  currentQuiz = computed(() => this.quizService.getQuizById(this.quizId));
  currentQuestion = computed(() => this.quizService.getCurrentQuestion());
  sessionProgress = computed(() => this.quizService.getSessionProgress());

  // Nouvelles données calculées
  quizStats = computed(() => this.quizService.getQuizDetailedStats(this.quizId));
  performanceStats = computed(() => {
    const session = this.currentSession();
    if (!session?.isCompleted) return null;
    return this.quizService.getUserPerformanceStats(this.quizId, session.answers);
  });
  improvementSuggestions = computed(() => {
    const session = this.currentSession();
    if (!session?.isCompleted) return [];
    return this.quizService.getImprovementSuggestions(this.quizId, session.answers);
  });

  ngOnInit(): void {
    this.startQuiz();
  }

  ngOnDestroy(): void {
    // Nettoyer si nécessaire
  }

  // Démarrer le quiz
  startQuiz(): void {
    this.quizService.startQuizSession(this.quizId);
    this.startTime.set(Date.now());
    this.showFeedback.set(false);
    this.lastAnswer.set(null);

    // Charger les questions pour ce quiz
    const quiz = this.currentQuiz();
    if (quiz && !quiz.questions) {
      quiz.questions = this.quizService.getQuizQuestions(this.quizId);
    }

    // SEO: titre/meta
    if (quiz) {
      this.seoService.setQuizPage(quiz.title, quiz.description, quiz.categories);
    }
  }

  // Sélectionner une réponse
  selectAnswer(answerIndex: number): void {
    this.selectedAnswer.set(answerIndex);
  }

  // Soumettre la réponse
  submitAnswer(): void {
    if (this.selectedAnswer() === null) return;

    const question = this.currentQuestion();
    if (!question) return;

    // Afficher le feedback
    this.showFeedback.set(true);
    this.lastAnswer.set({
      selected: this.selectedAnswer()!,
      correct: question.correctAnswer,
      isCorrect: this.selectedAnswer() === question.correctAnswer
    });
  }

  // Passer à la question suivante
  nextQuestion(): void {
    const question = this.currentQuestion();
    if (!question) return;

    const timeSpent = Math.round((Date.now() - this.startTime()) / 1000);

    this.quizService.answerQuestion(
      question.id,
      this.lastAnswer()?.selected || 0,
      timeSpent
    );

    // Réinitialiser pour la prochaine question
    this.selectedAnswer.set(null);
    this.startTime.set(Date.now());
    this.showFeedback.set(false);
    this.lastAnswer.set(null);
  }

  // Quitter le quiz
  quitQuiz(): void {
    this.quizService.resetSession();
    this.router.navigate(['/jouer']);
  }

  // Recommencer le quiz
  restartQuiz(): void {
    this.quizService.resetSession();
    this.showFeedback.set(false);
    this.lastAnswer.set(null);
    this.startQuiz();
  }

  // Délégation au service pour le calcul des métriques et libellés
  getCorrectAnswers(): number {
    return this.quizService.getCorrectAnswersCount(this.currentSession());
  }

  getTotalTime(): string {
    return this.quizService.getTotalTimeLabel(this.currentSession());
  }

  getScoreClass(score: number): string {
    return this.quizService.getScoreClass(score);
  }

  getScoreMessage(score: number): string {
    return this.quizService.getScoreMessage(score);
  }

  // Empêche d'afficher 11/10 lorsque la session est terminée
  displayQuestionNumber(): number {
    const session = this.currentSession();
    const progress = this.sessionProgress();
    if (!session) return 0;
    return session.isCompleted ? progress.total : progress.current + 1;
  }
}
