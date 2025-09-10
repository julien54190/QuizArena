import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
export declare class QuestionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createQuestionDto: CreateQuestionDto, userId: string): Promise<{
        quiz: {
            id: string;
            title: string;
            authorId: string;
        };
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
    }>;
    findAll(): Promise<({
        quiz: {
            id: string;
            title: string;
            authorId: string;
        };
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
    })[]>;
    findOne(id: string): Promise<{
        quiz: {
            id: string;
            title: string;
            authorId: string;
        };
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
    }>;
    findByQuiz(quizId: string): Promise<({
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
    })[]>;
    update(id: string, updateQuestionDto: UpdateQuestionDto, userId: string): Promise<{
        quiz: {
            id: string;
            title: string;
            authorId: string;
        };
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
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        type: import("@prisma/client").$Enums.QuestionType;
        mediaUrl: string | null;
        orderItems: string[];
        quizId: string;
    }>;
}
