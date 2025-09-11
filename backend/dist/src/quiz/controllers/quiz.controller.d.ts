import { QuizService } from '../services/quiz.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    create(createQuizDto: CreateQuizDto, req: any): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            icon: string;
            color: string;
        };
        author: {
            id: string;
            firstname: string;
            lastname: string;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            icon: string;
            color: string;
        };
        author: {
            id: string;
            firstname: string;
            lastname: string;
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
    findMyQuizzes(req: any): Promise<({
        author: {
            id: string;
            firstname: string;
            lastname: string;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            icon: string;
            color: string;
        };
        author: {
            id: string;
            firstname: string;
            lastname: string;
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
    findOne(id: string): Promise<{
        author: {
            id: string;
            firstname: string;
            lastname: string;
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
    update(id: string, updateQuizDto: UpdateQuizDto, req: any): Promise<{
        author: {
            id: string;
            firstname: string;
            lastname: string;
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
    remove(id: string, req: any): Promise<{
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
