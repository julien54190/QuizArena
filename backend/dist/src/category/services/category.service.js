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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
let CategoryService = class CategoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto) {
        const created = await this.prisma.category.create({
            data: createCategoryDto,
        });
        return created;
    }
    async findAll() {
        const list = await this.prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        quizzes: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return list;
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                quizzes: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                username: true,
                            },
                        },
                        _count: {
                            select: {
                                questions: true,
                                sessions: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        quizzes: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        return category;
    }
    async findByName(name) {
        const found = await this.prisma.category.findUnique({
            where: { name },
        });
        return found;
    }
    async update(id, updateCategoryDto) {
        await this.findOne(id);
        const updated = await this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        const deleted = await this.prisma.category.delete({
            where: { id },
        });
        return deleted;
    }
    async getCategoryStats(id) {
        const category = await this.findOne(id);
        const totalQuizzes = category.quizzes.length;
        const totalQuestions = category.quizzes.reduce((sum, quiz) => sum + quiz._count.questions, 0);
        const totalPlays = category.quizzes.reduce((sum, quiz) => sum + quiz._count.sessions, 0);
        const averageScore = await this.prisma.quizSession.aggregate({
            where: {
                quiz: {
                    categoryId: id,
                },
                isCompleted: true,
            },
            _avg: {
                score: true,
            },
        });
        return {
            category: {
                id: category.id,
                name: category.name,
                icon: category.icon,
                color: category.color,
                description: category.description,
            },
            stats: {
                totalQuizzes,
                totalQuestions,
                totalPlays,
                averageScore: Math.round(averageScore._avg.score || 0),
            },
        };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map