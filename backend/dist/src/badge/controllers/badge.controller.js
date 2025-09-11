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
exports.BadgeController = void 0;
const common_1 = require("@nestjs/common");
const badge_service_1 = require("../services/badge.service");
const create_badge_dto_1 = require("../dto/create-badge.dto");
const update_badge_dto_1 = require("../dto/update-badge.dto");
const jwt_auth_guard_1 = require("../../auth/guard/jwt-auth.guard");
let BadgeController = class BadgeController {
    badgeService;
    constructor(badgeService) {
        this.badgeService = badgeService;
    }
    create(createBadgeDto) {
        return this.badgeService.create(createBadgeDto);
    }
    findAll() {
        return this.badgeService.findAll();
    }
    findMyBadges(req) {
        return this.badgeService.findByUser(req.user.userId);
    }
    getUnlockedBadges(req) {
        return this.badgeService.findByUser(req.user.userId);
    }
    getLockedBadges(req) {
        return this.badgeService.getAvailableBadges(req.user.userId);
    }
    findOne(id) {
        return this.badgeService.findOne(id);
    }
    unlockBadge(id, req) {
        return this.badgeService.unlockBadge(req.user.userId, {});
    }
    update(id, updateBadgeDto) {
        return this.badgeService.update(id, updateBadgeDto);
    }
    remove(id) {
        return this.badgeService.remove(id);
    }
};
exports.BadgeController = BadgeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_badge_dto_1.CreateBadgeDto]),
    __metadata("design:returntype", void 0)
], BadgeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BadgeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-badges'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BadgeController.prototype, "findMyBadges", null);
__decorate([
    (0, common_1.Get)('unlocked'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BadgeController.prototype, "getUnlockedBadges", null);
__decorate([
    (0, common_1.Get)('locked'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BadgeController.prototype, "getLockedBadges", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BadgeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/unlock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BadgeController.prototype, "unlockBadge", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_badge_dto_1.UpdateBadgeDto]),
    __metadata("design:returntype", void 0)
], BadgeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BadgeController.prototype, "remove", null);
exports.BadgeController = BadgeController = __decorate([
    (0, common_1.Controller)('badge'),
    __metadata("design:paramtypes", [badge_service_1.BadgeService])
], BadgeController);
//# sourceMappingURL=badge.controller.js.map