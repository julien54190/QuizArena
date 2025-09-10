import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
export declare class QuizService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createQuizDto: CreateQuizDto, authorId: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string;
            color: string;
        };
        author: {
            firstname: string;
            lastname: string;
            id: string;
        };
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: import("@prisma/client").$Enums.QuestionType;
            mediaUrl: string | null;
            orderItems: string[];
            quizId: string;
        })[];
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
    }>;
    findAll(): Promise<({
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string;
            color: string;
        };
        author: {
            firstname: string;
            lastname: string;
            id: string;
        };
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: import("@prisma/client").$Enums.QuestionType;
            mediaUrl: string | null;
            orderItems: string[];
            quizId: string;
        })[];
        _count: {
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
    } & {
        totalPlays: number;
        averageScore: number;
    })[]>;
    findOne(id: string): Promise<{
        author: {
            firstname: string;
            lastname: string;
            id: string;
        };
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: import("@prisma/client").$Enums.QuestionType;
            mediaUrl: string | null;
            orderItems: string[];
            quizId: string;
        })[];
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
    }>;
    findByAuthor(authorId: string): Promise<({
        author: {
            firstname: string;
            lastname: string;
            id: string;
        };
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: import("@prisma/client").$Enums.QuestionType;
            mediaUrl: string | null;
            orderItems: string[];
            quizId: string;
        })[];
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
    })[]>;
    findByCategory(categoryId: string): Promise<({
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string;
            color: string;
        };
        author: {
            firstname: string;
            lastname: string;
            id: string;
        };
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: import("@prisma/client").$Enums.QuestionType;
            mediaUrl: string | null;
            orderItems: string[];
            quizId: string;
        })[];
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
    })[]>;
    update(id: string, updateQuizDto: UpdateQuizDto, userId: string): Promise<{
        author: {
            firstname: string;
            lastname: string;
            id: string;
        };
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            type: import("@prisma/client").$Enums.QuestionType;
            mediaUrl: string | null;
            orderItems: string[];
            quizId: string;
        })[];
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
    }>;
    remove(id: string, userId: string): Promise<{
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
    }>;
}
