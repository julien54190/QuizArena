import { PrismaService } from '../../prisma/services/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '@prisma/client';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private get prismaClient();
    register(dto: RegisterDto): Promise<Partial<User>>;
    login(dto: LoginDto): Promise<{
        user: Partial<User>;
        token: string;
    }>;
}
