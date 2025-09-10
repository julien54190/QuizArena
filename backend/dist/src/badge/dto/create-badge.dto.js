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
exports.CreateBadgeDto = exports.BadgeCategory = void 0;
const class_validator_1 = require("class-validator");
var BadgeCategory;
(function (BadgeCategory) {
    BadgeCategory["ACHIEVEMENT"] = "ACHIEVEMENT";
    BadgeCategory["MILESTONE"] = "MILESTONE";
    BadgeCategory["SPECIAL"] = "SPECIAL";
})(BadgeCategory || (exports.BadgeCategory = BadgeCategory = {}));
class CreateBadgeDto {
    name;
    icon;
    hint;
    category;
    requirement;
    isActive = true;
}
exports.CreateBadgeDto = CreateBadgeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "icon", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "hint", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(BadgeCategory),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "requirement", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBadgeDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-badge.dto.js.map