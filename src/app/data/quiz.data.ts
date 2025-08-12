import { IPlayQuiz } from "../interfaces/quiz";

export type { IPlayQuiz}

export const PLAY_QUIZZES_DATA: IPlayQuiz[] = [
{
  id: 1,
  title: 'Histoire de France - Révolution',
  description: 'Testez vos connaissances sur la Révolution française',
  category: 'Histoire',
  difficulty: 'moyen',
  questionCount: 15,
  averageScore: 78,
  totalPlays: 1247,
  creator: 'jean.dupont',
  createdAt: '2024-01-15'
},
{
  id: 2,
  title: 'Capitales du Monde',
  description: 'Connaissez-vous toutes les capitales ?',
  category: 'Géographie',
  difficulty: 'facile',
  questionCount: 20,
  averageScore: 85,
  totalPlays: 2156,
  creator: 'marie.martin',
  createdAt: '2024-01-10'
},
{
  id: 3,
  title: 'Système Solaire',
  description: 'Explorez les planètes et l\'espace',
  category: 'Sciences',
  difficulty: 'difficile',
  questionCount: 12,
  averageScore: 65,
  totalPlays: 892,
  creator: 'pierre.bernard',
  createdAt: '2024-01-20'
},
{
  id: 4,
  title: 'Cinéma Classique',
  description: 'Les plus grands films de l\'histoire',
  category: 'Culture Générale',
  difficulty: 'moyen',
  questionCount: 18,
  averageScore: 72,
  totalPlays: 1567,
  creator: 'sophie.petit',
  createdAt: '2024-01-12'
},
{
  id: 5,
  title: 'Football Champions',
  description: 'Les légendes du ballon rond',
  category: 'Sport',
  difficulty: 'facile',
  questionCount: 15,
  averageScore: 88,
  totalPlays: 2341,
  creator: 'lucas.moreau',
  createdAt: '2024-01-08'
},
{
  id: 6,
  title: 'Programmation Web',
  description: 'HTML, CSS, JavaScript et plus',
  category: 'Technologie',
  difficulty: 'difficile',
  questionCount: 25,
  averageScore: 58,
  totalPlays: 678,
  creator: 'emma.leroy',
  createdAt: '2024-01-18'
},
{
  id: 7,
  title: 'Cuisine Française',
  description: 'Les recettes traditionnelles',
  category: 'Cuisine',
  difficulty: 'moyen',
  questionCount: 16,
  averageScore: 81,
  totalPlays: 1345,
  creator: 'thomas.roux',
  createdAt: '2024-01-14'
},
{
  id: 8,
  title: 'Animaux Sauvages',
  description: 'Découvrez la faune mondiale',
  category: 'Nature',
  difficulty: 'facile',
  questionCount: 14,
  averageScore: 90,
  totalPlays: 1892,
  creator: 'julie.david',
  createdAt: '2024-01-16'
}
];
