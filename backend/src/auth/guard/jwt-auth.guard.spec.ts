import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as jwt from 'jsonwebtoken';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);

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
    it('should return true for valid JWT token', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      const mockPayload = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'USER',
      };

      mockedJwt.verify.mockReturnValue(mockPayload as any);
      mockExecutionContext.getRequest.mockReturnValue(mockRequest);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockRequest.user).toEqual(mockPayload);
      expect(mockedJwt.verify).toHaveBeenCalledWith('valid-token', 'fallback-secret');
    });

    it('should throw UnauthorizedException when no authorization header', () => {
      const mockRequest = {
        headers: {},
      };

      mockExecutionContext.getRequest.mockReturnValue(mockRequest);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Token manquant');
    });

    it('should throw UnauthorizedException when authorization header does not start with Bearer', () => {
      const mockRequest = {
        headers: {
          authorization: 'Invalid token',
        },
      };

      mockExecutionContext.getRequest.mockReturnValue(mockRequest);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Token manquant');
    });

    it('should throw UnauthorizedException when JWT verification fails', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      };

      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      mockExecutionContext.getRequest.mockReturnValue(mockRequest);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Token invalide');
    });

    it('should use JWT_SECRET from environment when available', () => {
      const originalEnv = process.env.JWT_SECRET;
      process.env.JWT_SECRET = 'custom-secret';

      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      const mockPayload = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'USER',
      };

      mockedJwt.verify.mockReturnValue(mockPayload as any);
      mockExecutionContext.getRequest.mockReturnValue(mockRequest);

      guard.canActivate(mockExecutionContext);

      expect(mockedJwt.verify).toHaveBeenCalledWith('valid-token', 'custom-secret');

      // Restore original environment
      process.env.JWT_SECRET = originalEnv;
    });
  });
});
