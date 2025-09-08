import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateBadgeDto } from '../dto/create-badge.dto';
import { UpdateBadgeDto } from '../dto/update-badge.dto';
export declare class BadgeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createBadgeDto: CreateBadgeDto): Promise<{
        category: import("@prisma/client").$Enums.BadgeCategory;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }>;
    findAll(): Promise<{
        category: import("@prisma/client").$Enums.BadgeCategory;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        category: import("@prisma/client").$Enums.BadgeCategory;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }>;
    findByUser(userId: string): Promise<({
        badge: {
            category: import("@prisma/client").$Enums.BadgeCategory;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            icon: string;
            hint: string | null;
            requirement: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        userId: string;
        unlockedAt: Date;
        badgeId: string;
    })[]>;
    getAvailableBadges(userId: string): Promise<{
        isUnlocked: boolean;
        category: import("@prisma/client").$Enums.BadgeCategory;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }[]>;
    update(id: string, updateBadgeDto: UpdateBadgeDto): Promise<{
        category: import("@prisma/client").$Enums.BadgeCategory;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        category: import("@prisma/client").$Enums.BadgeCategory;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }>;
    unlockBadge(userId: string, metadata: any): Promise<void>;
    private unlockBadgeForUser;
    checkAndUnlockBadges(userId: string, metadata: any): Promise<void>;
}
