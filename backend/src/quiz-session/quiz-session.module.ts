import { Module } from '@nestjs/common';
import { QuizSessionController } from './controllers/quiz-session.controller';
import { QuizSessionService } from './services/quiz-session.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BadgeModule } from '../badge/badge.module';
import { ExperienceModule } from '../experience/experience.module';

@Module({
  imports: [PrismaModule, BadgeModule, ExperienceModule],
  controllers: [QuizSessionController],
  providers: [QuizSessionService],
  exports: [QuizSessionService],
})
export class QuizSessionModule {}
