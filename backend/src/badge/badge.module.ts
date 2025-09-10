import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BadgeController } from './controllers/badge.controller';
import { BadgeService } from './services/badge.service';

@Module({
  imports: [PrismaModule],
  controllers: [BadgeController],
  providers: [BadgeService],
  exports: [BadgeService]
})
export class BadgeModule {}
