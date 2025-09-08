import { BadgeService } from '../services/badge.service';
import { CreateBadgeDto } from '../dto/create-badge.dto';
import { UpdateBadgeDto } from '../dto/update-badge.dto';
export declare class BadgeController {
    private readonly badgeService;
    constructor(badgeService: BadgeService);
    create(createBadgeDto: CreateBadgeDto): Promise<{
        id: string;
        name: string;
        icon: string;
        hint: string | null;
        category: import("@prisma/client").$Enums.BadgeCategory;
        requirement: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        icon: string;
        hint: string | null;
        category: import("@prisma/client").$Enums.BadgeCategory;
        requirement: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findMyBadges(req: any): Promise<({
        badge: {
            id: string;
            name: string;
            icon: string;
            hint: string | null;
            category: import("@prisma/client").$Enums.BadgeCategory;
            requirement: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        unlockedAt: Date;
        userId: string;
        badgeId: string;
    })[]>;
    getUnlockedBadges(req: any): Promise<({
        badge: {
            id: string;
            name: string;
            icon: string;
            hint: string | null;
            category: import("@prisma/client").$Enums.BadgeCategory;
            requirement: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        unlockedAt: Date;
        userId: string;
        badgeId: string;
    })[]>;
    getLockedBadges(req: any): Promise<{
        isUnlocked: boolean;
        id: string;
        name: string;
        icon: string;
        hint: string | null;
        category: import("@prisma/client").$Enums.BadgeCategory;
        requirement: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        icon: string;
        hint: string | null;
        category: import("@prisma/client").$Enums.BadgeCategory;
        requirement: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    unlockBadge(id: string, req: any): Promise<void>;
    update(id: string, updateBadgeDto: UpdateBadgeDto): Promise<{
        id: string;
        name: string;
        icon: string;
        hint: string | null;
        category: import("@prisma/client").$Enums.BadgeCategory;
        requirement: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        icon: string;
        hint: string | null;
        category: import("@prisma/client").$Enums.BadgeCategory;
        requirement: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
