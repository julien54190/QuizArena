/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuizService } from '../services/quiz.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createQuizDto: CreateQuizDto, @Request() req) {
    return this.quizService.create(createQuizDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get('my-quizzes')
  @UseGuards(JwtAuthGuard)
  findMyQuizzes(@Request() req) {
    return this.quizService.findByAuthor(req.user.id);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.quizService.findByCategory(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @Request() req,
  ) {
    return this.quizService.update(id, updateQuizDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.quizService.remove(id, req.user.id);
  }
}
