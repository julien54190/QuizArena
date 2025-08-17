export interface IPlayQuiz {
  id: number;
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
}

