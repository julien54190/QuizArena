import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.me(String(req.user.userId));
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@Request() req: any, @Body() dto: UpdateProfileDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.updateProfile(String(req.user.userId), dto);
  }
}
