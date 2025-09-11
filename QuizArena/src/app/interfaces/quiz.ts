export interface IQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index de la bonne réponse dans options
  explanation?: string;
}

export interface IQuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // en secondes
}

export interface IPlayQuiz {
  id: string;
  title: string;
  description: string;
  categories: string[];
  difficulty: 'facile' | 'moyen' | 'difficile';
  questionCount: number;
  averageScore: number;
  totalPlays: number;
  creator: string;
  createdAt: string;
  image?: string;
  questions?: IQuestion[]; // Questions du quiz
}

export interface IQuizSession {
  quizId: string;
  startTime: Date;
  endTime?: Date;
  answers: IQuizAnswer[];
  currentQuestionIndex: number;
  isCompleted: boolean;
  score?: number;
}

