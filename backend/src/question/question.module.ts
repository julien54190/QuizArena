import { Module } from '@nestjs/common';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
