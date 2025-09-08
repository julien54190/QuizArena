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
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
let QuestionService = class QuestionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createQuestionDto, userId) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: createQuestionDto.quizId },
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz non trouvé');
        }
        if (quiz.authorId !== userId) {
            throw new common_1.ForbiddenException("Vous ne pouvez ajouter des questions qu'à vos propres quiz");
        }
        const { answers, ...questionData } = createQuestionDto;
        return this.prisma.question.create({
            data: {
                ...questionData,
                answers: {
                    create: answers,
                },
            },
            include: {
                answers: true,
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                    },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.question.findMany({
            include: {
                answers: true,
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async findOne(id) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                answers: true,
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                    },
                },
            },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question non trouvée');
        }
        return question;
    }
    async findByQuiz(quizId) {
        return this.prisma.question.findMany({
            where: { quizId },
            include: {
                answers: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async update(id, updateQuestionDto, userId) {
        const question = await this.findOne(id);
        if (question.quiz.authorId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que les questions de vos propres quiz');
        }
        const { answers, ...questionData } = updateQuestionDto;
        if (answers) {
            await this.prisma.answer.deleteMany({
                where: { questionId: id },
            });
            return this.prisma.question.update({
                where: { id },
                data: {
                    ...questionData,
                    answers: {
                        create: answers,
                    },
                },
                include: {
                    answers: true,
                    quiz: {
                        select: {
                            id: true,
                            title: true,
                            authorId: true,
                        },
                    },
                },
            });
        }
        return this.prisma.question.update({
            where: { id },
            data: questionData,
            include: {
                answers: true,
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                    },
                },
            },
        });
    }
    async remove(id, userId) {
        const question = await this.findOne(id);
        if (question.quiz.authorId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez supprimer que les questions de vos propres quiz');
        }
        return this.prisma.question.delete({
            where: { id },
        });
    }
};
exports.QuestionService = QuestionService;
exports.QuestionService = QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionService);
//# sourceMappingURL=question.service.js.map