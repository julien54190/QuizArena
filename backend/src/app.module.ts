import { Module } from '@nestjs/common';
import { BadgeController } from './badge/controllers/badge.controller';
import { BadgeService } from './badge/services/badge.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BadgeController],
  providers: [BadgeService],
  exports: [BadgeService],
})
export class BadgeModule {}
