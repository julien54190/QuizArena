export declare enum BadgeCategory {
    ACHIEVEMENT = "ACHIEVEMENT",
    MILESTONE = "MILESTONE",
    SPECIAL = "SPECIAL"
}
export declare class CreateBadgeDto {
    name: string;
    icon: string;
    hint?: string;
    category: BadgeCategory;
    requirement?: string;
    isActive?: boolean;
}
