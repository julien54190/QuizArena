import { TestBed } from '@angular/core/testing';
import { SearchService } from '../search.service';
import { HomeService } from '../home.service';

describe('SearchService', () => {
  let service: SearchService;
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
    }
  ];

  beforeEach(() => {
    const homeServiceSpy = jasmine.createSpyObj('HomeService', [], {
      quizzes: jasmine.createSpy().and.returnValue(mockQuizzes),
      searchTerm: jasmine.createSpy().and.returnValue(''),
      categoryFilter: jasmine.createSpy().and.returnValue(''),
      difficultyFilter: jasmine.createSpy().and.returnValue(''),
      minQuestions: jasmine.createSpy().and.returnValue(0),
      minScore: jasmine.createSpy().and.returnValue(0)
    });

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        { provide: HomeService, useValue: homeServiceSpy }
      ]
    });

    service = TestBed.inject(SearchService);
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filteredQuizzes', () => {
    it('should return all quizzes when no filters are applied', () => {
      const result = service.filteredQuizzes();
      expect(result.length).toBe(3);
      expect(result).toEqual(mockQuizzes);
    });

    it('should filter by search term', () => {
      homeService.searchTerm.and.returnValue('histoire');
      const result = service.filteredQuizzes();
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Histoire de France');
    });

    it('should filter by category', () => {
      homeService.categoryFilter.and.returnValue('Sport');
      const result = service.filteredQuizzes();
      expect(result.length).toBe(1);
      expect(result[0].categories).toContain('Sport');
    });

    it('should filter by difficulty', () => {
      homeService.difficultyFilter.and.returnValue('difficile');
      const result = service.filteredQuizzes();
      expect(result.length).toBe(1);
      expect(result[0].difficulty).toBe('difficile');
    });

    it('should filter by minimum questions', () => {
      homeService.minQuestions.and.returnValue(20);
      const result = service.filteredQuizzes();
      expect(result.length).toBe(1);
      expect(result[0].questionCount).toBe(25);
    });

    it('should filter by minimum score', () => {
      homeService.minScore.and.returnValue(80);
      const result = service.filteredQuizzes();
      expect(result.length).toBe(1);
      expect(result[0].averageScore).toBe(88);
    });

    it('should apply multiple filters', () => {
      homeService.searchTerm.and.returnValue('football');
      homeService.categoryFilter.and.returnValue('Sport');
      homeService.difficultyFilter.and.returnValue('facile');
      const result = service.filteredQuizzes();
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Football Champions');
    });

    it('should handle case-insensitive search', () => {
      homeService.searchTerm.and.returnValue('HISTOIRE');
      const result = service.filteredQuizzes();
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Histoire de France');
    });

    it('should return empty array when no matches found', () => {
      homeService.searchTerm.and.returnValue('nonexistent');
      const result = service.filteredQuizzes();
      expect(result.length).toBe(0);
    });
  });

  describe('popularQuizzes', () => {
    it('should return top 6 quizzes sorted by total plays', () => {
      const result = service.popularQuizzes();
      expect(result.length).toBe(3); // Only 3 quizzes in mock data
      expect(result[0].totalPlays).toBe(2341); // Football Champions
      expect(result[1].totalPlays).toBe(1247); // Histoire de France
      expect(result[2].totalPlays).toBe(678);  // Programmation Web
    });

    it('should limit to 6 quizzes maximum', () => {
      // Create more than 6 quizzes
      const extendedQuizzes = [
        ...mockQuizzes,
        { ...mockQuizzes[0], id: 4, totalPlays: 100 },
        { ...mockQuizzes[0], id: 5, totalPlays: 200 },
        { ...mockQuizzes[0], id: 6, totalPlays: 300 },
        { ...mockQuizzes[0], id: 7, totalPlays: 400 },
        { ...mockQuizzes[0], id: 8, totalPlays: 500 }
      ];
      homeService.quizzes.and.returnValue(extendedQuizzes);

      const result = service.popularQuizzes();
      expect(result.length).toBe(6);
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false when no filters are active', () => {
      const result = service.hasActiveFilters();
      expect(result).toBe(false);
    });

    it('should return true when search term is active', () => {
      homeService.searchTerm.and.returnValue('test');
      const result = service.hasActiveFilters();
      expect(result).toBe(true);
    });

    it('should return true when category filter is active', () => {
      homeService.categoryFilter.and.returnValue('Sport');
      const result = service.hasActiveFilters();
      expect(result).toBe(true);
    });

    it('should return true when difficulty filter is active', () => {
      homeService.difficultyFilter.and.returnValue('facile');
      const result = service.hasActiveFilters();
      expect(result).toBe(true);
    });

    it('should return true when min questions is greater than 0', () => {
      homeService.minQuestions.and.returnValue(10);
      const result = service.hasActiveFilters();
      expect(result).toBe(true);
    });

    it('should return true when min score is greater than 0', () => {
      homeService.minScore.and.returnValue(70);
      const result = service.hasActiveFilters();
      expect(result).toBe(true);
    });

    it('should return true when multiple filters are active', () => {
      homeService.searchTerm.and.returnValue('test');
      homeService.categoryFilter.and.returnValue('Sport');
      const result = service.hasActiveFilters();
      expect(result).toBe(true);
    });
  });

  describe('resultCount', () => {
    it('should return the number of filtered quizzes', () => {
      const result = service.resultCount();
      expect(result).toBe(3);
    });

    it('should return 0 when no quizzes match filters', () => {
      homeService.searchTerm.and.returnValue('nonexistent');
      const result = service.resultCount();
      expect(result).toBe(0);
    });
  });
});
