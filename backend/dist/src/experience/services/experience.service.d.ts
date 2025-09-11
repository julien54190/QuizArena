import { PrismaService } from '../../prisma/services/prisma.service';
export declare class ExperienceService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly LEVEL_TITLES;
    private readonly XP_REQUIREMENTS;
    calculateLevel(xp: number): number;
    getLevelTitle(level: number): string;
    getNextLevelXp(currentLevel: number): number;
    getXpProgress(currentXp: number, currentLevel: number): number;
    addXp(userId: string, xpToAdd: number): Promise<{
        newXp: number;
        newLevel: number;
        levelUp: boolean;
        oldLevel: number;
    }>;
    calculateQuizXp(score: number, timeSpent: number, difficulty: string): number;
    getUserExperience(userId: string): Promise<{
        level: number;
        currentXp: number;
        nextLevelXp: number;
        xpProgress: number;
        totalXp: number;
        levelTitle: string;
        totalPlays: number;
        averageScore: number;
    }>;
    updateUserStatsAfterQuiz(userId: string, score: number, timeSpent: number, difficulty: string): Promise<{
        xpGained: number;
        xpResult: {
            newXp: number;
            newLevel: number;
            levelUp: boolean;
            oldLevel: number;
        };
        newTotalPlays: number;
        newAverageScore: number;
    }>;
    getUserRanking(userId: string): Promise<{
        xpRanking: number;
        scoreRanking: number;
        totalUsers: number;
    }>;
}
