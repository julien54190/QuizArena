import { PrismaClient, UserRole, UserStatus, UserPlan } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
  const password = process.env.ADMIN_PASSWORD || '123456';
  const baseUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const shouldReset =
    (process.env.ADMIN_RESET || '').toLowerCase() === '1' ||
    (process.env.ADMIN_RESET || '').toLowerCase() === 'true' ||
    !!process.env.ADMIN_PASSWORD;

  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  if (existingByEmail) {
    if (shouldReset) {
      const hash = await bcrypt.hash(password, 10);
      await prisma.user.update({ where: { email }, data: { password: hash } });
      console.log(`Mot de passe admin réinitialisé pour: ${email}`);
    } else {
      console.log(
        `Admin déjà présent: ${email} (aucune réinitialisation demandée)`,
      );
    }
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
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      plan: UserPlan.GRATUIT,
    },
  });

  console.log('Admin créé:', {
    id: user.id,
    email: user.email,
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
