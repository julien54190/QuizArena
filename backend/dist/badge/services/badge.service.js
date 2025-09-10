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
exports.BadgeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
let BadgeService = class BadgeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBadgeDto) {
        return await this.prisma.badge.create({
            data: createBadgeDto,
        });
    }
    async findAll() {
        return await this.prisma.badge.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findOne(id) {
        const badge = await this.prisma.badge.findUnique({
            where: { id },
        });
        if (!badge) {
            throw new common_1.NotFoundException('Badge non trouvé');
        }
        return badge;
    }
    async findByUser(userId) {
        return await this.prisma.userBadge.findMany({
            where: { userId },
            include: {
                badge: true,
            },
            orderBy: {
                unlockedAt: 'desc',
            },
        });
    }
    async getAvailableBadges(userId) {
        const userBadges = await this.prisma.userBadge.findMany({
            where: { userId },
            include: {
                badge: true,
            },
        });
        const unlockedBadgeIds = userBadges.map((ub) => ub.badgeId);
        const allBadges = await this.prisma.badge.findMany({
            where: { isActive: true },
        });
        return allBadges
            .filter((badge) => !unlockedBadgeIds.includes(badge.id))
            .map((badge) => ({
            ...badge,
            isUnlocked: false,
        }));
    }
    async update(id, updateBadgeDto) {
        await this.findOne(id);
        return await this.prisma.badge.update({
            where: { id },
            data: updateBadgeDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return await this.prisma.badge.delete({
            where: { id },
        });
    }
    async unlockBadge(userId, metadata) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            return;
        }
        if (metadata.totalPlays >= 10) {
            const badge = await this.prisma.badge.findFirst({
                where: { name: 'Quiz Master' },
            });
            if (badge) {
                await this.unlockBadgeForUser(userId, badge.id);
            }
        }
        if (metadata.averageTimePerQuestion < 12) {
            const badge = await this.prisma.badge.findFirst({
                where: { name: 'Rapide' },
            });
            if (badge) {
                await this.unlockBadgeForUser(userId, badge.id);
            }
        }
        if (metadata.consecutiveWins >= 5) {
            const badge = await this.prisma.badge.findFirst({
                where: { name: 'Stratège' },
            });
            if (badge) {
                await this.unlockBadgeForUser(userId, badge.id);
            }
        }
        if (metadata.totalPlays >= 50) {
            const badge = await this.prisma.badge.findFirst({
                where: { name: 'Endurant' },
            });
            if (badge) {
                await this.unlockBadgeForUser(userId, badge.id);
            }
        }
        if (metadata.averageScore >= 90) {
            const badge = await this.prisma.badge.findFirst({
                where: { name: 'Champion' },
            });
            if (badge) {
                await this.unlockBadgeForUser(userId, badge.id);
            }
        }
        if (metadata.difficultQuizzesCompleted >= 20) {
            const badge = await this.prisma.badge.findFirst({
                where: { name: 'Érudit' },
            });
            if (badge) {
                await this.unlockBadgeForUser(userId, badge.id);
            }
        }
    }
    async unlockBadgeForUser(userId, badgeId) {
        const existingUserBadge = await this.prisma.userBadge.findFirst({
            where: {
                userId,
                badgeId,
            },
        });
        if (!existingUserBadge) {
            await this.prisma.userBadge.create({
                data: {
                    userId,
                    badgeId,
                    unlockedAt: new Date(),
                },
            });
        }
    }
    async checkAndUnlockBadges(userId, metadata) {
        await this.unlockBadge(userId, metadata);
    }
};
exports.BadgeService = BadgeService;
exports.BadgeService = BadgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BadgeService);
//# sourceMappingURL=badge.service.js.map