import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HomeService } from './home.service';

describe('HomeService', () => {
  let service: HomeService;

  const mockQuizzes = [
    {
      id: 1,
      title: 'Histoire de France',
      description: 'Testez vos connaissances sur l\'histoire',
      categories: ['Histoire'],
      difficulty: 'facile',
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
      difficulty: 'facile',
      questionCount: 15,
      averageScore: 88,
      totalPlays: 2341,
      creator: 'lucas.moreau',
      createdAt: '2024-01-08'
    }
  ];

  const mockUsers = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      username: 'jean.dupont',
      averageScore: 85,
      totalPlays: 150,
      quizzesCreated: 12,
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      username: 'marie.martin',
      averageScore: 92,
      totalPlays: 200,
      quizzesCreated: 8,
      status: 'active',
      createdAt: '2024-01-02'
    },
    {
      id: 3,
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@example.com',
      username: 'pierre.bernard',
      averageScore: 75,
      totalPlays: 100,
      quizzesCreated: 5,
      status: 'inactive',
      createdAt: '2024-01-03'
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
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeService]
    });
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty initial filters', () => {
      expect(service.searchTerm()).toBe('');
      expect(service.categoryFilter()).toBe('');
      expect(service.difficultyFilter()).toBe('');
      expect(service.minQuestions()).toBe(0);
      expect(service.minScore()).toBe(0);
    });

    it('should have initial data loaded', () => {
      expect(service.quizzes().length).toBeGreaterThan(0);
      expect(service.users().length).toBeGreaterThan(0);
      expect(service.categories().length).toBeGreaterThan(0);
    });
  });

  describe('updateSearchFilters', () => {
    it('should update all filters correctly', () => {
      const filters = {
        searchTerm: 'test',
        categoryFilter: 'Sport',
        difficultyFilter: 'facile',
        minQuestions: 10,
        minScore: 70
      };

      service.updateSearchFilters(filters);

      expect(service.searchTerm()).toBe('test');
      expect(service.categoryFilter()).toBe('Sport');
      expect(service.difficultyFilter()).toBe('facile');
      expect(service.minQuestions()).toBe(10);
      expect(service.minScore()).toBe(70);
    });

    it('should handle empty string values', () => {
      const filters = {
        searchTerm: '',
        categoryFilter: '',
        difficultyFilter: '',
        minQuestions: 0,
        minScore: 0
      };

      service.updateSearchFilters(filters);

      expect(service.searchTerm()).toBe('');
      expect(service.categoryFilter()).toBe('');
      expect(service.difficultyFilter()).toBe('');
      expect(service.minQuestions()).toBe(0);
      expect(service.minScore()).toBe(0);
    });

    it('should handle numeric values correctly', () => {
      const filters = {
        searchTerm: 'test',
        categoryFilter: 'Histoire',
        difficultyFilter: 'difficile',
        minQuestions: 15,
        minScore: 85
      };

      service.updateSearchFilters(filters);

      expect(service.minQuestions()).toBe(15);
      expect(service.minScore()).toBe(85);
    });
  });

  describe('resetFilters', () => {
    it('should reset all filters to initial values', () => {
      // Arrange - Set some filters first
      service.updateSearchFilters({
        searchTerm: 'test',
        categoryFilter: 'Sport',
        difficultyFilter: 'facile',
        minQuestions: 10,
        minScore: 70
      });

      // Act
      service.resetFilters();

      // Assert
      expect(service.searchTerm()).toBe('');
      expect(service.categoryFilter()).toBe('');
      expect(service.difficultyFilter()).toBe('');
      expect(service.minQuestions()).toBe(0);
      expect(service.minScore()).toBe(0);
    });
  });

  describe('computed properties', () => {
    beforeEach(() => {
      // Mock the data for testing computed properties
      spyOn(service as any, '_quizzes').and.returnValue(mockQuizzes);
      spyOn(service as any, '_users').and.returnValue(mockUsers);
      spyOn(service as any, '_categories').and.returnValue(mockCategories);
    });

    it('should calculate totalQuizzes correctly', () => {
      const result = service.totalQuizzes();
      expect(result).toBe(2);
    });

    it('should calculate totalCategories correctly', () => {
      const result = service.totalCategories();
      expect(result).toBe(2);
    });

    it('should calculate totalUsers correctly (only active users)', () => {
      const result = service.totalUsers();
      expect(result).toBe(2); // Only 2 active users out of 3
    });

    it('should calculate averageScore correctly', () => {
      const result = service.averageScore();
      // Average of 78 and 88 = 83
      expect(result).toBe(83);
    });

    it('should calculate totalPlays correctly', () => {
      const result = service.totalPlays();
      // Sum of 1247 and 2341 = 3588
      expect(result).toBe(3588);
    });

        it('should handle empty arrays for computed properties', () => {
      // Tester avec des données vides en modifiant les données du service existant
      // On ne peut pas modifier directement les signaux, donc on teste avec des données vides
      // en créant un nouveau service et en remplaçant les données
      const mockEmptyQuizzes: any[] = [];
      const mockEmptyUsers: any[] = [];
      const mockEmptyCategories: any[] = [];

      // Créer un nouveau service avec des données vides
      const emptyService = new HomeService();

      // Remplacer les données par des tableaux vides
      (emptyService as any)._quizzes = signal(mockEmptyQuizzes);
      (emptyService as any)._users = signal(mockEmptyUsers);
      (emptyService as any)._categories = signal(mockEmptyCategories);

      expect(emptyService.totalQuizzes()).toBe(0);
      expect(emptyService.totalUsers()).toBe(0);
      expect(emptyService.averageScore()).toBe(0);
      expect(emptyService.totalPlays()).toBe(0);
    });
  });

  describe('data access', () => {
    it('should provide read-only access to quizzes', () => {
      const quizzes = service.quizzes();
      expect(Array.isArray(quizzes)).toBe(true);
    });

    it('should provide read-only access to users', () => {
      const users = service.users();
      expect(Array.isArray(users)).toBe(true);
    });

    it('should provide read-only access to categories', () => {
      const categories = service.categories();
      expect(Array.isArray(categories)).toBe(true);
    });

    it('should provide read-only access to filters', () => {
      expect(typeof service.searchTerm()).toBe('string');
      expect(typeof service.categoryFilter()).toBe('string');
      expect(typeof service.difficultyFilter()).toBe('string');
      expect(typeof service.minQuestions()).toBe('number');
      expect(typeof service.minScore()).toBe('number');
    });
  });
});
