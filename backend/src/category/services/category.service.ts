/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const created = await this.prisma.category.create({
      data: createCategoryDto,
    });
    return created;
  }

  async findAll() {
    const list = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            quizzes: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return list;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        quizzes: {
          include: {
            author: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
              },
            },
            _count: {
              select: {
                questions: true,
                sessions: true,
              },
            },
          },
        },
        _count: {
          select: {
            quizzes: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return category;
  }

  async findByName(name: string) {
    const found = await this.prisma.category.findUnique({
      where: { name },
    });
    return found;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deleted = await this.prisma.category.delete({
      where: { id },
    });
    return deleted;
  }

  async getCategoryStats(id: string) {
    const category = await this.findOne(id);

    const totalQuizzes = category.quizzes.length;
    const totalQuestions = category.quizzes.reduce(
      (sum, quiz) => sum + quiz._count.questions,
      0,
    );
    const totalPlays = category.quizzes.reduce(
      (sum, quiz) => sum + quiz._count.sessions,
      0,
    );

    const averageScore = await this.prisma.quizSession.aggregate({
      where: {
        quiz: {
          categoryId: id,
        },
        isCompleted: true,
      },
      _avg: {
        score: true,
      },
    });

    return {
      category: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        description: category.description,
      },
      stats: {
        totalQuizzes,
        totalQuestions,
        totalPlays,
        averageScore: Math.round(averageScore._avg.score || 0),
      },
    };
  }
}
