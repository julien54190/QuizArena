"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
let ExperienceService = class ExperienceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    LEVEL_TITLES = {
        1: 'Débutant',
        2: 'Apprenti',
        3: 'Élève',
        4: 'Étudiant',
        5: 'Connaisseur',
        6: 'Expert',
        7: 'Maître',
        8: 'Grand Maître',
        9: 'Légende',
        10: 'Mythique',
    };
    XP_REQUIREMENTS = {
        1: 0,
        2: 500,
        3: 1000,
        4: 2000,
        5: 3500,
        6: 5000,
        7: 7000,
        8: 10000,
        9: 15000,
        10: 25000,
    };
    calculateLevel(xp) {
        const levels = Object.keys(this.XP_REQUIREMENTS)
            .map(Number)
            .sort((a, b) => a - b);
        let level = 1;
        for (const lvl of levels) {
            if (xp >= this.XP_REQUIREMENTS[lvl]) {
                level = lvl;
            }
            else {
                break;
            }
        }
        return level;
    }
    getLevelTitle(level) {
        return this.LEVEL_TITLES[level] || 'Inconnu';
    }
    getNextLevelXp(currentLevel) {
        return (this.XP_REQUIREMENTS[currentLevel + 1] ||
            this.XP_REQUIREMENTS[currentLevel]);
    }
    getXpProgress(currentXp, currentLevel) {
        const nextLevelXp = this.getNextLevelXp(currentLevel);
        const currentLevelXp = this.XP_REQUIREMENTS[currentLevel];
        const xpNeeded = nextLevelXp - currentLevelXp;
        const xpProgress = currentXp - currentLevelXp;
        return Math.min(100, Math.round((xpProgress / xpNeeded) * 100));
    }
    async addXp(userId, xpToAdd) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        const oldLevel = user.currentLevel;
        const newXp = user.totalXp + xpToAdd;
        const newLevel = this.calculateLevel(newXp);
        const levelUp = newLevel > oldLevel;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                totalXp: newXp,
                currentLevel: newLevel,
            },
        });
        return {
            newXp,
            newLevel,
            levelUp,
            oldLevel,
        };
    }
    calculateQuizXp(score, timeSpent, difficulty) {
        let baseXp = 0;
        if (score >= 90)
            baseXp = 100;
        else if (score >= 80)
            baseXp = 80;
        else if (score >= 70)
            baseXp = 60;
        else if (score >= 60)
            baseXp = 40;
        else if (score >= 50)
            baseXp = 20;
        else
            baseXp = 10;
        const difficultyMultiplier = {
            FACILE: 1,
            MOYEN: 1.5,
            DIFFICILE: 2,
        };
        baseXp = Math.round(baseXp * (difficultyMultiplier[difficulty] || 1));
        if (timeSpent < 300) {
            baseXp = Math.round(baseXp * 1.2);
        }
        return baseXp;
    }
    async getUserExperience(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        const nextLevelXp = this.getNextLevelXp(user.currentLevel);
        const xpProgress = this.getXpProgress(user.totalXp, user.currentLevel);
        return {
            level: user.currentLevel,
            currentXp: user.totalXp,
            nextLevelXp,
            xpProgress,
            totalXp: user.totalXp,
            levelTitle: this.getLevelTitle(user.currentLevel),
            totalPlays: user.totalPlays,
            averageScore: user.averageScore,
        };
    }
    async updateUserStatsAfterQuiz(userId, score, timeSpent, difficulty) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        const xpGained = this.calculateQuizXp(score, timeSpent, difficulty);
        const xpResult = await this.addXp(userId, xpGained);
        const newTotalPlays = user.totalPlays + 1;
        const newAverageScore = (user.averageScore * user.totalPlays + score) / newTotalPlays;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                totalPlays: newTotalPlays,
                averageScore: Math.round(newAverageScore * 100) / 100,
            },
        });
        return {
            xpGained,
            xpResult,
            newTotalPlays,
            newAverageScore: Math.round(newAverageScore * 100) / 100,
        };
    }
    async getUserRanking(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        const xpRanking = await this.prisma.user.count({
            where: {
                totalXp: {
                    gt: user.totalXp,
                },
            },
        });
        const scoreRanking = await this.prisma.user.count({
            where: {
                averageScore: {
                    gt: user.averageScore,
                },
                totalPlays: {
                    gte: 5,
                },
            },
        });
        return {
            xpRanking: xpRanking + 1,
            scoreRanking: scoreRanking + 1,
            totalUsers: await this.prisma.user.count(),
        };
    }
};
exports.ExperienceService = ExperienceService;
exports.ExperienceService = ExperienceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExperienceService);
//# sourceMappingURL=experience.service.js.map