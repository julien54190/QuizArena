import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/services/prisma.service';
export declare class AppModule implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
}
