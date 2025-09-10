import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

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
}
