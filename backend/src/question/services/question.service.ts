/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto, userId: string) {
    // Vérifier que l'utilisateur est l'auteur du quiz
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: createQuestionDto.quizId },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz non trouvé');
    }

    if (quiz.authorId !== userId) {
      throw new ForbiddenException(
        "Vous ne pouvez ajouter des questions qu'à vos propres quiz",
      );
    }

    const { answers, ...questionData } = createQuestionDto;

    return this.prisma.question.create({
      data: {
        ...questionData,
        answers: {
          create: answers,
        },
      },
      include: {
        answers: true,
        quiz: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.question.findMany({
      include: {
        answers: true,
        quiz: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        answers: true,
        quiz: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question non trouvée');
    }

    return question;
  }

  async findByQuiz(quizId: string) {
    return this.prisma.question.findMany({
      where: { quizId },
      include: {
        answers: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
    userId: string,
  ) {
    const question = await this.findOne(id);

    if (question.quiz.authorId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que les questions de vos propres quiz',
      );
    }

    const { answers, ...questionData } = updateQuestionDto as any;

    // Si des réponses sont fournies, les remplacer
    if (answers) {
      // Supprimer les anciennes réponses
      await this.prisma.answer.deleteMany({
        where: { questionId: id },
      });

      // Créer les nouvelles réponses
      return this.prisma.question.update({
        where: { id },
        data: {
          ...questionData,
          answers: {
            create: answers,
          },
        },
        include: {
          answers: true,
          quiz: {
            select: {
              id: true,
              title: true,
              authorId: true,
            },
          },
        },
      });
    }

    return this.prisma.question.update({
      where: { id },
      data: questionData,
      include: {
        answers: true,
        quiz: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const question = await this.findOne(id);

    if (question.quiz.authorId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que les questions de vos propres quiz',
      );
    }

    return this.prisma.question.delete({
      where: { id },
    });
  }
}
