/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unused-vars */
import {
  PrismaClient,
  Question,
  Answer,
  QuizSession,
  User,
  Quiz,
} from '@prisma/client';

const prisma = new PrismaClient();

async function seedQuizSessions() {
  console.log('🌱 Seeding quiz sessions...');

  // Récupérer tous les utilisateurs actifs
  const users: User[] = await prisma.user.findMany({
    where: { status: 'ACTIVE' },
    take: 5, // Prendre les 5 premiers utilisateurs
  });

  // Récupérer tous les quiz
  const quizzes: Quiz[] = await prisma.quiz.findMany({
    take: 3, // Prendre les 3 premiers quiz
  });

  if (users.length === 0 || quizzes.length === 0) {
    console.log("❌ Pas d'utilisateurs ou de quiz trouvés");
    return;
  }

  console.log(
    `📊 Création de sessions pour ${users.length} utilisateurs et ${quizzes.length} quiz`,
  );

  // Créer des sessions de quiz pour chaque utilisateur
  for (const user of users) {
    for (const quiz of quizzes) {
      // Récupérer les questions du quiz
      const questions: (Question & { answers: Answer[] })[] =
        await prisma.question.findMany({
          where: { quizId: quiz.id },
          include: { answers: true },
        });

      if (questions.length === 0) continue;

      // Créer une session de quiz
      const session: QuizSession = await prisma.quizSession.create({
        data: {
          userId: user.id,
          quizId: quiz.id,
          startTime: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          ), // Il y a 0-7 jours
          endTime: new Date(),
          isCompleted: true,
          score: Math.floor(Math.random() * 40) + 60, // Score entre 60 et 100
        },
      });

      // Créer des réponses pour chaque question
      for (const question of questions) {
        const correctAnswer: Answer | undefined = question.answers.find(
          (a) => a.isCorrect,
        );
        const randomIndex: number = Math.floor(
          Math.random() * question.answers.length,
        );
        const fallbackAnswer: Answer | undefined =
          question.answers[randomIndex];
        const selectedAnswer: Answer | undefined =
          Math.random() > 0.3 ? correctAnswer : fallbackAnswer;

        if (!selectedAnswer) continue; // Aucun choix possible

        await prisma.quizAnswer.create({
          data: {
            sessionId: session.id,
            questionId: question.id,
            selectedAnswer: question.answers.findIndex(
              (a) => a.id === selectedAnswer.id,
            ),
            isCorrect: selectedAnswer.isCorrect,
            timeSpent: Math.floor(Math.random() * 30) + 10, // 10-40 secondes
          },
        });
      }

      console.log(
        `✅ Session créée pour ${user.username} sur ${quiz.title} - Score: ${session.score}%`,
      );
    }
  }

  console.log('✅ Quiz sessions seeding completed!');
}

async function main() {
  try {
    await seedQuizSessions();
  } catch (error) {
    console.error('❌ Error seeding quiz sessions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
