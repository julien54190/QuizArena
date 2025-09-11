"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const [users, quizzes, sessions] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.quiz.count(),
            this.prisma.quizSession.count(),
        ]);
        return { users, quizzes, sessions };
    }
    async getRecentActions() {
        const [recentUsers, recentQuizzes] = await Promise.all([
            this.prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    username: true,
                    createdAt: true,
                },
            }),
            this.prisma.quiz.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                    author: {
                        select: {
                            firstname: true,
                            lastname: true,
                            username: true,
                        },
                    },
                },
            }),
        ]);
        return { recentUsers, recentQuizzes };
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: 'Utilisateur supprimé avec succès' };
    }
    async getUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                username: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createUser(createUserDto) {
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Cet email est déjà utilisé');
        }
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: createUserDto.username },
        });
        if (existingUsername) {
            throw new common_1.ConflictException("Ce nom d'utilisateur est déjà utilisé");
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                firstname: createUserDto.firstname,
                lastname: createUserDto.lastname,
                email: createUserDto.email,
                username: createUserDto.username,
                password: hashedPassword,
                role: createUserDto.role,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                username: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });
        return { message: 'Utilisateur créé avec succès', user };
    }
    async updateUser(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Cet email est déjà utilisé');
            }
        }
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUsername = await this.prisma.user.findUnique({
                where: { username: updateUserDto.username },
            });
            if (existingUsername) {
                throw new common_1.ConflictException("Ce nom d'utilisateur est déjà utilisé");
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                username: true,
                role: true,
                status: true,
                updatedAt: true,
            },
        });
        return { message: 'Utilisateur mis à jour avec succès', user: updatedUser };
    }
    async suspendUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        await this.prisma.user.update({
            where: { id },
            data: { status: 'SUSPENDED' },
        });
        return { message: 'Utilisateur suspendu avec succès' };
    }
    async banUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        await this.prisma.user.update({
            where: { id },
            data: { status: 'BANNED' },
        });
        return { message: 'Utilisateur banni avec succès' };
    }
    async activateUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        await this.prisma.user.update({
            where: { id },
            data: { status: 'ACTIVE' },
        });
        return { message: 'Utilisateur activé avec succès' };
    }
    async getQuizzes() {
        return this.prisma.quiz.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                isPublic: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        username: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        sessions: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteQuiz(id) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz non trouvé');
        }
        await this.prisma.quiz.delete({
            where: { id },
        });
        return { message: 'Quiz supprimé avec succès' };
    }
    async suspendQuiz(id) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz non trouvé');
        }
        await this.prisma.quiz.update({
            where: { id },
            data: { isPublic: false },
        });
        return { message: 'Quiz suspendu avec succès' };
    }
    async activateQuiz(id) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz non trouvé');
        }
        await this.prisma.quiz.update({
            where: { id },
            data: { isPublic: true },
        });
        return { message: 'Quiz activé avec succès' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map