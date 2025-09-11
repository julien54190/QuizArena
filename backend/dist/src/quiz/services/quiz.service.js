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
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
let QuizService = class QuizService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createQuizDto, authorId) {
        const { categoryId, ...rest } = createQuizDto;
        return this.prisma.quiz.create({
            data: {
                ...rest,
                categoryId,
                authorId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
                category: true,
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
    }
    async findAll() {
        const quizzes = await this.prisma.quiz.findMany({
            where: {
                isPublic: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
                category: true,
                questions: {
                    include: {
                        answers: true,
                    },
                },
                _count: {
                    select: {
                        sessions: {
                            where: {
                                isCompleted: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const quizzesWithStats = await Promise.all(quizzes.map(async (quiz) => {
            const sessions = await this.prisma.quizSession.findMany({
                where: {
                    quizId: quiz.id,
                    isCompleted: true,
                },
                select: {
                    score: true,
                },
            });
            const totalPlays = sessions.length;
            const averageScore = totalPlays > 0
                ? Math.round(sessions.reduce((sum, session) => sum + (session.score ?? 0), 0) / totalPlays)
                : 0;
            const withStats = {
                ...quiz,
                totalPlays,
                averageScore,
            };
            return withStats;
        }));
        return quizzesWithStats;
    }
    async findOne(id) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
                questions: {
                    include: {
                        answers: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz non trouvé');
        }
        return quiz;
    }
    async findByAuthor(authorId) {
        return this.prisma.quiz.findMany({
            where: { authorId },
            include: {
                author: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findByCategory(categoryId) {
        return this.prisma.quiz.findMany({
            where: { categoryId },
            include: {
                author: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
                category: true,
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async update(id, updateQuizDto, userId) {
        const quiz = await this.findOne(id);
        if (quiz.authorId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que vos propres quiz');
        }
        return this.prisma.quiz.update({
            where: { id },
            data: updateQuizDto,
            include: {
                author: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
    }
    async remove(id, userId) {
        const quiz = await this.findOne(id);
        if (quiz.authorId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez supprimer que vos propres quiz');
        }
        return this.prisma.quiz.delete({
            where: { id },
        });
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map