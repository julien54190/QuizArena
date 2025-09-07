/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  // Configuration des niveaux
  private readonly LEVEL_TITLES: { [key: number]: string } = {
    1: 'Débutant',
    2: 'Apprenti',
    3: 'Élève',
    4: 'Étudiant',
    5: 'Connaisseur',
    6: 'Expert',
    7: 'Maître',
    8: 'Grand Maître',
    9: 'Légende',
    10: 'Mythique',
  };

  private readonly XP_REQUIREMENTS: { [key: number]: number } = {
    1: 0,
    2: 500,
    3: 1000,
    4: 2000,
    5: 3500,
    6: 5000,
    7: 7000,
    8: 10000,
    9: 15000,
    10: 25000,
  };

  // Calculer le niveau basé sur l'XP
  calculateLevel(xp: number): number {
    const levels = Object.keys(this.XP_REQUIREMENTS)
      .map(Number)
      .sort((a, b) => a - b);
    let level = 1;

    for (const lvl of levels) {
      if (xp >= this.XP_REQUIREMENTS[lvl]) {
        level = lvl;
      } else {
        break;
      }
    }

    return level;
  }

  // Obtenir le titre du niveau
  getLevelTitle(level: number): string {
    return this.LEVEL_TITLES[level] || 'Inconnu';
  }

  // Obtenir l'XP requis pour le prochain niveau
  getNextLevelXp(currentLevel: number): number {
    return (
      this.XP_REQUIREMENTS[currentLevel + 1] ||
      this.XP_REQUIREMENTS[currentLevel]
    );
  }

  // Calculer le pourcentage de progression vers le prochain niveau
  getXpProgress(currentXp: number, currentLevel: number): number {
    const nextLevelXp = this.getNextLevelXp(currentLevel);
    const currentLevelXp = this.XP_REQUIREMENTS[currentLevel];
    const xpNeeded = nextLevelXp - currentLevelXp;
    const xpProgress = currentXp - currentLevelXp;

    return Math.min(100, Math.round((xpProgress / xpNeeded) * 100));
  }

  // Ajouter de l'XP à un utilisateur
  async addXp(
    userId: string,
    xpToAdd: number,
  ): Promise<{
    newXp: number;
    newLevel: number;
    levelUp: boolean;
    oldLevel: number;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const oldLevel = user.currentLevel;
    const newXp = user.totalXp + xpToAdd;
    const newLevel = this.calculateLevel(newXp);
    const levelUp = newLevel > oldLevel;

    // Mettre à jour l'utilisateur
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalXp: newXp,
        currentLevel: newLevel,
      },
    });

    return {
      newXp,
      newLevel,
      levelUp,
      oldLevel,
    };
  }

  // Calculer l'XP basé sur les performances d'un quiz
  calculateQuizXp(
    score: number,
    timeSpent: number,
    difficulty: string,
  ): number {
    let baseXp = 0;

    // XP de base selon le score
    if (score >= 90) baseXp = 100;
    else if (score >= 80) baseXp = 80;
    else if (score >= 70) baseXp = 60;
    else if (score >= 60) baseXp = 40;
    else if (score >= 50) baseXp = 20;
    else baseXp = 10;

    // Bonus de difficulté
    const difficultyMultiplier = {
      FACILE: 1,
      MOYEN: 1.5,
      DIFFICILE: 2,
    } as const;

    baseXp = Math.round(baseXp * (difficultyMultiplier[difficulty] || 1));

    // Bonus de rapidité (si terminé rapidement)
    if (timeSpent < 300) {
      // Moins de 5 minutes
      baseXp = Math.round(baseXp * 1.2);
    }

    return baseXp;
  }

  // Obtenir les statistiques d'expérience d'un utilisateur
  async getUserExperience(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const nextLevelXp = this.getNextLevelXp(user.currentLevel);
    const xpProgress = this.getXpProgress(user.totalXp, user.currentLevel);

    return {
      level: user.currentLevel,
      currentXp: user.totalXp,
      nextLevelXp,
      xpProgress,
      totalXp: user.totalXp,
      levelTitle: this.getLevelTitle(user.currentLevel),
      totalPlays: user.totalPlays,
      averageScore: user.averageScore,
    };
  }

  // Mettre à jour les statistiques après un quiz
  async updateUserStatsAfterQuiz(
    userId: string,
    score: number,
    timeSpent: number,
    difficulty: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Calculer l'XP gagné
    const xpGained = this.calculateQuizXp(score, timeSpent, difficulty);

    // Ajouter l'XP
    const xpResult = await this.addXp(userId, xpGained);

    // Mettre à jour les statistiques
    const newTotalPlays = user.totalPlays + 1;
    const newAverageScore =
      (user.averageScore * user.totalPlays + score) / newTotalPlays;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPlays: newTotalPlays,
        averageScore: Math.round(newAverageScore * 100) / 100, // Arrondir à 2 décimales
      },
    });

    return {
      xpGained,
      xpResult,
      newTotalPlays,
      newAverageScore: Math.round(newAverageScore * 100) / 100,
    };
  }

  // Obtenir le classement d'un utilisateur
  async getUserRanking(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Classement par XP
    const xpRanking = await this.prisma.user.count({
      where: {
        totalXp: {
          gt: user.totalXp,
        },
      },
    });

    // Classement par score moyen
    const scoreRanking = await this.prisma.user.count({
      where: {
        averageScore: {
          gt: user.averageScore,
        },
        totalPlays: {
          gte: 5, // Au moins 5 quiz joués pour être classé
        },
      },
    });

    return {
      xpRanking: xpRanking + 1,
      scoreRanking: scoreRanking + 1,
      totalUsers: await this.prisma.user.count(),
    };
  }
}
