import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding users...');

  const users = [
    {
      email: 'jean.dupont@example.com',
      password: 'password123',
      firstname: 'Jean',
      lastname: 'Dupont',
      username: 'jean.dupont',
      role: 'MODERATOR' as const,
      status: 'ACTIVE' as const,
      plan: 'ENTREPRISE' as const,
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
      role: 'USER' as const,
      status: 'ACTIVE' as const,
      plan: 'GRATUIT' as const,
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
      role: 'USER' as const,
      status: 'SUSPENDED' as const,
      plan: 'ETUDIANT' as const,
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
      role: 'ADMIN' as const,
      status: 'ACTIVE' as const,
      plan: 'ENTREPRISE' as const,
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
      role: 'USER' as const,
      status: 'BANNED' as const,
      plan: 'GRATUIT' as const,
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
      role: 'MODERATOR' as const,
      status: 'ACTIVE' as const,
      plan: 'ETUDIANT' as const,
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
      role: 'USER' as const,
      status: 'ACTIVE' as const,
      plan: 'GRATUIT' as const,
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
      role: 'USER' as const,
      status: 'ACTIVE' as const,
      plan: 'ETUDIANT' as const,
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
      role: 'USER' as const,
      status: 'ACTIVE' as const,
      plan: 'GRATUIT' as const,
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
      role: 'MODERATOR' as const,
      status: 'ACTIVE' as const,
      plan: 'ENTREPRISE' as const,
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
    } else {
      console.log(`⏭️  User already exists: ${userData.username}`);
    }
  }

  console.log('✅ Users seeding completed!');
}

async function main() {
  try {
    await seedUsers();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
