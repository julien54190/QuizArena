import { PrismaService } from '../../prisma/services/prisma.service';
import { BadgeService } from '../../badge/services/badge.service';
import { ExperienceService } from '../../experience/services/experience.service';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { CreateQuizSessionDto } from '../dto/create-quiz.dto';
export declare class QuizSessionService {
    private prisma;
    private badgeService;
    private experienceService;
    constructor(prisma: PrismaService, badgeService: BadgeService, experienceService: ExperienceService);
    createSession(createQuizSessionDto: CreateQuizSessionDto, userId: string): Promise<{
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
    submitAnswer(sessionId: string, submitAnswerDto: SubmitAnswerDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        isCorrect: boolean;
        questionId: string;
        selectedAnswer: number;
        timeSpent: number;
        sessionId: string;
    }>;
    completeSession(sessionId: string, userId: string): Promise<{
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
    getUserSessions(userId: string, limit?: number): Promise<({
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
    getSessionStats(userId: string): Promise<{
        totalSessions: number;
        totalAnswers: number;
        correctAnswers: number;
        averageScore: number;
        accuracy: number;
    }>;
    getQuizStats(quizId: string): Promise<{
        totalPlays: number;
        averageScore: number;
        totalSessions: number;
    }>;
    getLeaderboard(limit?: number): Promise<{
        user: {
            id: string;
            firstname: string;
            lastname: string;
            avatar: string | null;
        };
        averageScore: number;
        totalSessions: number;
    }[]>;
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
}
