import { QuizService } from '../services/quiz.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    create(createQuizDto: CreateQuizDto, req: any): Promise<{
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
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        isPublic: boolean;
        allowComments: boolean;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        categoryId: string;
    }>;
    findAll(): Promise<({
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
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        isPublic: boolean;
        allowComments: boolean;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        categoryId: string;
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
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        isPublic: boolean;
        allowComments: boolean;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        categoryId: string;
    })[]>;
    findByCategory(categoryId: string): Promise<({
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
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        isPublic: boolean;
        allowComments: boolean;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        categoryId: string;
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
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        isPublic: boolean;
        allowComments: boolean;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        categoryId: string;
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
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        isPublic: boolean;
        allowComments: boolean;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        categoryId: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        isPublic: boolean;
        allowComments: boolean;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        categoryId: string;
    }>;
}
