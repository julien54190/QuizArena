import { IsString, IsNotEmpty } from 'class-validator';

export class CreateQuizSessionDto {
  @IsString()
  @IsNotEmpty()
  quizId: string;
}
