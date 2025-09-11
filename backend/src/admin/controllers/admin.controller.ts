import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserRole, UserStatus } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  async overview() {
    return this.adminService.getOverview();
  }

  @Get('recent-actions')
  async getRecentActions() {
    return this.adminService.getRecentActions();
  }

  @Delete('user/:id')
  async deleteRecentUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Delete('quiz/:id')
  async deleteRecentQuiz(@Param('id') id: string) {
    return this.adminService.deleteQuiz(id);
  }

  // Gestion des utilisateurs
  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Post('users')
  async createUser(
    @Body()
    createUserDto: {
      firstname: string;
      lastname: string;
      email: string;
      username: string;
      password: string;
      role: UserRole;
    },
  ) {
    return this.adminService.createUser(createUserDto);
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    updateUserDto: {
      firstname?: string;
      lastname?: string;
      email?: string;
      username?: string;
      role?: UserRole;
      status?: UserStatus;
    },
  ) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Put('users/:id/suspend')
  async suspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(id);
  }

  @Put('users/:id/ban')
  async banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }

  @Put('users/:id/activate')
  async activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }

  // Gestion des quizzes
  @Get('quizzes')
  async getQuizzes() {
    return this.adminService.getQuizzes();
  }

  @Delete('quizzes/:id')
  async deleteQuiz(@Param('id') id: string) {
    return this.adminService.deleteQuiz(id);
  }

  @Put('quizzes/:id/suspend')
  async suspendQuiz(@Param('id') id: string) {
    return this.adminService.suspendQuiz(id);
  }

  @Put('quizzes/:id/activate')
  async activateQuiz(@Param('id') id: string) {
    return this.adminService.activateQuiz(id);
  }
}
