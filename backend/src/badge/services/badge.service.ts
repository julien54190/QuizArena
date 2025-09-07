/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateBadgeDto } from '../dto/create-badge.dto';
import { UpdateBadgeDto } from '../dto/update-badge.dto';

@Injectable()
export class BadgeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBadgeDto: CreateBadgeDto) {
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

  async findOne(id: string) {
    const badge = await this.prisma.badge.findUnique({
      where: { id },
    });

    if (!badge) {
      throw new NotFoundException('Badge non trouvé');
    }

    return badge;
  }

  async findByUser(userId: string) {
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

  async getAvailableBadges(userId: string) {
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

  async update(id: string, updateBadgeDto: UpdateBadgeDto) {
    await this.findOne(id);

    return await this.prisma.badge.update({
      where: { id },
      data: updateBadgeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.prisma.badge.delete({
      where: { id },
    });
  }

  async unlockBadge(userId: string, metadata: any): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return;
    }

    // Badge "Quiz Master" - Gagner 10 quiz
    if (metadata.totalPlays >= 10) {
      const badge = await this.prisma.badge.findFirst({
        where: { name: 'Quiz Master' },
      });
      if (badge) {
        await this.unlockBadgeForUser(userId, badge.id);
      }
    }

    // Badge "Rapide" - Terminer un quiz en moins de 2 minutes
    if (metadata.averageTimePerQuestion < 12) {
      const badge = await this.prisma.badge.findFirst({
        where: { name: 'Rapide' },
      });
      if (badge) {
        await this.unlockBadgeForUser(userId, badge.id);
      }
    }

    // Badge "Stratège" - Réussir 5 quiz d'affilée
    if (metadata.consecutiveWins >= 5) {
      const badge = await this.prisma.badge.findFirst({
        where: { name: 'Stratège' },
      });
      if (badge) {
        await this.unlockBadgeForUser(userId, badge.id);
      }
    }

    // Badge "Endurant" - Jouer 50 quiz
    if (metadata.totalPlays >= 50) {
      const badge = await this.prisma.badge.findFirst({
        where: { name: 'Endurant' },
      });
      if (badge) {
        await this.unlockBadgeForUser(userId, badge.id);
      }
    }

    // Badge "Champion" - Atteindre un score moyen de 90%
    if (metadata.averageScore >= 90) {
      const badge = await this.prisma.badge.findFirst({
        where: { name: 'Champion' },
      });
      if (badge) {
        await this.unlockBadgeForUser(userId, badge.id);
      }
    }

    // Badge "Érudit" - Réussir 20 quiz difficiles
    if (metadata.difficultQuizzesCompleted >= 20) {
      const badge = await this.prisma.badge.findFirst({
        where: { name: 'Érudit' },
      });
      if (badge) {
        await this.unlockBadgeForUser(userId, badge.id);
      }
    }
  }

  private async unlockBadgeForUser(
    userId: string,
    badgeId: string,
  ): Promise<void> {
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

  async checkAndUnlockBadges(userId: string, metadata: any): Promise<void> {
    await this.unlockBadge(userId, metadata);
  }
}
