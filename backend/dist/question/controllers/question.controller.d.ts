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
            text: string;
            createdAt: Date;
            updatedAt: Date;
            isCorrect: boolean;
            questionId: string;
        }[];
    } & {
        id: string;
        text: string;
        type: import("@prisma/client").$Enums.QuestionType;
        mediaUrl: string | null;
        orderItems: string[];
        createdAt: Date;
        updatedAt: Date;
        quizId: string;
    }>;
    findAll(quizId?: string): Promise<({
        answers: {
            id: string;
            text: string;
            createdAt: Date;
            updatedAt: Date;
            isCorrect: boolean;
            questionId: string;
        }[];
    } & {
        id: string;
        text: string;
        type: import("@prisma/client").$Enums.QuestionType;
        mediaUrl: string | null;
        orderItems: string[];
        createdAt: Date;
        updatedAt: Date;
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
            text: string;
            createdAt: Date;
            updatedAt: Date;
            isCorrect: boolean;
            questionId: string;
        }[];
    } & {
        id: string;
        text: string;
        type: import("@prisma/client").$Enums.QuestionType;
        mediaUrl: string | null;
        orderItems: string[];
        createdAt: Date;
        updatedAt: Date;
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
            text: string;
            createdAt: Date;
            updatedAt: Date;
            isCorrect: boolean;
            questionId: string;
        }[];
    } & {
        id: string;
        text: string;
        type: import("@prisma/client").$Enums.QuestionType;
        mediaUrl: string | null;
        orderItems: string[];
        createdAt: Date;
        updatedAt: Date;
        quizId: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        text: string;
        type: import("@prisma/client").$Enums.QuestionType;
        mediaUrl: string | null;
        orderItems: string[];
        createdAt: Date;
        updatedAt: Date;
        quizId: string;
    }>;
}
