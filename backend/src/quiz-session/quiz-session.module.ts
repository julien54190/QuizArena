import { Module } from '@nestjs/common';
import { QuizSessionController } from './controllers/quiz-session.controller';
import { QuizSessionService } from './services/quiz-session.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [PrismaModule, BadgeModule],
  controllers: [QuizSessionController],
  providers: [QuizSessionService],
  exports: [QuizSessionService],
})
export class QuizSessionModule {}
