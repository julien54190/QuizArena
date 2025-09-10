import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    create(createQuestionDto: CreateQuestionDto, req: any): Promise<{
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
    findAll(quizId?: string): Promise<({
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
    update(id: string, updateQuestionDto: UpdateQuestionDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
