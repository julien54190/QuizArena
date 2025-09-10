import { CreateQuizSessionDto } from '../dto/create-quiz.dto';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { QuizSessionService } from '../services/quiz-session.service';
export declare class QuizSessionController {
    private readonly quizSessionService;
    constructor(quizSessionService: QuizSessionService);
    createSession(createQuizSessionDto: CreateQuizSessionDto, req: any): Promise<{
        user: {
            firstname: string;
            lastname: string;
            id: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isCompleted: boolean;
        quizId: string;
        startTime: Date;
        endTime: Date | null;
        score: number | null;
    }>;
    createGuestSession(createQuizSessionDto: CreateQuizSessionDto): Promise<{
        user: {
            firstname: string;
            lastname: string;
            id: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isCompleted: boolean;
        quizId: string;
        startTime: Date;
        endTime: Date | null;
        score: number | null;
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
            categoryId: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            isPublic: boolean;
            allowComments: boolean;
            authorId: string;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isCompleted: boolean;
        quizId: string;
        startTime: Date;
        endTime: Date | null;
        score: number | null;
    }>;
    getMySessions(req: any, limit?: string): Promise<({
        quiz: {
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                icon: string;
                color: string;
            };
            id: string;
            title: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isCompleted: boolean;
        quizId: string;
        startTime: Date;
        endTime: Date | null;
        score: number | null;
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
            avatar: string | null;
        };
        averageScore: number;
        totalSessions: number;
    }[]>;
    getQuizStats(quizId: string): Promise<{
        totalPlays: number;
        averageScore: number;
        totalSessions: number;
    }>;
}
