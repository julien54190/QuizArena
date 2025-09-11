import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
// PrismaService est fourni par PrismaModule
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { BadgeModule } from './badge/badge.module';
import { QuizSessionModule } from './quiz-session/quiz-session.module';
import { ExperienceModule } from './experience/experience.module';
import { CategoryModule } from './category/category.module';
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './prisma/services/prisma.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    QuizModule,
    QuestionModule,
    BadgeModule,
    QuizSessionModule,
    ExperienceModule,
    CategoryModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const adminEmail = 'admin@admin.com';
    const existing = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (!existing) {
      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.hash('123456', 10);
      
      // Vérifier si le username 'admin' existe déjà
      let username = 'admin';
      let suffix = 1;
      while (true) {
        const existingUsername = await this.prisma.user.findUnique({
          where: { username },
        });
        if (!existingUsername) break;
        username = `admin${suffix}`;
        suffix += 1;
      }
      
      await this.prisma.user.create({
        data: {
          email: adminEmail,
          password: passwordHash,
          firstname: 'Admin',
          lastname: 'User',
          username,
          role: 'ADMIN',
        },
      });
    }
  }
}
