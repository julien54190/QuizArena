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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const quiz_module_1 = require("./quiz/quiz.module");
const question_module_1 = require("./question/question.module");
const badge_module_1 = require("./badge/badge.module");
const quiz_session_module_1 = require("./quiz-session/quiz-session.module");
const experience_module_1 = require("./experience/experience.module");
const category_module_1 = require("./category/category.module");
const admin_module_1 = require("./admin/admin.module");
const payment_module_1 = require("./payment/payment.module");
const prisma_service_1 = require("./prisma/services/prisma.service");
let AppModule = class AppModule {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const adminEmail = 'admin@admin.com';
        const existing = await this.prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (!existing) {
            const bcrypt = await import('bcryptjs');
            const passwordHash = await bcrypt.hash('123456', 10);
            let username = 'admin';
            let suffix = 1;
            while (true) {
                const existingUsername = await this.prisma.user.findUnique({
                    where: { username },
                });
                if (!existingUsername)
                    break;
                username = `admin${suffix}`;
                suffix += 1;
            }
            await this.prisma.user.create({
                data: {
                    email: adminEmail,
                    password: passwordHash,
                    firstname: 'Admin',
                    lastname: 'User',
                    username,
                    role: 'ADMIN',
                },
            });
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            quiz_module_1.QuizModule,
            question_module_1.QuestionModule,
            badge_module_1.BadgeModule,
            quiz_session_module_1.QuizSessionModule,
            experience_module_1.ExperienceModule,
            category_module_1.CategoryModule,
            admin_module_1.AdminModule,
            payment_module_1.PaymentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppModule);
//# sourceMappingURL=app.module.js.map