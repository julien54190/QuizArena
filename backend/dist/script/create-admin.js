"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const password = process.env.ADMIN_PASSWORD || '123456';
    const baseUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const shouldReset = (process.env.ADMIN_RESET || '').toLowerCase() === '1' ||
        (process.env.ADMIN_RESET || '').toLowerCase() === 'true' ||
        !!process.env.ADMIN_PASSWORD;
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
        if (shouldReset) {
            const hash = await bcryptjs_1.default.hash(password, 10);
            await prisma.user.update({ where: { email }, data: { password: hash } });
            console.log(`Mot de passe admin réinitialisé pour: ${email}`);
        }
        else {
            console.log(`Admin déjà présent: ${email} (aucune réinitialisation demandée)`);
        }
        return;
    }
    const hash = await bcryptjs_1.default.hash(password, 10);
    let username = baseUsername;
    let suffix = 1;
    while (true) {
        const conflict = await prisma.user.findUnique({ where: { username } });
        if (!conflict)
            break;
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
            role: client_1.UserRole.ADMIN,
            status: client_1.UserStatus.ACTIVE,
            plan: client_1.UserPlan.GRATUIT,
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
//# sourceMappingURL=create-admin.js.map