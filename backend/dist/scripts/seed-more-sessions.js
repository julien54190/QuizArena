"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedMoreSessions() {
    console.log('🌱 Seeding more quiz sessions...');
    const users = await prisma.user.findMany({
        where: { status: 'ACTIVE' },
        take: 3,
    });
    const quizzes = await prisma.quiz.findMany({
        take: 5,
    });
    if (users.length === 0 || quizzes.length === 0) {
        console.log("❌ Pas d'utilisateurs ou de quiz trouvés");
        return;
    }
    console.log(`📊 Création de sessions supplémentaires pour ${users.length} utilisateurs et ${quizzes.length} quiz`);
    for (const user of users) {
        for (const quiz of quizzes) {
            const questions = await prisma.question.findMany({
                where: { quizId: quiz.id },
                include: { answers: true },
            });
            if (questions.length === 0)
                continue;
            const sessionsCount = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < sessionsCount; i++) {
                const session = await prisma.quizSession.create({
                    data: {
                        userId: user.id,
                        quizId: quiz.id,
                        startTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                        endTime: new Date(),
                        isCompleted: true,
                        score: Math.floor(Math.random() * 50) + 50,
                    },
                });
                for (const question of questions) {
                    const correctAnswer = question.answers.find((a) => a.isCorrect);
                    const randIdx = Math.floor(Math.random() * question.answers.length);
                    const fallback = question.answers[randIdx];
                    const selectedAnswer = Math.random() > 0.4 ? correctAnswer : fallback;
                    if (!selectedAnswer)
                        continue;
                    await prisma.quizAnswer.create({
                        data: {
                            sessionId: session.id,
                            questionId: question.id,
                            selectedAnswer: question.answers.findIndex((a) => a.id === selectedAnswer.id),
                            isCorrect: selectedAnswer.isCorrect,
                            timeSpent: Math.floor(Math.random() * 40) + 15,
                        },
                    });
                }
                console.log(`✅ Session ${i + 1} créée pour ${user.username} sur ${quiz.title} - Score: ${session.score}%`);
            }
        }
    }
    console.log('✅ Additional quiz sessions seeding completed!');
}
async function main() {
    try {
        await seedMoreSessions();
    }
    catch (error) {
        console.error('❌ Error seeding more sessions:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
void main();
//# sourceMappingURL=seed-more-sessions.js.map