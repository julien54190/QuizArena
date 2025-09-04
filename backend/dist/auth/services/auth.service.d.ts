import { PrismaService } from '../../prisma/services/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { User } from '@prisma/client';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register(dto: RegisterDto): Promise<Partial<User>>;
}
