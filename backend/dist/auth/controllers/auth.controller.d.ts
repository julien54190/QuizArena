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
        createdAt: Date;
        updatedAt: Date;
    }>>;
    login(dto: LoginDto): Promise<{
        user: Partial<import("@prisma/client").User>;
        token: string;
    }>;
}
