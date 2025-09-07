import { Module } from '@nestjs/common';
import { BadgeController } from './badge/controllers/badge.controller';
import { BadgeService } from './badge/services/badge.service';
import { PrismaModule } from './prisma/prisma.module';
import { QuizSessionModule } from './quiz-session/quiz-session.module';
import { ExperienceModule } from './experience/experience.module';

@Module({
  imports: [PrismaModule, QuizSessionModule, ExperienceModule],
  controllers: [BadgeController],
  providers: [BadgeService],
  exports: [BadgeService],
})
export class BadgeModule {}
