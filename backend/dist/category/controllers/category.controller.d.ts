import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string;
        color: string;
    }>;
    findAll(): Promise<({
        _count: {
            quizzes: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string;
        color: string;
    })[]>;
    findOne(id: string): Promise<{
        quizzes: ({
            author: {
                firstname: string;
                lastname: string;
                id: string;
                username: string;
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string;
        color: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string;
        color: string;
    }>;
}
