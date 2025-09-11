"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function seedUsers() {
    console.log('🌱 Seeding users...');
    const users = [
        {
            email: 'jean.dupont@example.com',
            password: 'password123',
            firstname: 'Jean',
            lastname: 'Dupont',
            username: 'jean.dupont',
            role: 'MODERATOR',
            status: 'ACTIVE',
            plan: 'ENTREPRISE',
            totalXp: 1250,
            currentLevel: 3,
            totalPlays: 234,
            averageScore: 78,
        },
        {
            email: 'marie.martin@example.com',
            password: 'password123',
            firstname: 'Marie',
            lastname: 'Martin',
            username: 'marie.martin',
            role: 'USER',
            status: 'ACTIVE',
            plan: 'GRATUIT',
            totalXp: 980,
            currentLevel: 2,
            totalPlays: 156,
            averageScore: 85,
        },
        {
            email: 'pierre.bernard@example.com',
            password: 'password123',
            firstname: 'Pierre',
            lastname: 'Bernard',
            username: 'pierre.bernard',
            role: 'USER',
            status: 'SUSPENDED',
            plan: 'ETUDIANT',
            totalXp: 450,
            currentLevel: 1,
            totalPlays: 89,
            averageScore: 62,
        },
        {
            email: 'sophie.petit@example.com',
            password: 'password123',
            firstname: 'Sophie',
            lastname: 'Petit',
            username: 'sophie.petit',
            role: 'ADMIN',
            status: 'ACTIVE',
            plan: 'ENTREPRISE',
            totalXp: 2100,
            currentLevel: 5,
            totalPlays: 412,
            averageScore: 92,
        },
        {
            email: 'lucas.moreau@example.com',
            password: 'password123',
            firstname: 'Lucas',
            lastname: 'Moreau',
            username: 'lucas.moreau',
            role: 'USER',
            status: 'BANNED',
            plan: 'GRATUIT',
            totalXp: 120,
            currentLevel: 1,
            totalPlays: 23,
            averageScore: 45,
        },
        {
            email: 'emma.leroy@example.com',
            password: 'password123',
            firstname: 'Emma',
            lastname: 'Leroy',
            username: 'emma.leroy',
            role: 'MODERATOR',
            status: 'ACTIVE',
            plan: 'ETUDIANT',
            totalXp: 1100,
            currentLevel: 3,
            totalPlays: 198,
            averageScore: 88,
        },
        {
            email: 'thomas.roux@example.com',
            password: 'password123',
            firstname: 'Thomas',
            lastname: 'Roux',
            username: 'thomas.roux',
            role: 'USER',
            status: 'ACTIVE',
            plan: 'GRATUIT',
            totalXp: 380,
            currentLevel: 1,
            totalPlays: 67,
            averageScore: 73,
        },
        {
            email: 'julie.david@example.com',
            password: 'password123',
            firstname: 'Julie',
            lastname: 'David',
            username: 'julie.david',
            role: 'USER',
            status: 'ACTIVE',
            plan: 'ETUDIANT',
            totalXp: 1350,
            currentLevel: 3,
            totalPlays: 245,
            averageScore: 91,
        },
        {
            email: 'antoine.bertrand@example.com',
            password: 'password123',
            firstname: 'Antoine',
            lastname: 'Bertrand',
            username: 'antoine.bertrand',
            role: 'USER',
            status: 'ACTIVE',
            plan: 'GRATUIT',
            totalXp: 200,
            currentLevel: 1,
            totalPlays: 34,
            averageScore: 68,
        },
        {
            email: 'camille.rousseau@example.com',
            password: 'password123',
            firstname: 'Camille',
            lastname: 'Rousseau',
            username: 'camille.rousseau',
            role: 'MODERATOR',
            status: 'ACTIVE',
            plan: 'ENTREPRISE',
            totalXp: 1800,
            currentLevel: 4,
            totalPlays: 367,
            averageScore: 87,
        },
    ];
    for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (!existingUser) {
            await prisma.user.create({
                data: {
                    ...userData,
                    password: hashedPassword,
                },
            });
            console.log(`✅ User created: ${userData.username}`);
        }
        else {
            console.log(`⏭️  User already exists: ${userData.username}`);
        }
    }
    console.log('✅ Users seeding completed!');
}
async function main() {
    try {
        await seedUsers();
    }
    catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
void main();
//# sourceMappingURL=seed-user.js.map