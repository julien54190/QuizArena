export interface IBadge {
  id: string;
  name: string;
  icon: string;
  hint?: string;
  category: 'achievement' | 'milestone' | 'special';
  unlocked: boolean;
  unlockedAt?: Date;
  requirement?: string;
}

export interface IUserActivity {
  id: string;
  type: 'quiz_completed' | 'quiz_created' | 'badge_unlocked' | 'score_improved' | 'level_up';
  icon: string;
  text: string;
  time: string;
  timestamp: Date;
  metadata?: {
    quizName?: string;
    score?: number;
    badgeName?: string;
    level?: number;
  };
}

export interface IUserStats {
  totalPlays: number;
  averageScore: number;
  quizzesCreated: number;
  plan: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  xpPercent: number;
  badgesUnlocked: number;
  badgesTotal: number;
}

export interface IDashboardAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  category: 'creation' | 'analysis' | 'profile' | 'subscription';
  available: boolean;
}

export interface IUserExperience {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  xpPercent: number;
  totalXp: number;
  levelTitle: string;
}

export interface IPublicUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
  stats: IUserStats;
  experience: IUserExperience;
  unlockedBadges: IBadge[];
  recentActivities: IUserActivity[];
  isOwnProfile: boolean;
  canEdit: boolean;
}
