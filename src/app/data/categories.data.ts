import { Category } from '../interfaces/category';

export type { Category }

export const CATEGORIES_DATA: Category[] = [
  {
    id: 1,
    name: 'Histoire',
    icon: '🏛️',
    color: '#8B5CF6',
    description: 'Quiz sur l\'histoire mondiale et française',
    quizCount: 12
  },
  {
    id: 2,
    name: 'Géographie',
    icon: '🌍',
    color: '#10B981',
    description: 'Découvrez les pays, capitales et reliefs',
    quizCount: 8
  },
  {
    id: 3,
    name: 'Sciences',
    icon: '🔬',
    color: '#3B82F6',
    description: 'Physique, chimie, biologie et astronomie',
    quizCount: 15
  },
  {
    id: 4,
    name: 'Culture Générale',
    icon: '📚',
    color: '#F59E0B',
    description: 'Art, littérature, cinéma et musique',
    quizCount: 20
  },
  {
    id: 5,
    name: 'Sport',
    icon: '⚽',
    color: '#EF4444',
    description: 'Tous les sports et leurs champions',
    quizCount: 10
  },
  {
    id: 6,
    name: 'Technologie',
    icon: '💻',
    color: '#6366F1',
    description: 'Informatique, innovation et numérique',
    quizCount: 18
  },
  {
    id: 7,
    name: 'Cuisine',
    icon: '🍳',
    color: '#F97316',
    description: 'Recettes, chefs et gastronomie',
    quizCount: 14
  },
  {
    id: 8,
    name: 'Nature',
    icon: '🌿',
    color: '#059669',
    description: 'Animaux, plantes et environnement',
    quizCount: 9
  }
];

