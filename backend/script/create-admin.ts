import { PrismaClient, UserRole, UserStatus, UserPlan } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
  const password = process.env.ADMIN_PASSWORD || '123456';
  const baseUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();

  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  if (existingByEmail) {
    console.log(`Admin déjà présent: ${email}`);
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  // Trouver un username disponible
  let username = baseUsername;
  let suffix = 1;
  while (true) {
    const conflict = await prisma.user.findUnique({ where: { username } });
    if (!conflict) break;
    username = `${baseUsername}${suffix}`;
    suffix += 1;
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      firstname: 'Admin',
      lastname: 'User',
      username,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      role: UserRole.ADMIN,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      status: UserStatus.ACTIVE,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      plan: UserPlan.GRATUIT,
    },
  });

  console.log('Admin créé:', {
    id: user.id,
    email: user.email,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    username: user.username,
    role: user.role,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
