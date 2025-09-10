import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { BadgeModule } from './badge/badge.module';
import { QuizSessionModule } from './quiz-session/quiz-session.module';
import { ExperienceModule } from './experience/experience.module';
import { CategoryModule } from './category/category.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
