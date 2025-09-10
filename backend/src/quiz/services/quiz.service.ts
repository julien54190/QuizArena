/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto, authorId: string) {
    const { categoryId, ...rest } = createQuizDto;
    return this.prisma.quiz.create({
      data: {
        ...rest,
        categoryId,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        category: true,
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      where: {
        isPublic: true,
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        category: true,
        questions: {
          include: {
            answers: true,
          },
        },
        _count: {
          select: {
            sessions: {
              where: {
                isCompleted: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculer les statistiques pour chaque quiz
    type SessionScore = { score: number | null };
    type QuizStats = { totalPlays: number; averageScore: number };

    const quizzesWithStats: Array<(typeof quizzes)[number] & QuizStats> =
      await Promise.all(
        quizzes.map(async (quiz) => {
          const sessions: SessionScore[] =
            await this.prisma.quizSession.findMany({
              where: {
                quizId: quiz.id,
                isCompleted: true,
              },
              select: {
                score: true,
              },
            });

          const totalPlays: number = sessions.length;
          const averageScore: number =
            totalPlays > 0
              ? Math.round(
                  sessions.reduce(
                    (sum: number, session: SessionScore) =>
                      sum + (session.score ?? 0),
                    0,
                  ) / totalPlays,
                )
              : 0;

          const withStats: (typeof quizzes)[number] & QuizStats = {
            ...quiz,
            totalPlays,
            averageScore,
          };
          return withStats;
        }),
      );

    return quizzesWithStats;
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
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
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz non trouvé');
    }

    return quiz;
  }

  async findByAuthor(authorId: string) {
    return this.prisma.quiz.findMany({
      where: { authorId },
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByCategory(categoryId: string) {
    return this.prisma.quiz.findMany({
      where: { categoryId },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        category: true,
        questions: {
          include: {
            answers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateQuizDto: UpdateQuizDto, userId: string) {
    const quiz = await this.findOne(id);

    if (quiz.authorId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres quiz',
      );
    }

    return this.prisma.quiz.update({
      where: { id },
      data: updateQuizDto,
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
      },
    });
  }

  async remove(id: string, userId: string) {
    const quiz = await this.findOne(id);

    if (quiz.authorId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres quiz',
      );
    }

    return this.prisma.quiz.delete({
      where: { id },
    });
  }
}
