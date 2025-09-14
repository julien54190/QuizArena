import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/services/prisma.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstname: 'Test',
    lastname: 'User',
    username: 'testuser',
    role: 'USER',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue(mockUser);

      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstname: 'Test',
        lastname: 'User',
      };

      const result = await service.register(registerDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        role: 'USER',
        createdAt: mockUser.createdAt,
      });
    });

    it('should throw BadRequestException if user already exists', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstname: 'Test',
        lastname: 'User',
      };

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userWithHashedPassword = { ...mockUser, password: hashedPassword };
      
      prismaService.user.findUnique.mockResolvedValue(userWithHashedPassword);

      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await service.login(loginDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user).toEqual({
        id: '1',
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        username: 'testuser',
        role: 'USER',
        createdAt: mockUser.createdAt,
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const userWithHashedPassword = { ...mockUser, password: hashedPassword };
      
      prismaService.user.findUnique.mockResolvedValue(userWithHashedPassword);

      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateDto = {
        firstname: 'Updated',
        lastname: 'User',
        email: 'updated@example.com',
      };

      const updatedUser = { ...mockUser, ...updateDto };
      prismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('1', updateDto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(updatedUser);
    });
  });
});
