export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  plan: 'gratuit' | 'etudiant' | 'entreprise';
  quizzesCreated: number;
  totalPlays: number;
  averageScore: number;
  selected?: boolean;
}
