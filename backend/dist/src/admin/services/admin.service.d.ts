import { PrismaService } from '../../prisma/services/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOverview(): Promise<{
        users: number;
        quizzes: number;
        sessions: number;
    }>;
}
