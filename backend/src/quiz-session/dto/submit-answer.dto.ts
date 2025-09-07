import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsInt()
  @Min(0)
  selectedAnswer: number;

  @IsInt()
  @Min(0)
  timeSpent: number;
}
