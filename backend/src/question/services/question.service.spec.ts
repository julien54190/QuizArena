import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { PrismaService } from '../../prisma/services/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('QuestionService', () => {
  let service: QuestionService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockQuestion = {
    id: '1',
    text: 'Test question?',
    type: 'multiple_choice',
    difficulty: 'easy',
    quizId: 'quiz-1',
    authorId: 'user-1',
    answers: [
      { id: '1', text: 'Answer 1', isCorrect: true },
      { id: '2', text: 'Answer 2', isCorrect: false },
    ],
  };

  const mockQuiz = {
    id: 'quiz-1',
    title: 'Test Quiz',
    authorId: 'user-1',
  };

  beforeEach(async () => {
    const mockPrismaService = {
      question: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      quiz: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a question successfully', async () => {
      prismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      prismaService.question.create.mockResolvedValue(mockQuestion);

      const createQuestionDto = {
        text: 'Test question?',
        type: 'multiple_choice',
        difficulty: 'easy',
        quizId: 'quiz-1',
        answers: [
          { text: 'Answer 1', isCorrect: true },
          { text: 'Answer 2', isCorrect: false },
        ],
      };

      const result = await service.create(createQuestionDto, 'user-1');

      expect(prismaService.quiz.findUnique).toHaveBeenCalledWith({
        where: { id: createQuestionDto.quizId },
      });
      expect(prismaService.question.create).toHaveBeenCalled();
      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundException if quiz does not exist', async () => {
      prismaService.quiz.findUnique.mockResolvedValue(null);

      const createQuestionDto = {
        text: 'Test question?',
        type: 'multiple_choice',
        difficulty: 'easy',
        quizId: 'nonexistent-quiz',
        answers: [],
      };

      await expect(service.create(createQuestionDto, 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not quiz author', async () => {
      prismaService.quiz.findUnique.mockResolvedValue(mockQuiz);

      const createQuestionDto = {
        text: 'Test question?',
        type: 'multiple_choice',
        difficulty: 'easy',
        quizId: 'quiz-1',
        answers: [],
      };

      await expect(service.create(createQuestionDto, 'different-user')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return all questions', async () => {
      prismaService.question.findMany.mockResolvedValue([mockQuestion]);

      const result = await service.findAll();

      expect(prismaService.question.findMany).toHaveBeenCalledWith({
        include: {
          answers: true,
          quiz: {
            select: {
              id: true,
              title: true,
              author: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual([mockQuestion]);
    });
  });

  describe('findByQuiz', () => {
    it('should return questions for a specific quiz', async () => {
      prismaService.question.findMany.mockResolvedValue([mockQuestion]);

      const result = await service.findByQuiz('quiz-1');

      expect(prismaService.question.findMany).toHaveBeenCalledWith({
        where: { quizId: 'quiz-1' },
        include: {
          answers: true,
          quiz: {
            select: {
              id: true,
              title: true,
              author: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual([mockQuestion]);
    });
  });

  describe('findOne', () => {
    it('should return a question by id', async () => {
      prismaService.question.findUnique.mockResolvedValue(mockQuestion);

      const result = await service.findOne('1');

      expect(prismaService.question.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          answers: true,
          quiz: {
            select: {
              id: true,
              title: true,
              author: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundException if question does not exist', async () => {
      prismaService.question.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a question successfully', async () => {
      prismaService.question.findUnique.mockResolvedValue(mockQuestion);
      prismaService.question.update.mockResolvedValue({ ...mockQuestion, text: 'Updated question?' });

      const updateQuestionDto = {
        text: 'Updated question?',
      };

      const result = await service.update('1', updateQuestionDto, 'user-1');

      expect(prismaService.question.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { quiz: true },
      });
      expect(prismaService.question.update).toHaveBeenCalled();
      expect(result.text).toBe('Updated question?');
    });

    it('should throw NotFoundException if question does not exist', async () => {
      prismaService.question.findUnique.mockResolvedValue(null);

      const updateQuestionDto = { text: 'Updated question?' };

      await expect(service.update('999', updateQuestionDto, 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not question author', async () => {
      prismaService.question.findUnique.mockResolvedValue(mockQuestion);

      const updateQuestionDto = { text: 'Updated question?' };

      await expect(service.update('1', updateQuestionDto, 'different-user')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a question successfully', async () => {
      prismaService.question.findUnique.mockResolvedValue(mockQuestion);
      prismaService.question.delete.mockResolvedValue(mockQuestion);

      const result = await service.remove('1', 'user-1');

      expect(prismaService.question.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { quiz: true },
      });
      expect(prismaService.question.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundException if question does not exist', async () => {
      prismaService.question.findUnique.mockResolvedValue(null);

      await expect(service.remove('999', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not question author', async () => {
      prismaService.question.findUnique.mockResolvedValue(mockQuestion);

      await expect(service.remove('1', 'different-user')).rejects.toThrow(ForbiddenException);
    });
  });
});
