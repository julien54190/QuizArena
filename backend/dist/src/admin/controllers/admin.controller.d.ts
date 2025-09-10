import { AdminService } from '../services/admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    overview(): Promise<{
        users: number;
        quizzes: number;
        sessions: number;
    }>;
}
