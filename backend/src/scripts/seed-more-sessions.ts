/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unused-vars */
import {
  PrismaClient,
  User,
  Quiz,
  Question,
  Answer,
  QuizSession,
} from '@prisma/client';

const prisma = new PrismaClient();

async function seedMoreSessions() {
  console.log('🌱 Seeding more quiz sessions...');

  // Récupérer tous les utilisateurs actifs
  const users: User[] = await prisma.user.findMany({
    where: { status: 'ACTIVE' },
    take: 3, // Prendre 3 utilisateurs
  });

  // Récupérer tous les quiz
  const quizzes: Quiz[] = await prisma.quiz.findMany({
    take: 5, // Prendre 5 quiz
  });

  if (users.length === 0 || quizzes.length === 0) {
    console.log("❌ Pas d'utilisateurs ou de quiz trouvés");
    return;
  }

  console.log(
    `📊 Création de sessions supplémentaires pour ${users.length} utilisateurs et ${quizzes.length} quiz`,
  );

  // Créer des sessions supplémentaires pour chaque utilisateur
  for (const user of users) {
    for (const quiz of quizzes) {
      // Récupérer les questions du quiz
      const questions: (Question & { answers: Answer[] })[] =
        await prisma.question.findMany({
          where: { quizId: quiz.id },
          include: { answers: true },
        });

      if (questions.length === 0) continue;

      // Créer 2-3 sessions par quiz pour chaque utilisateur
      const sessionsCount = Math.floor(Math.random() * 2) + 2; // 2-3 sessions

      for (let i = 0; i < sessionsCount; i++) {
        const session: QuizSession = await prisma.quizSession.create({
          data: {
            userId: user.id,
            quizId: quiz.id,
            startTime: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
            ), // Il y a 0-30 jours
            endTime: new Date(),
            isCompleted: true,
            score: Math.floor(Math.random() * 50) + 50, // Score entre 50 et 100
          },
        });

        // Créer des réponses pour chaque question
        for (const question of questions) {
          const correctAnswer: Answer | undefined = question.answers.find(
            (a) => a.isCorrect,
          );
          const randIdx: number = Math.floor(
            Math.random() * question.answers.length,
          );
          const fallback: Answer | undefined = question.answers[randIdx];
          const selectedAnswer: Answer | undefined =
            Math.random() > 0.4 ? correctAnswer : fallback;

          if (!selectedAnswer) continue;

          await prisma.quizAnswer.create({
            data: {
              sessionId: session.id,
              questionId: question.id,
              selectedAnswer: question.answers.findIndex(
                (a) => a.id === selectedAnswer.id,
              ),
              isCorrect: selectedAnswer.isCorrect,
              timeSpent: Math.floor(Math.random() * 40) + 15, // 15-55 secondes
            },
          });
        }

        console.log(
          `✅ Session ${i + 1} créée pour ${user.username} sur ${quiz.title} - Score: ${session.score}%`,
        );
      }
    }
  }

  console.log('✅ Additional quiz sessions seeding completed!');
}

async function main() {
  try {
    await seedMoreSessions();
  } catch (error) {
    console.error('❌ Error seeding more sessions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
