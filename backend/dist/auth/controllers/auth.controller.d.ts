import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<Partial<{
        email: string;
        password: string;
        firstname: string;
        lastname: string;
        role: import("@prisma/client").$Enums.UserRole;
        studentEmail: string | null;
        school: string | null;
        siret: string | null;
        phone: string | null;
        companyAddress: string | null;
        id: string;
        username: string;
        avatar: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        plan: import("@prisma/client").$Enums.UserPlan;
        totalXp: number;
        currentLevel: number;
        totalPlays: number;
        averageScore: number;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    login(dto: LoginDto): Promise<{
        user: Partial<import("@prisma/client").User>;
        token: string;
    }>;
}
