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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    get prismaClient() {
        return this.prisma;
    }
    async register(dto) {
        const existing = await this.prismaClient.user.findUnique({
            where: { email: dto.email },
        });
        if (existing)
            throw new common_1.BadRequestException('Email déjà utilisé');
        const hashed = await bcrypt.hash(dto.password, 10);
        const normalizedRole = (dto.role ?? 'USER')
            .toString()
            .trim()
            .toUpperCase()
            .replace('STANDARD', 'USER')
            .replace('ETUDIANT', 'USER')
            .replace('GRATUIT', 'USER');
        const user = await this.prismaClient.user.create({
            data: {
                email: dto.email,
                password: hashed,
                firstname: dto.firstname,
                lastname: dto.lastname,
                username: dto.email.split('@')[0],
                role: normalizedRole,
                studentEmail: dto.studentEmail ?? null,
                school: dto.school ?? null,
                siret: dto.siret ?? null,
                phone: dto.phone ?? null,
                companyAddress: dto.companyAddress ?? null,
            },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                role: true,
                createdAt: true,
            },
        });
        return user;
    }
    async login(dto) {
        const user = await this.prismaClient.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token,
        };
    }
    async me(userId) {
        const user = await this.prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                role: true,
                username: true,
                status: true,
                plan: true,
                createdAt: true,
            },
        });
        return user;
    }
    async updateProfile(userId, dto) {
        const data = {};
        if (dto.firstname !== undefined)
            data.firstname = dto.firstname;
        if (dto.lastname !== undefined)
            data.lastname = dto.lastname;
        if (dto.username !== undefined)
            data.username = dto.username;
        if (dto.email !== undefined)
            data.email = dto.email;
        if (dto.password !== undefined) {
            const hashed = await bcrypt.hash(dto.password, 10);
            data.password = hashed;
        }
        const user = await this.prismaClient.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                role: true,
                username: true,
                status: true,
                plan: true,
                createdAt: true,
            },
        });
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map