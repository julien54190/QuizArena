import { Module } from '@nestjs/common';
import { ExperienceService } from './services/experience.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
