import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionType {
  SIMPLE = 'SIMPLE',
  MUSIQUE = 'MUSIQUE',
  PHOTO = 'PHOTO',
  ORDRE = 'ORDRE',
}

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType = QuestionType.SIMPLE;

  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @IsArray()
  @IsOptional()
  orderItems?: string[];

  @IsString()
  @IsNotEmpty()
  quizId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}
