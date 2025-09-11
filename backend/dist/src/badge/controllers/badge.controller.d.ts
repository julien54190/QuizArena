import { BadgeService } from '../services/badge.service';
import { CreateBadgeDto } from '../dto/create-badge.dto';
import { UpdateBadgeDto } from '../dto/update-badge.dto';
export declare class BadgeController {
    private readonly badgeService;
    constructor(badgeService: BadgeService);
    create(createBadgeDto: CreateBadgeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: import("@prisma/client").$Enums.BadgeCategory;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: import("@prisma/client").$Enums.BadgeCategory;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }[]>;
    findMyBadges(req: any): Promise<({
        badge: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: import("@prisma/client").$Enums.BadgeCategory;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: import("@prisma/client").$Enums.BadgeCategory;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: import("@prisma/client").$Enums.BadgeCategory;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: import("@prisma/client").$Enums.BadgeCategory;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }>;
    unlockBadge(id: string, req: any): Promise<void>;
    update(id: string, updateBadgeDto: UpdateBadgeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: import("@prisma/client").$Enums.BadgeCategory;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: import("@prisma/client").$Enums.BadgeCategory;
        icon: string;
        hint: string | null;
        requirement: string | null;
        isActive: boolean;
    }>;
}
