import { Component, Input, inject, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { IPlayQuiz, IQuestion, IQuizSession } from '../../../interfaces/quiz';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-game',
  imports: [CommonModule],
  template: `
  <div>
    @if (currentSession()) {
      <div>
        <div>
          <button (click)="quitQuiz()">← Quitter le quiz</button>
        </div>

        <h1>{{ currentQuiz()?.title }}</h1>

        <div>
          <div>
            <span>Question {{ sessionProgress().current + 1 }} sur {{ sessionProgress().total }}</span>
            <span>{{ sessionProgress().percentage }}%</span>
          </div>
        </div>
      </div>

      @if (currentQuestion()) {
        <div>
          <div>
            <div>
              <h2>{{ currentQuestion()?.question }}</h2>
            </div>

            <div>
              @for (option of currentQuestion()?.options; track $index) {
                <div>
                  <input
                    type="radio"
                    [id]="'option-' + $index"
                    name="quiz-option"
                    [value]="$index"
                    [checked]="selectedAnswer() === $index"
                    (change)="selectAnswer($index)"
                    [disabled]="showFeedback()">

                  <label [for]="'option-' + $index">
                    <span>{{ option }}</span>
                    @if (showFeedback() && $index === currentQuestion()?.correctAnswer) {
                      <span>✓</span>
                    }
                    @if (showFeedback() && selectedAnswer() === $index && $index !== currentQuestion()?.correctAnswer) {
                      <span>✗</span>
                    }
                  </label>
                </div>
              }
            </div>

            @if (showFeedback()) {
              <div>
                <div>
                  @if (lastAnswer()?.isCorrect) {
                    <span>✓ Correct !</span>
                  } @else {
                    <span>✗ Incorrect</span>
                  }
                </div>
                @if (currentQuestion()?.explanation) {
                  <div>
                    <p>{{ currentQuestion()?.explanation }}</p>
                  </div>
                }
              </div>
            }

            <div>
              @if (!showFeedback()) {
                <button (click)="submitAnswer()" [disabled]="selectedAnswer() === null">
                  Valider
                </button>
              } @else {
                <button (click)="nextQuestion()">
                  Question suivante
                </button>
              }
            </div>
          </div>
        </div>
      } @else if (currentSession()?.isCompleted) {
        <div>
          <div>
            <h2>Quiz terminé !</h2>

            <div>
              <div>
                <span>{{ currentSession()?.score }}%</span>
              </div>
              <p>{{ getScoreMessage(currentSession()?.score || 0) }}</p>
            </div>

            <div>
              <div>
                <span>Réponses correctes :</span>
                <span>{{ getCorrectAnswers() }} / {{ sessionProgress().total }}</span>
              </div>
              <div>
                <span>Temps total :</span>
                <span>{{ getTotalTime() }}</span>
              </div>
              @if (performanceStats()) {
                <div>
                  <span>Temps moyen :</span>
                  <span>{{ performanceStats()?.averageTime }}s</span>
                </div>
              }
            </div>

            @if (improvementSuggestions().length > 0) {
              <div>
                <h3>Suggestions d'amélioration :</h3>
                <ul>
                  @for (suggestion of improvementSuggestions(); track $index) {
                    <li>{{ suggestion }}</li>
                  }
                </ul>
              </div>
            }

            <div>
              <button (click)="restartQuiz()">Recommencer</button>
              <button (click)="quitQuiz()">Retour aux quiz</button>
            </div>
          </div>
        </div>
      }
    } @else {
      <div>
        <p>Chargement du quiz...</p>
      </div>
    }
  </div>
  `,
  styles: ``
})
export class QuizGameComponent implements OnInit, OnDestroy {
  @Input() quizId!: number;

  private quizService = inject(QuizService);
  private router = inject(Router);

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
}
