import { TestBed } from '@angular/core/testing';
import { QuizService } from './quiz.service';
import { HomeService } from './home.service';

describe('QuizService', () => {
  let service: QuizService;
  let homeService: jasmine.SpyObj<HomeService>;

  const mockQuizzes = [
    {
      id: 1,
      title: 'Histoire de France',
      description: 'Testez vos connaissances sur l\'histoire',
      categories: ['Histoire'],
      difficulty: 'facile' as const,
      questionCount: 15,
      averageScore: 78,
      totalPlays: 1247,
      creator: 'jean.dupont',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Football Champions',
      description: 'Les légendes du ballon rond',
      categories: ['Sport'],
      difficulty: 'facile' as const,
      questionCount: 15,
      averageScore: 88,
      totalPlays: 2341,
      creator: 'lucas.moreau',
      createdAt: '2024-01-08'
    },
    {
      id: 3,
      title: 'Programmation Web',
      description: 'HTML, CSS, JavaScript et plus',
      categories: ['Technologie'],
      difficulty: 'difficile' as const,
      questionCount: 25,
      averageScore: 58,
      totalPlays: 678,
      creator: 'emma.leroy',
      createdAt: '2024-01-18'
    },
    {
      id: 4,
      title: 'Géographie Mondiale',
      description: 'Découvrez les pays du monde',
      categories: ['Géographie'],
      difficulty: 'moyen' as const,
      questionCount: 20,
      averageScore: 72,
      totalPlays: 1567,
      creator: 'sophie.petit',
      createdAt: '2024-01-12'
    }
  ];

  const mockCategories = [
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
      name: 'Sport',
      icon: '⚽',
      color: '#EF4444',
      description: 'Tous les sports et leurs champions',
      quizCount: 10
    },
    {
      id: 3,
      name: 'Technologie',
      icon: '💻',
      color: '#6366F1',
      description: 'Informatique, innovation et numérique',
      quizCount: 18
    },
    {
      id: 4,
      name: 'Géographie',
      icon: '🌍',
      color: '#10B981',
      description: 'Découvrez les pays, capitales et reliefs',
      quizCount: 8
    }
  ];

  beforeEach(() => {
    const homeServiceSpy = jasmine.createSpyObj('HomeService', [], {
      quizzes: jasmine.createSpy().and.returnValue(mockQuizzes),
      categories: jasmine.createSpy().and.returnValue(mockCategories)
    });

    TestBed.configureTestingModule({
      providers: [
        QuizService,
        { provide: HomeService, useValue: homeServiceSpy }
      ]
    });

    service = TestBed.inject(QuizService);
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('allQuizzes', () => {
    it('should return all quizzes from HomeService', () => {
      const result = service.allQuizzes();
      expect(result).toEqual(mockQuizzes);
      expect(homeService.quizzes).toHaveBeenCalled();
    });
  });

  describe('quizzesByCategory', () => {
    it('should group quizzes by category', () => {
      const result = service.quizzesByCategory();

      expect(result.length).toBe(4); // 4 categories

      const histoireCategory = result.find(cat => cat.category === 'Histoire');
      const sportCategory = result.find(cat => cat.category === 'Sport');
      const technologieCategory = result.find(cat => cat.category === 'Technologie');
      const geographieCategory = result.find(cat => cat.category === 'Géographie');

      expect(histoireCategory?.quizzes.length).toBe(1);
      expect(sportCategory?.quizzes.length).toBe(1);
      expect(technologieCategory?.quizzes.length).toBe(1);
      expect(geographieCategory?.quizzes.length).toBe(1);
    });

    it('should return empty arrays for categories with no quizzes', () => {
      const emptyQuizzes: any[] = [];
      homeService.quizzes.and.returnValue(emptyQuizzes);

      const result = service.quizzesByCategory();

      result.forEach(category => {
        expect(category.quizzes.length).toBe(0);
      });
    });
  });

  describe('quizzesByDifficulty', () => {
    it('should group quizzes by difficulty', () => {
      const result = service.quizzesByDifficulty();

      expect(result.length).toBe(3); // 3 difficulties: facile, moyen, difficile

      const facileQuizzes = result.find(diff => diff.difficulty === 'facile');
      const moyenQuizzes = result.find(diff => diff.difficulty === 'moyen');
      const difficileQuizzes = result.find(diff => diff.difficulty === 'difficile');

      expect(facileQuizzes?.quizzes.length).toBe(2); // Histoire + Football
      expect(moyenQuizzes?.quizzes.length).toBe(1);  // Géographie
      expect(difficileQuizzes?.quizzes.length).toBe(1); // Programmation
    });

    it('should return empty arrays for difficulties with no quizzes', () => {
      const emptyQuizzes: any[] = [];
      homeService.quizzes.and.returnValue(emptyQuizzes);

      const result = service.quizzesByDifficulty();

      result.forEach(difficulty => {
        expect(difficulty.quizzes.length).toBe(0);
      });
    });
  });

  describe('quizStats', () => {
    it('should calculate correct statistics', () => {
      const result = service.quizStats();

      expect(result.total).toBe(4);
      expect(result.byDifficulty.facile).toBe(2);
      expect(result.byDifficulty.moyen).toBe(1);
      expect(result.byDifficulty.difficile).toBe(1);
      expect(result.averageQuestions).toBe(19); // (15+15+25+20)/4 = 18.75 rounded to 19
      expect(result.averageScore).toBe(74); // (78+88+58+72)/4 = 74
    });

    it('should handle empty quiz list', () => {
      homeService.quizzes.and.returnValue([]);

      const result = service.quizStats();

      expect(result.total).toBe(0);
      expect(result.byDifficulty.facile).toBe(0);
      expect(result.byDifficulty.moyen).toBe(0);
      expect(result.byDifficulty.difficile).toBe(0);
      expect(result.averageQuestions).toBe(0);
      expect(result.averageScore).toBe(0);
    });
  });

  describe('getCategoryIcon', () => {
    it('should return correct icons for known categories', () => {
      expect(service.getCategoryIcon('Histoire')).toBe('🏛️');
      expect(service.getCategoryIcon('Géographie')).toBe('🌍');
      expect(service.getCategoryIcon('Sciences')).toBe('🔬');
      expect(service.getCategoryIcon('Sport')).toBe('⚽');
      expect(service.getCategoryIcon('Technologie')).toBe('💻');
      expect(service.getCategoryIcon('Cuisine')).toBe('👨‍🍳');
      expect(service.getCategoryIcon('Nature')).toBe('🌱');
    });

    it('should handle case-insensitive category names', () => {
      expect(service.getCategoryIcon('HISTOIRE')).toBe('🏛️');
      expect(service.getCategoryIcon('sport')).toBe('⚽');
      expect(service.getCategoryIcon('Technologie')).toBe('💻');
    });

    it('should return default icon for unknown categories', () => {
      expect(service.getCategoryIcon('Unknown Category')).toBe('🎯');
      expect(service.getCategoryIcon('')).toBe('🎯');
    });
  });

  describe('getDifficultyClass', () => {
    it('should return correct CSS classes for difficulties', () => {
      expect(service.getDifficultyClass('facile')).toBe('badge-success');
      expect(service.getDifficultyClass('moyen')).toBe('badge-warning');
      expect(service.getDifficultyClass('difficile')).toBe('badge-danger');
    });

    it('should return default class for unknown difficulties', () => {
      expect(service.getDifficultyClass('unknown')).toBe('badge-info');
      expect(service.getDifficultyClass('')).toBe('badge-info');
    });

    it('should handle case-sensitive difficulty names', () => {
      expect(service.getDifficultyClass('Facile')).toBe('badge-info'); // Case sensitive
      expect(service.getDifficultyClass('MOYEN')).toBe('badge-info'); // Case sensitive
    });
  });

  describe('playQuiz', () => {
    it('should log quiz information when called', () => {
      spyOn(console, 'log');
      const quiz = mockQuizzes[0];

      service.playQuiz(quiz);

      expect(console.log).toHaveBeenCalledWith('Jouer au quiz:', quiz.title);
    });

    it('should handle any quiz object', () => {
      spyOn(console, 'log');
      const quiz = {
        id: 999,
        title: 'Test Quiz',
        description: 'Test Description',
        categories: ['Test'],
        difficulty: 'facile' as const,
        questionCount: 10,
        averageScore: 50,
        totalPlays: 100,
        creator: 'test.user',
        createdAt: '2024-01-01'
      };

      service.playQuiz(quiz);

      expect(console.log).toHaveBeenCalledWith('Jouer au quiz:', 'Test Quiz');
    });
  });
});
