import { Module } from '@nestjs/common';
import { QuizController } from './controllers/quiz.controller';

@Module({
  controllers: [QuizController]
})
export class QuizModule {}
