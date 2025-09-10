"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
const badge_service_1 = require("../../badge/services/badge.service");
const experience_service_1 = require("../../experience/services/experience.service");
let QuizSessionService = class QuizSessionService {
    prisma;
    badgeService;
    experienceService;
    constructor(prisma, badgeService, experienceService) {
        this.prisma = prisma;
        this.badgeService = badgeService;
        this.experienceService = experienceService;
    }
    async createSession(createQuizSessionDto, userId) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: createQuizSessionDto.quizId },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz non trouvé');
        }
        return this.prisma.quizSession.create({
            data: {
                userId,
                quizId: createQuizSessionDto.quizId,
            },
            include: {
                quiz: {
                    include: {
                        questions: {
                            include: {
                                answers: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
            },
        });
    }
    async submitAnswer(sessionId, submitAnswerDto, userId) {
        const session = await this.prisma.quizSession.findUnique({
            where: { id: sessionId },
            include: {
                quiz: {
                    include: {
                        questions: {
                            include: {
                                answers: true,
                            },
                        },
                    },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session non trouvée');
        }
        if (session.userId !== userId) {
            throw new common_1.ForbiddenException("Vous ne pouvez répondre qu'à vos propres sessions");
        }
        if (session.isCompleted) {
            throw new common_1.ForbiddenException('Cette session est déjà terminée');
        }
        const question = session.quiz.questions.find((q) => q.id === submitAnswerDto.questionId);
        if (!question) {
            throw new common_1.NotFoundException('Question non trouvée');
        }
        const correctIndex = question.answers.findIndex((a) => a.isCorrect);
        if (correctIndex < 0) {
            throw new common_1.NotFoundException('Aucune réponse correcte trouvée pour cette question');
        }
        const isCorrect = correctIndex === Number(submitAnswerDto.selectedAnswer);
        const answer = await this.prisma.quizAnswer.create({
            data: {
                sessionId,
                questionId: submitAnswerDto.questionId,
                selectedAnswer: Number(submitAnswerDto.selectedAnswer),
                isCorrect,
                timeSpent: submitAnswerDto.timeSpent,
            },
        });
        return answer;
    }
    async completeSession(sessionId, userId) {
        const session = await this.prisma.quizSession.findUnique({
            where: { id: sessionId },
            include: {
                answers: true,
                quiz: true,
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session non trouvée');
        }
        if (session.userId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez terminer que vos propres sessions');
        }
        if (session.isCompleted) {
            return session;
        }
        const totalAnswers = session.answers.length;
        const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
        const score = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
        const completedSession = await this.prisma.quizSession.update({
            where: { id: sessionId },
            data: {
                isCompleted: true,
                endTime: new Date(),
                score,
            },
            include: {
                answers: {
                    include: {
                        question: {
                            include: {
                                answers: true,
                            },
                        },
                    },
                },
                quiz: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
            },
        });
        const totalTimeSpent = session.answers.reduce((sum, answer) => sum + answer.timeSpent, 0);
        await this.experienceService.updateUserStatsAfterQuiz(userId, score, totalTimeSpent, session.quiz.difficulty);
        await this.badgeService.checkAndUnlockBadges(userId, {
            score,
            quizId: session.quizId,
            totalPlays: 1,
            averageScore: score,
        });
        return completedSession;
    }
    async getUserSessions(userId, limit = 10) {
        const result = await this.prisma.quizSession.findMany({
            where: { userId },
            include: {
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        difficulty: true,
                    },
                },
                answers: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
        return result;
    }
    async getSessionStats(userId) {
        const sessions = await this.prisma.quizSession.findMany({
            where: {
                userId,
                isCompleted: true,
            },
            include: {
                answers: true,
            },
        });
        const totalSessions = sessions.length;
        const totalAnswers = sessions.reduce((sum, session) => sum + session.answers.length, 0);
        const correctAnswers = sessions.reduce((sum, session) => sum + session.answers.filter((a) => a.isCorrect).length, 0);
        const averageScore = totalSessions > 0
            ? Math.round(sessions.reduce((sum, session) => sum + (session.score || 0), 0) /
                totalSessions)
            : 0;
        return {
            totalSessions,
            totalAnswers,
            correctAnswers,
            averageScore,
            accuracy: totalAnswers > 0
                ? Math.round((correctAnswers / totalAnswers) * 100)
                : 0,
        };
    }
    async getQuizStats(quizId) {
        const sessions = await this.prisma.quizSession.findMany({
            where: {
                quizId,
                isCompleted: true,
            },
            include: {
                answers: true,
            },
        });
        const totalPlays = sessions.length;
        const averageScore = totalPlays > 0
            ? Math.round(sessions.reduce((sum, session) => sum + (session.score || 0), 0) /
                totalPlays)
            : 0;
        return {
            totalPlays,
            averageScore,
            totalSessions: sessions.length,
        };
    }
    async getLeaderboard(limit = 10) {
        const users = await this.prisma.user.findMany({
            orderBy: [
                { averageScore: 'desc' },
                { totalPlays: 'desc' },
                { createdAt: 'asc' },
            ],
            take: limit,
            select: {
                id: true,
                firstname: true,
                lastname: true,
                avatar: true,
                averageScore: true,
            },
        });
        const leaderboard = await Promise.all(users.map(async (u) => {
            const totalSessions = await this.prisma.quizSession.count({
                where: { userId: u.id, isCompleted: true },
            });
            return {
                user: {
                    id: u.id,
                    firstname: u.firstname,
                    lastname: u.lastname,
                    avatar: u.avatar ?? null,
                },
                averageScore: Math.round(u.averageScore || 0),
                totalSessions,
            };
        }));
        return leaderboard;
    }
    async createGuestSession(createQuizSessionDto) {
        const defaultUser = await this.prisma.user.findFirst({
            where: { status: 'ACTIVE' },
        });
        if (!defaultUser) {
            throw new common_1.NotFoundException('Aucun utilisateur actif trouvé');
        }
        return this.createSession(createQuizSessionDto, defaultUser.id);
    }
};
exports.QuizSessionService = QuizSessionService;
exports.QuizSessionService = QuizSessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        badge_service_1.BadgeService,
        experience_service_1.ExperienceService])
], QuizSessionService);
//# sourceMappingURL=quiz-session.service.js.map