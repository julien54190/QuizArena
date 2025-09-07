/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { BadgeService } from '../../badge/services/badge.service';
import { ExperienceService } from '../../experience/services/experience.service';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { CreateQuizSessionDto } from '../dto/create-quiz.dto';

@Injectable()
export class QuizSessionService {
  constructor(
    private prisma: PrismaService,
    private badgeService: BadgeService,
    private experienceService: ExperienceService,
  ) {}

  async createSession(
    createQuizSessionDto: CreateQuizSessionDto,
    userId: string,
  ) {
    // Vérifier que le quiz existe
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: createQuizSessionDto.quizId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz non trouvé');
    }

    // Créer la session
    return this.prisma.quizSession.create({
      data: {
        userId,
        quizId: createQuizSessionDto.quizId,
      },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                answers: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  }

  async submitAnswer(
    sessionId: string,
    submitAnswerDto: SubmitAnswerDto,
    userId: string,
  ) {
    // Vérifier que la session existe et appartient à l'utilisateur
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        "Vous ne pouvez répondre qu'à vos propres sessions",
      );
    }

    if (session.isCompleted) {
      throw new ForbiddenException('Cette session est déjà terminée');
    }

    // Trouver la question et vérifier la bonne réponse
    const question = session.quiz.questions.find(
      (q) => q.id === submitAnswerDto.questionId,
    );
    if (!question) {
      throw new NotFoundException('Question non trouvée');
    }

    const correctAnswer = question.answers.find((a) => a.isCorrect);
    if (!correctAnswer) {
      throw new NotFoundException(
        'Aucune réponse correcte trouvée pour cette question',
      );
    }

    const isCorrect =
      correctAnswer.id === submitAnswerDto.selectedAnswer.toString();

    // Enregistrer la réponse
    const answer = await this.prisma.quizAnswer.create({
      data: {
        sessionId,
        questionId: submitAnswerDto.questionId,
        selectedAnswer: submitAnswerDto.selectedAnswer,
        isCorrect,
        timeSpent: submitAnswerDto.timeSpent,
      },
    });

    return answer;
  }

  async completeSession(sessionId: string, userId: string) {
    // Vérifier que la session existe et appartient à l'utilisateur
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        answers: true,
        quiz: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez terminer que vos propres sessions',
      );
    }

    if (session.isCompleted) {
      return session;
    }

    // Calculer le score
    const totalAnswers = session.answers.length;
    const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
    const score =
      totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    // Terminer la session
    const completedSession = await this.prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        isCompleted: true,
        endTime: new Date(),
        score,
      },
      include: {
        answers: {
          include: {
            question: {
              include: {
                answers: true,
              },
            },
          },
        },
        quiz: {
          include: {
            author: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    // Calculer le temps total passé
    const totalTimeSpent = session.answers.reduce(
      (sum, answer) => sum + answer.timeSpent,
      0,
    );

    // Mettre à jour l'expérience et les statistiques
    await this.experienceService.updateUserStatsAfterQuiz(
      userId,
      score,
      totalTimeSpent,
      session.quiz.difficulty,
    );

    // Vérifier et débloquer des badges
    await this.badgeService.checkAndUnlockBadges(userId, {
      score,
      quizId: session.quizId,
      totalPlays: 1, // À ajuster selon la logique métier
      averageScore: score,
    });

    return completedSession;
  }

  async getUserSessions(userId: string, limit: number = 10) {
    const result = await this.prisma.quizSession.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
          },
        },
        answers: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
    return result;
  }

  async getSessionStats(userId: string) {
    const sessions = await this.prisma.quizSession.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      include: {
        answers: true,
      },
    });

    const totalSessions = sessions.length;
    const totalAnswers = sessions.reduce(
      (sum, session) => sum + session.answers.length,
      0,
    );
    const correctAnswers = sessions.reduce(
      (sum, session) => sum + session.answers.filter((a) => a.isCorrect).length,
      0,
    );
    const averageScore =
      totalSessions > 0
        ? Math.round(
            sessions.reduce((sum, session) => sum + (session.score || 0), 0) /
              totalSessions,
          )
        : 0;

    return {
      totalSessions,
      totalAnswers,
      correctAnswers,
      averageScore,
      accuracy:
        totalAnswers > 0
          ? Math.round((correctAnswers / totalAnswers) * 100)
          : 0,
    };
  }

  async getQuizStats(quizId: string) {
    const sessions = await this.prisma.quizSession.findMany({
      where: {
        quizId,
        isCompleted: true,
      },
      include: {
        answers: true,
      },
    });

    const totalPlays = sessions.length;
    const averageScore =
      totalPlays > 0
        ? Math.round(
            sessions.reduce((sum, session) => sum + (session.score || 0), 0) /
              totalPlays,
          )
        : 0;

    return {
      totalPlays,
      averageScore,
      totalSessions: sessions.length,
    };
  }

  async getLeaderboard(limit: number = 10) {
    const userStats = await this.prisma.quizSession.groupBy({
      by: ['userId'],
      where: {
        isCompleted: true,
      },
      _avg: {
        score: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _avg: {
          score: 'desc',
        },
      },
      take: limit,
    });

    const leaderboard = await Promise.all(
      userStats.map(async (stat) => {
        const user = await this.prisma.user.findUnique({
          where: { id: stat.userId },
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        });

        return {
          user,
          averageScore: Math.round(stat._avg.score || 0),
          totalSessions: stat._count.id,
        };
      }),
    );

    return leaderboard;
  }
}
