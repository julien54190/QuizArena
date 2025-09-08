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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionController = void 0;
const common_1 = require("@nestjs/common");
const quiz_session_service_1 = require("../services/quiz-session.service");
const submit_answer_dto_1 = require("../dto/submit-answer.dto");
const jwt_auth_guard_1 = require("../../auth/guard/jwt-auth.guard");
const create_quiz_dto_1 = require("../dto/create-quiz.dto");
let QuizSessionController = class QuizSessionController {
    quizSessionService;
    constructor(quizSessionService) {
        this.quizSessionService = quizSessionService;
    }
    createSession(createQuizSessionDto, req) {
        return this.quizSessionService.createSession(createQuizSessionDto, req.user.userId);
    }
    submitAnswer(sessionId, submitAnswerDto, req) {
        return this.quizSessionService.submitAnswer(sessionId, submitAnswerDto, req.user.userId);
    }
    completeSession(sessionId, req) {
        return this.quizSessionService.completeSession(sessionId, req.user.userId);
    }
    getMySessions(req, limit) {
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return this.quizSessionService.getUserSessions(req.user.userId, limitNumber);
    }
    getMyStats(req) {
        return this.quizSessionService.getSessionStats(req.user.userId);
    }
    getLeaderboard(limit) {
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return this.quizSessionService.getLeaderboard(limitNumber);
    }
    getQuizStats(quizId) {
        return this.quizSessionService.getQuizStats(quizId);
    }
};
exports.QuizSessionController = QuizSessionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quiz_dto_1.CreateQuizSessionDto, Object]),
    __metadata("design:returntype", void 0)
], QuizSessionController.prototype, "createSession", null);
__decorate([
    (0, common_1.Post)(':id/answer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_answer_dto_1.SubmitAnswerDto, Object]),
    __metadata("design:returntype", void 0)
], QuizSessionController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizSessionController.prototype, "completeSession", null);
__decorate([
    (0, common_1.Get)('my-sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], QuizSessionController.prototype, "getMySessions", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QuizSessionController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizSessionController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('quiz/:quizId/stats'),
    __param(0, (0, common_1.Param)('quizId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizSessionController.prototype, "getQuizStats", null);
exports.QuizSessionController = QuizSessionController = __decorate([
    (0, common_1.Controller)('quiz-session'),
    __metadata("design:paramtypes", [quiz_session_service_1.QuizSessionService])
], QuizSessionController);
//# sourceMappingURL=quiz-session.controller.js.map