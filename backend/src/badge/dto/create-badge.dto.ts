import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export enum BadgeCategory {
  ACHIEVEMENT = 'ACHIEVEMENT',
  MILESTONE = 'MILESTONE',
  SPECIAL = 'SPECIAL',
}

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsOptional()
  hint?: string;

  @IsEnum(BadgeCategory)
  category: BadgeCategory;

  @IsString()
  @IsOptional()
  requirement?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
