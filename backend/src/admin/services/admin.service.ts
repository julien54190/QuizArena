import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<{
    users: number;
    quizzes: number;
    sessions: number;
  }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [users, quizzes, sessions]: [number, number, number] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.quiz.count(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        this.prisma.quizSession.count(),
      ]);
    return { users, quizzes, sessions };
  }

  async getRecentActions(): Promise<{
    recentUsers: Array<{
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      username: string;
      createdAt: Date;
    }>;
    recentQuizzes: Array<{
      id: string;
      title: string;
      description: string;
      createdAt: Date;
      author: {
        firstname: string;
        lastname: string;
        username: string;
      };
    }>;
  }> {
    const [recentUsers, recentQuizzes] = await Promise.all([
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          username: true,
          createdAt: true,
        },
      }),
      this.prisma.quiz.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          author: {
            select: {
              firstname: true,
              lastname: true,
              username: true,
            },
          },
        },
      }),
    ]);

    return { recentUsers, recentQuizzes };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Utilisateur supprimé avec succès' };
  }

  // Gestion des utilisateurs
  async getUsers(): Promise<
    Array<{
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      username: string;
      role: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUser(createUserDto: {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    role: UserRole;
  }): Promise<{ message: string; user: any }> {
    // Vérifier si l'email existe déjà
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUsername) {
      throw new ConflictException("Ce nom d'utilisateur est déjà utilisé");
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        role: createUserDto.role,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return { message: 'Utilisateur créé avec succès', user };
  }

  async updateUser(
    id: string,
    updateUserDto: {
      firstname?: string;
      lastname?: string;
      email?: string;
      username?: string;
      role?: UserRole;
      status?: UserStatus;
    },
  ): Promise<{ message: string; user: any }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier les conflits d'email si modifié
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    // Vérifier les conflits de nom d'utilisateur si modifié
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });

      if (existingUsername) {
        throw new ConflictException("Ce nom d'utilisateur est déjà utilisé");
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    return { message: 'Utilisateur mis à jour avec succès', user: updatedUser };
  }

  async suspendUser(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.prisma.user.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });

    return { message: 'Utilisateur suspendu avec succès' };
  }

  async banUser(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.prisma.user.update({
      where: { id },
      data: { status: 'BANNED' },
    });

    return { message: 'Utilisateur banni avec succès' };
  }

  async activateUser(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    return { message: 'Utilisateur activé avec succès' };
  }

  // Gestion des quizzes
  async getQuizzes(): Promise<
    Array<{
      id: string;
      title: string;
      description: string;
      difficulty: string;
      isPublic: boolean;
      createdAt: Date;
      updatedAt: Date;
      author: {
        id: string;
        firstname: string;
        lastname: string;
        username: string;
      };
      category: {
        id: string;
        name: string;
      } | null;
      _count: {
        questions: number;
        sessions: number;
      };
    }>
  > {
    return this.prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            questions: true,
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteQuiz(id: string): Promise<{ message: string }> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz non trouvé');
    }

    await this.prisma.quiz.delete({
      where: { id },
    });

    return { message: 'Quiz supprimé avec succès' };
  }

  async suspendQuiz(id: string): Promise<{ message: string }> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz non trouvé');
    }

    await this.prisma.quiz.update({
      where: { id },
      data: { isPublic: false },
    });

    return { message: 'Quiz suspendu avec succès' };
  }

  async activateQuiz(id: string): Promise<{ message: string }> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz non trouvé');
    }

    await this.prisma.quiz.update({
      where: { id },
      data: { isPublic: true },
    });

    return { message: 'Quiz activé avec succès' };
  }
}
