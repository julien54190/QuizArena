import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { PrismaService } from '../../prisma/services/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('QuizService', () => {
  let service: QuizService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockQuiz = {
    id: 'quiz-1',
    title: 'Test Quiz',
    description: 'A test quiz',
    difficulty: 'facile',
    authorId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQuestion = {
    id: 'question-1',
    text: 'What is 2+2?',
    quizId: 'quiz-1',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      quiz: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      question: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      quizSession: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all quizzes with pagination', async () => {
      const mockQuizzes = [mockQuiz];
      prismaService.quiz.findMany.mockResolvedValue(mockQuizzes);
      prismaService.quiz.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(prismaService.quiz.findMany).toHaveBeenCalledWith({
        include: {
          author: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          questions: true,
          categories: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: mockQuizzes,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a quiz by id', async () => {
      prismaService.quiz.findUnique.mockResolvedValue(mockQuiz);

      const result = await service.findOne('quiz-1');

      expect(prismaService.quiz.findUnique).toHaveBeenCalledWith({
        where: { id: 'quiz-1' },
        include: {
          author: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          questions: {
            include: {
              answers: true,
            },
          },
          categories: true,
        },
      });
      expect(result).toEqual(mockQuiz);
    });

    it('should throw NotFoundException if quiz not found', async () => {
      prismaService.quiz.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new quiz', async () => {
      const createQuizDto = {
        title: 'New Quiz',
        description: 'A new quiz',
        difficulty: 'moyen',
        categories: ['science'],
      };

      prismaService.quiz.create.mockResolvedValue(mockQuiz);

      const result = await service.create(createQuizDto, 'user-1');

      expect(prismaService.quiz.create).toHaveBeenCalledWith({
        data: {
          ...createQuizDto,
          authorId: 'user-1',
        },
        include: {
          author: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          questions: true,
          categories: true,
        },
      });
      expect(result).toEqual(mockQuiz);
    });
  });

  describe('update', () => {
    it('should update a quiz if user is the author', async () => {
      const updateDto = { title: 'Updated Quiz' };
      const updatedQuiz = { ...mockQuiz, ...updateDto };

      prismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      prismaService.quiz.update.mockResolvedValue(updatedQuiz);

      const result = await service.update('quiz-1', updateDto, 'user-1');

      expect(prismaService.quiz.update).toHaveBeenCalledWith({
        where: { id: 'quiz-1' },
        data: updateDto,
        include: {
          author: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          questions: true,
          categories: true,
        },
      });
      expect(result).toEqual(updatedQuiz);
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      prismaService.quiz.findUnique.mockResolvedValue(mockQuiz);

      await expect(service.update('quiz-1', { title: 'Updated' }, 'different-user')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a quiz if user is the author', async () => {
      prismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      prismaService.quiz.delete.mockResolvedValue(mockQuiz);

      const result = await service.remove('quiz-1', 'user-1');

      expect(prismaService.quiz.delete).toHaveBeenCalledWith({
        where: { id: 'quiz-1' },
      });
      expect(result).toEqual(mockQuiz);
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      prismaService.quiz.findUnique.mockResolvedValue(mockQuiz);

      await expect(service.remove('quiz-1', 'different-user')).rejects.toThrow(ForbiddenException);
    });
  });
});
