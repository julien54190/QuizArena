/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient() {
    return this.prisma as any;
  }

  async register(dto: RegisterDto): Promise<Partial<User>> {
    const existing = await this.prismaClient.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email déjà utilisé');

    const hashed: string = await bcrypt.hash(dto.password, 10);

    const user = await this.prismaClient.user.create({
      data: {
        email: dto.email,
        password: hashed,
        firstname: dto.firstname,
        lastname: dto.lastname,
        role: dto.role,
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

  async login(dto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    const user = await this.prismaClient.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const token: string = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }
}
