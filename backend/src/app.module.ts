import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [PrismaModule, AuthModule, QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
