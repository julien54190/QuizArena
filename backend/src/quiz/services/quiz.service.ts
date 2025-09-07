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
    return this.prisma.quiz.create({
      data: {
        ...createQuizDto,
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
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.quiz.findMany({
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
