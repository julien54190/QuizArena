import { TestBed } from '@angular/core/testing';
import { UserService } from '../user.service';
import { HomeService } from '../home.service';

describe('UserService', () => {
  let service: UserService;
  let homeService: jasmine.SpyObj<HomeService>;

  const mockUsers = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      username: 'jean.dupont',
      averageScore: 95,
      totalPlays: 150,
      quizzesCreated: 12,
      status: 'active' as const,
      role: 'user' as const,
      plan: 'gratuit' as const
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      username: 'marie.martin',
      averageScore: 88,
      totalPlays: 200,
      quizzesCreated: 8,
      status: 'active' as const,
      role: 'moderator' as const,
      plan: 'etudiant' as const
    },
    {
      id: 3,
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@example.com',
      username: 'pierre.bernard',
      averageScore: 82,
      totalPlays: 95,
      quizzesCreated: 5,
      status: 'active' as const,
      role: 'user' as const,
      plan: 'entreprise' as const
    },
    {
      id: 4,
      firstName: 'Sophie',
      lastName: 'Petit',
      email: 'sophie.petit@example.com',
      username: 'sophie.petit',
      averageScore: 75,
      totalPlays: 80,
      quizzesCreated: 3,
      status: 'suspended' as const,
      role: 'user' as const,
      plan: 'gratuit' as const
    },
    {
      id: 5,
      firstName: 'Lucas',
      lastName: 'Moreau',
      email: 'lucas.moreau@example.com',
      username: 'lucas.moreau',
      averageScore: 70,
      totalPlays: 60,
      quizzesCreated: 1,
      status: 'banned' as const,
      role: 'user' as const,
      plan: 'gratuit' as const
    }
  ];

  beforeEach(() => {
    const homeServiceSpy = jasmine.createSpyObj('HomeService', [], {
      users: jasmine.createSpy().and.returnValue(mockUsers)
    });

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HomeService, useValue: homeServiceSpy }
      ]
    });

    service = TestBed.inject(UserService);
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('allUsers', () => {
    it('should return all users from HomeService', () => {
      const result = service.allUsers();
      expect(result).toEqual(mockUsers);
      expect(homeService.users).toHaveBeenCalled();
    });
  });

  describe('activeUsers', () => {
    it('should return only active users', () => {
      const result = service.activeUsers();
      expect(result.length).toBe(3); // Only 3 active users
      expect(result.every(user => user.status === 'active')).toBe(true);
    });

    it('should exclude suspended and banned users', () => {
      const result = service.activeUsers();
      const suspendedUser = result.find(user => user.status === 'suspended');
      const bannedUser = result.find(user => user.status === 'banned');

      expect(suspendedUser).toBeUndefined();
      expect(bannedUser).toBeUndefined();
    });
  });

  describe('topPlayers', () => {
    it('should return top 3 players sorted by average score', () => {
      const result = service.topPlayers();

      expect(result.length).toBe(3);
      expect(result[0].averageScore).toBe(95); // Jean Dupont
      expect(result[1].averageScore).toBe(88); // Marie Martin
      expect(result[2].averageScore).toBe(82); // Pierre Bernard
    });

    it('should only include active users', () => {
      const result = service.topPlayers();
      expect(result.every(user => user.status === 'active')).toBe(true);
    });

    it('should handle less than 3 active users', () => {
      const limitedUsers = mockUsers.filter(user => user.id <= 2); // Only 2 active users
      homeService.users.and.returnValue(limitedUsers);

      const result = service.topPlayers();
      expect(result.length).toBe(2);
    });
  });

  describe('mostActivePlayers', () => {
    it('should return top 10 players sorted by total plays', () => {
      const result = service.mostActivePlayers();

      expect(result.length).toBe(3); // Only 3 active users
      expect(result[0].totalPlays).toBe(200); // Marie Martin
      expect(result[1].totalPlays).toBe(150); // Jean Dupont
      expect(result[2].totalPlays).toBe(95);  // Pierre Bernard
    });

    it('should limit to 10 players maximum', () => {
      // Create more than 10 active users
      const extendedUsers = [
        ...mockUsers,
        ...Array.from({ length: 8 }, (_, i) => ({
          ...mockUsers[0],
          id: 10 + i,
          totalPlays: 50 + i
        }))
      ];
      homeService.users.and.returnValue(extendedUsers);

      const result = service.mostActivePlayers();
      expect(result.length).toBe(10);
    });
  });

  describe('topQuizCreators', () => {
    it('should return top 5 creators sorted by quizzes created', () => {
      const result = service.topQuizCreators();

      expect(result.length).toBe(3); // Only 3 active users
      expect(result[0].quizzesCreated).toBe(12); // Jean Dupont
      expect(result[1].quizzesCreated).toBe(8);  // Marie Martin
      expect(result[2].quizzesCreated).toBe(5);  // Pierre Bernard
    });

    it('should limit to 5 creators maximum', () => {
      // Create more than 5 active users
      const extendedUsers = [
        ...mockUsers,
        ...Array.from({ length: 3 }, (_, i) => ({
          ...mockUsers[0],
          id: 10 + i,
          quizzesCreated: 2 + i
        }))
      ];
      homeService.users.and.returnValue(extendedUsers);

      const result = service.topQuizCreators();
      expect(result.length).toBe(5);
    });
  });

  describe('userStats', () => {
    it('should calculate correct user statistics', () => {
      const result = service.userStats();

      expect(result.total).toBe(5);
      expect(result.active).toBe(3);
      expect(result.suspended).toBe(1);
      expect(result.banned).toBe(1);
      expect(result.averageScore).toBe(88); // (95+88+82)/3 = 88.33 rounded to 88
      expect(result.averagePlays).toBe(148); // (150+200+95)/3 = 148.33 rounded to 148
      expect(result.averageQuizzesCreated).toBe(8); // (12+8+5)/3 = 8.33 rounded to 8
    });

    it('should handle empty user list', () => {
      homeService.users.and.returnValue([]);

      const result = service.userStats();

      expect(result.total).toBe(0);
      expect(result.active).toBe(0);
      expect(result.suspended).toBe(0);
      expect(result.banned).toBe(0);
      expect(result.averageScore).toBe(0);
      expect(result.averagePlays).toBe(0);
      expect(result.averageQuizzesCreated).toBe(0);
    });
  });

  describe('usersByRole', () => {
    it('should group users by role', () => {
      const result = service.usersByRole();

      expect(result.length).toBe(3); // 3 roles: user, moderator, admin

      const userRole = result.find(role => role.role === 'user');
      const moderatorRole = result.find(role => role.role === 'moderator');
      const adminRole = result.find(role => role.role === 'admin');

      expect(userRole?.count).toBe(4); // 4 users with 'user' role (including suspended and banned)
      expect(moderatorRole?.count).toBe(1); // 1 user with 'moderator' role
      expect(adminRole?.count).toBe(0); // 0 users with 'admin' role
    });
  });

  describe('usersByPlan', () => {
    it('should group users by plan', () => {
      const result = service.usersByPlan();

      expect(result.length).toBe(3); // 3 plans: gratuit, etudiant, entreprise

      const gratuitPlan = result.find(plan => plan.plan === 'gratuit');
      const etudiantPlan = result.find(plan => plan.plan === 'etudiant');
      const entreprisePlan = result.find(plan => plan.plan === 'entreprise');

      expect(gratuitPlan?.count).toBe(3); // 3 users with 'gratuit' plan
      expect(etudiantPlan?.count).toBe(1); // 1 user with 'etudiant' plan
      expect(entreprisePlan?.count).toBe(1); // 1 user with 'entreprise' plan
    });
  });

  describe('getMedalIcon', () => {
    it('should return correct medal icons for top 3 positions', () => {
      expect(service.getMedalIcon(0)).toBe('🥇'); // Gold
      expect(service.getMedalIcon(1)).toBe('🥈'); // Silver
      expect(service.getMedalIcon(2)).toBe('🥉'); // Bronze
    });

    it('should return trophy icon for other positions', () => {
      expect(service.getMedalIcon(3)).toBe('🏆');
      expect(service.getMedalIcon(10)).toBe('🏆');
      expect(service.getMedalIcon(100)).toBe('🏆');
    });
  });

  describe('getFullName', () => {
    it('should return full name correctly', () => {
      const user = mockUsers[0];
      const result = service.getFullName(user);
      expect(result).toBe('Jean Dupont');
    });

    it('should handle users with different names', () => {
      const user = mockUsers[1];
      const result = service.getFullName(user);
      expect(result).toBe('Marie Martin');
    });

    it('should handle users with empty names', () => {
      const user = {
        ...mockUsers[0],
        firstName: '',
        lastName: ''
      };
      const result = service.getFullName(user);
      expect(result).toBe(' ');
    });
  });
});
