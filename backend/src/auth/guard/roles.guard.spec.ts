import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '@prisma/client';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
      get: jest.fn(),
      getAndOverride: jest.fn(),
      getAndMerge: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);

    // Mock ExecutionContext
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn(),
      getResponse: jest.fn(),
      getNext: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getType: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);
      mockExecutionContext.getRequest.mockReturnValue({});

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      const requiredRoles = [UserRole.ADMIN];
      const mockUser = {
        id: 'user-1',
        role: UserRole.ADMIN,
        email: 'admin@example.com',
        username: 'admin',
      };

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockExecutionContext.getRequest.mockReturnValue({ user: mockUser });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has one of multiple required roles', () => {
      const requiredRoles = [UserRole.ADMIN, UserRole.USER];
      const mockUser = {
        id: 'user-1',
        role: UserRole.USER,
        email: 'user@example.com',
        username: 'user',
      };

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockExecutionContext.getRequest.mockReturnValue({ user: mockUser });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      const requiredRoles = [UserRole.ADMIN];
      const mockUser = {
        id: 'user-1',
        role: UserRole.USER,
        email: 'user@example.com',
        username: 'user',
      };

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockExecutionContext.getRequest.mockReturnValue({ user: mockUser });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
    });

    it('should return false when user is not defined', () => {
      const requiredRoles = [UserRole.ADMIN];

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockExecutionContext.getRequest.mockReturnValue({});

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
    });

    it('should return false when user is null', () => {
      const requiredRoles = [UserRole.ADMIN];

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockExecutionContext.getRequest.mockReturnValue({ user: null });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
    });

    it('should return false when user is not an object', () => {
      const requiredRoles = [UserRole.ADMIN];

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockExecutionContext.getRequest.mockReturnValue({ user: 'invalid-user' });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
    });

    it('should return false when user object does not have role property', () => {
      const requiredRoles = [UserRole.ADMIN];
      const mockUser = {
        id: 'user-1',
        email: 'user@example.com',
        username: 'user',
        // Missing role property
      };

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockExecutionContext.getRequest.mockReturnValue({ user: mockUser });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
    });
  });
});
