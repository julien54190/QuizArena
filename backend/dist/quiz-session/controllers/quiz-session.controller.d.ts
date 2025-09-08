import { QuizSessionService } from '../services/quiz-session.service';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { CreateQuizSessionDto } from '../dto/create-quiz.dto';
export declare class QuizSessionController {
    private readonly quizSessionService;
    constructor(quizSessionService: QuizSessionService);
    createSession(createQuizSessionDto: CreateQuizSessionDto, req: any): Promise<{
        user: {
            id: string;
            firstname: string;
            lastname: string;
        };
        quiz: {
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
                quizId: string;
                text: string;
                type: import("@prisma/client").$Enums.QuestionType;
                mediaUrl: string | null;
                orderItems: string[];
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            isPublic: boolean;
            allowComments: boolean;
            authorId: string;
            categoryId: string;
        };
    } & {
        id: string;
        startTime: Date;
        endTime: Date | null;
        score: number | null;
        isCompleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quizId: string;
    }>;
    submitAnswer(sessionId: string, submitAnswerDto: SubmitAnswerDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        isCorrect: boolean;
        questionId: string;
        selectedAnswer: number;
        timeSpent: number;
        sessionId: string;
    }>;
    completeSession(sessionId: string, req: any): Promise<{
        quiz: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            isPublic: boolean;
            allowComments: boolean;
            authorId: string;
            categoryId: string;
        };
        answers: {
            id: string;
            createdAt: Date;
            isCorrect: boolean;
            questionId: string;
            selectedAnswer: number;
            timeSpent: number;
            sessionId: string;
        }[];
    } & {
        id: string;
        startTime: Date;
        endTime: Date | null;
        score: number | null;
        isCompleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quizId: string;
    }>;
    getMySessions(req: any, limit?: string): Promise<({
        quiz: {
            id: string;
            title: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                icon: string;
                color: string;
            };
        };
        answers: {
            id: string;
            createdAt: Date;
            isCorrect: boolean;
            questionId: string;
            selectedAnswer: number;
            timeSpent: number;
            sessionId: string;
        }[];
    } & {
        id: string;
        startTime: Date;
        endTime: Date | null;
        score: number | null;
        isCompleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quizId: string;
    })[]>;
    getMyStats(req: any): Promise<{
        totalSessions: number;
        totalAnswers: number;
        correctAnswers: number;
        averageScore: number;
        accuracy: number;
    }>;
    getLeaderboard(limit?: string): Promise<{
        user: {
            id: string;
            firstname: string;
            lastname: string;
        } | null;
        averageScore: number;
        totalSessions: number;
    }[]>;
    getQuizStats(quizId: string): Promise<{
        totalPlays: number;
        averageScore: number;
        totalSessions: number;
    }>;
}
