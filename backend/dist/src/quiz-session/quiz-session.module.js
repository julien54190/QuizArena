"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionModule = void 0;
const common_1 = require("@nestjs/common");
const quiz_session_controller_1 = require("./controllers/quiz-session.controller");
const quiz_session_service_1 = require("./services/quiz-session.service");
const prisma_module_1 = require("../prisma/prisma.module");
const badge_module_1 = require("../badge/badge.module");
const experience_module_1 = require("../experience/experience.module");
let QuizSessionModule = class QuizSessionModule {
};
exports.QuizSessionModule = QuizSessionModule;
exports.QuizSessionModule = QuizSessionModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, badge_module_1.BadgeModule, experience_module_1.ExperienceModule],
        controllers: [quiz_session_controller_1.QuizSessionController],
        providers: [quiz_session_service_1.QuizSessionService],
        exports: [quiz_session_service_1.QuizSessionService],
    })
], QuizSessionModule);
//# sourceMappingURL=quiz-session.module.js.map