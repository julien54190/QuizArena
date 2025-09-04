import { UserRole } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: UserRole;
    studentEmail?: string;
    school?: string;
    siret?: string;
    phone?: string;
    companyAddress?: string;
}
