import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../dto/register.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto): Promise<Partial<User>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const existing: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email déjà utilisé');

    const hashed: string = await bcrypt.hash(dto.password, 10);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const user: Partial<User> = await this.prisma.user.create({
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
}
