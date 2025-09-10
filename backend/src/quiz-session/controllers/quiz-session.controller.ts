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
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateQuizSessionDto } from '../dto/create-quiz.dto';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { QuizSessionService } from '../services/quiz-session.service';

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
      req.user.userId,
    );
  }

  // Endpoint temporaire pour créer des sessions sans authentification (pour les tests)
  @Post('guest')
  createGuestSession(@Body() createQuizSessionDto: CreateQuizSessionDto) {
    // Utiliser le premier utilisateur actif comme utilisateur par défaut
    return this.quizSessionService.createGuestSession(createQuizSessionDto);
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
      req.user.userId,
    );
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  completeSession(@Param('id') sessionId: string, @Request() req) {
    return this.quizSessionService.completeSession(sessionId, req.user.userId);
  }

  @Get('my-sessions')
  @UseGuards(JwtAuthGuard)
  getMySessions(@Request() req, @Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.quizSessionService.getUserSessions(
      req.user.userId,
      limitNumber,
    );
  }

  @Get('my-stats')
  @UseGuards(JwtAuthGuard)
  getMyStats(@Request() req) {
    return this.quizSessionService.getSessionStats(req.user.userId);
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
