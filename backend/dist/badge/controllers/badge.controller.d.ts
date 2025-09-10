import { BadgeService } from '../services/badge.service';
import { CreateBadgeDto } from '../dto/create-badge.dto';
import { UpdateBadgeDto } from '../dto/update-badge.dto';
export declare class BadgeController {
    private readonly badgeService;
    constructor(badgeService: BadgeService);
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
    findMyBadges(req: any): Promise<({
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
    getUnlockedBadges(req: any): Promise<({
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
    getLockedBadges(req: any): Promise<{
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
    unlockBadge(id: string, req: any): Promise<void>;
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
}
