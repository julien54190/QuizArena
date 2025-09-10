import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export enum Difficulty {
  FACILE = 'FACILE',
  MOYEN = 'MOYEN',
  DIFFICILE = 'DIFFICILE',
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = true;

  @IsBoolean()
  @IsOptional()
  allowComments?: boolean = true;
}
