/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BadgeService } from '../services/badge.service';
import { CreateBadgeDto } from '../dto/create-badge.dto';
import { UpdateBadgeDto } from '../dto/update-badge.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBadgeDto: CreateBadgeDto) {
    return this.badgeService.create(createBadgeDto);
  }

  @Get()
  findAll() {
    return this.badgeService.findAll();
  }

  @Get('my-badges')
  @UseGuards(JwtAuthGuard)
  findMyBadges(@Request() req) {
    return this.badgeService.findByUser(req.user.userId);
  }

  @Get('unlocked')
  @UseGuards(JwtAuthGuard)
  getUnlockedBadges(@Request() req) {
    return this.badgeService.findByUser(req.user.userId);
  }

  @Get('locked')
  @UseGuards(JwtAuthGuard)
  getLockedBadges(@Request() req) {
    return this.badgeService.getAvailableBadges(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badgeService.findOne(id);
  }

  @Post(':id/unlock')
  @UseGuards(JwtAuthGuard)
  unlockBadge(@Param('id') id: string, @Request() req) {
    return this.badgeService.unlockBadge(req.user.userId, {});
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBadgeDto: UpdateBadgeDto) {
    return this.badgeService.update(id, updateBadgeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.badgeService.remove(id);
  }
}
