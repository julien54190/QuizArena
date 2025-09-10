import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string;
        color: string;
    }>;
    findAll(): Promise<({
        _count: {
            quizzes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string;
        color: string;
    })[]>;
    findOne(id: string): Promise<{
        quizzes: ({
            author: {
                id: string;
                username: string;
                firstname: string;
                lastname: string;
            };
            _count: {
                questions: number;
                sessions: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            categoryId: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            isPublic: boolean;
            allowComments: boolean;
            authorId: string;
        })[];
        _count: {
            quizzes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string;
        color: string;
    }>;
    findByName(name: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string;
        color: string;
    } | null>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string;
        color: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string;
        color: string;
    }>;
    getCategoryStats(id: string): Promise<{
        category: {
            id: string;
            name: string;
            icon: string;
            color: string;
            description: string | null;
        };
        stats: {
            totalQuizzes: number;
            totalQuestions: number;
            totalPlays: number;
            averageScore: number;
        };
    }>;
}
