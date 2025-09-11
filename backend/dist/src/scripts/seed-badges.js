"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const badges = [
    {
        id: 'quiz-master',
        name: 'Quiz Master',
        icon: 'fas fa-trophy',
        hint: 'Gagner 10 quiz au total',
        category: 'ACHIEVEMENT',
        requirement: 'Gagner 10 quiz',
    },
    {
        id: 'speed-runner',
        name: 'Rapide',
        icon: 'fas fa-bolt',
        hint: 'Terminer un quiz en moins de 2 minutes',
        category: 'MILESTONE',
        requirement: 'Terminer un quiz en moins de 2 minutes',
    },
    {
        id: 'strategist',
        name: 'Stratège',
        icon: 'fas fa-chess-knight',
        hint: "Réussir 5 quiz d'affilée",
        category: 'ACHIEVEMENT',
        requirement: "Réussir 5 quiz d'affilée",
    },
    {
        id: 'endurance',
        name: 'Endurant',
        icon: 'fas fa-heart',
        hint: 'Jouer 50 quiz',
        category: 'MILESTONE',
        requirement: 'Jouer 50 quiz',
    },
    {
        id: 'collector',
        name: 'Collectionneur',
        icon: 'fas fa-certificate',
        hint: 'Débloquer 10 badges',
        category: 'ACHIEVEMENT',
        requirement: 'Débloquer 10 badges',
    },
    {
        id: 'champion',
        name: 'Champion',
        icon: 'fas fa-medal',
        hint: 'Atteindre un score moyen de 90%',
        category: 'ACHIEVEMENT',
        requirement: 'Atteindre un score moyen de 90%',
    },
    {
        id: 'unbreakable',
        name: 'Incassable',
        icon: 'fas fa-shield-alt',
        hint: 'Ne jamais abandonner un quiz pendant 7 jours',
        category: 'MILESTONE',
        requirement: 'Ne jamais abandonner un quiz pendant 7 jours',
    },
    {
        id: 'scholar',
        name: 'Érudit',
        icon: 'fas fa-graduation-cap',
        hint: 'Réussir 20 quiz difficiles',
        category: 'ACHIEVEMENT',
        requirement: 'Réussir 20 quiz difficiles',
    },
    {
        id: 'creator',
        name: 'Créateur',
        icon: 'fas fa-pen-fancy',
        hint: 'Créer 5 quiz populaires',
        category: 'SPECIAL',
        requirement: 'Créer 5 quiz populaires',
    },
    {
        id: 'social',
        name: 'Social',
        icon: 'fas fa-users',
        hint: 'Partager 10 quiz avec la communauté',
        category: 'MILESTONE',
        requirement: 'Partager 10 quiz avec la communauté',
    },
];
async function seedBadges() {
    console.log('🌱 Seeding badges...');
    for (const badge of badges) {
        const existingBadge = await prisma.badge.findUnique({
            where: { id: badge.id },
        });
        if (existingBadge) {
            await prisma.badge.update({
                where: { id: badge.id },
                data: badge,
            });
        }
        else {
            await prisma.badge.create({
                data: badge,
            });
        }
        console.log(`✅ Badge "${badge.name}" créé/mis à jour`);
    }
    console.log('🎉 Tous les badges ont été initialisés !');
}
seedBadges()
    .catch((e) => {
    console.error("❌ Erreur lors de l'initialisation des badges:", e);
    process.exit(1);
})
    .finally(() => {
    void prisma.$disconnect();
});
//# sourceMappingURL=seed-badges.js.map