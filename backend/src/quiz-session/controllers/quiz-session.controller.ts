/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { QuizSessionService } from '../services/quiz-session.service';

import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateQuizSessionDto } from '../dto/create-quiz.dto';

@Controller('quiz-session')
export class QuizSessionController {
  constructor(private readonly quizSessionService: QuizSessionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createSession(
    @Body() createQuizSessionDto: CreateQuizSessionDto,
    @Request() req,
  ) {
    return this.quizSessionService.createSession(
      createQuizSessionDto,
      req.user.id,
    );
  }

  @Post(':id/answer')
  @UseGuards(JwtAuthGuard)
  submitAnswer(
    @Param('id') sessionId: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
    @Request() req,
  ) {
    return this.quizSessionService.submitAnswer(
      sessionId,
      submitAnswerDto,
      req.user.id,
    );
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  completeSession(@Param('id') sessionId: string, @Request() req) {
    return this.quizSessionService.completeSession(sessionId, req.user.id);
  }

  @Get('my-sessions')
  @UseGuards(JwtAuthGuard)
  getMySessions(@Request() req, @Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.quizSessionService.getUserSessions(req.user.id, limitNumber);
  }

  @Get('my-stats')
  @UseGuards(JwtAuthGuard)
  getMyStats(@Request() req) {
    return this.quizSessionService.getSessionStats(req.user.id);
  }

  @Get('leaderboard')
  getLeaderboard(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.quizSessionService.getLeaderboard(limitNumber);
  }

  @Get('quiz/:quizId/stats')
  getQuizStats(@Param('quizId') quizId: string) {
    return this.quizSessionService.getQuizStats(quizId);
  }
}
