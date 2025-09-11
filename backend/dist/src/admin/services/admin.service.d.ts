import { PrismaService } from '../../prisma/services/prisma.service';
import { UserRole, UserStatus } from '@prisma/client';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOverview(): Promise<{
        users: number;
        quizzes: number;
        sessions: number;
    }>;
    getRecentActions(): Promise<{
        recentUsers: Array<{
            id: string;
            firstname: string;
            lastname: string;
            email: string;
            username: string;
            createdAt: Date;
        }>;
        recentQuizzes: Array<{
            id: string;
            title: string;
            description: string;
            createdAt: Date;
            author: {
                firstname: string;
                lastname: string;
                username: string;
            };
        }>;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getUsers(): Promise<Array<{
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        username: string;
        role: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    createUser(createUserDto: {
        firstname: string;
        lastname: string;
        email: string;
        username: string;
        password: string;
        role: UserRole;
    }): Promise<{
        message: string;
        user: any;
    }>;
    updateUser(id: string, updateUserDto: {
        firstname?: string;
        lastname?: string;
        email?: string;
        username?: string;
        role?: UserRole;
        status?: UserStatus;
    }): Promise<{
        message: string;
        user: any;
    }>;
    suspendUser(id: string): Promise<{
        message: string;
    }>;
    banUser(id: string): Promise<{
        message: string;
    }>;
    activateUser(id: string): Promise<{
        message: string;
    }>;
    getQuizzes(): Promise<Array<{
        id: string;
        title: string;
        description: string;
        difficulty: string;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
        author: {
            id: string;
            firstname: string;
            lastname: string;
            username: string;
        };
        category: {
            id: string;
            name: string;
        } | null;
        _count: {
            questions: number;
            sessions: number;
        };
    }>>;
    deleteQuiz(id: string): Promise<{
        message: string;
    }>;
    suspendQuiz(id: string): Promise<{
        message: string;
    }>;
    activateQuiz(id: string): Promise<{
        message: string;
    }>;
}
