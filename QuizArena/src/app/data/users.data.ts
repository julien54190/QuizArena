import { IUser } from '../interfaces/user';

export type { IUser };

export const USERS_DATA: IUser[] = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    username: 'jean.dupont',
    email: 'jean.dupont@example.com',
    role: 'moderator',
    status: 'active',
    plan: 'entreprise',
    quizzesCreated: 15,
    totalPlays: 234,
    averageScore: 78
  },
  {
    id: 2,
    firstName: 'Marie',
    lastName: 'Martin',
    username: 'marie.martin',
    email: 'marie.martin@example.com',
    role: 'user',
    status: 'active',
    plan: 'gratuit',
    quizzesCreated: 8,
    totalPlays: 156,
    averageScore: 85
  },
  {
    id: 3,
    firstName: 'Pierre',
    lastName: 'Bernard',
    username: 'pierre.bernard',
    email: 'pierre.bernard@example.com',
    role: 'user',
    status: 'suspended',
    plan: 'etudiant',
    quizzesCreated: 3,
    totalPlays: 89,
    averageScore: 62
  },
  {
    id: 4,
    firstName: 'Sophie',
    lastName: 'Petit',
    username: 'sophie.petit',
    email: 'sophie.petit@example.com',
    role: 'admin',
    status: 'active',
    plan: 'entreprise',
    quizzesCreated: 25,
    totalPlays: 412,
    averageScore: 92
  },
  {
    id: 5,
    firstName: 'Lucas',
    lastName: 'Moreau',
    username: 'lucas.moreau',
    email: 'lucas.moreau@example.com',
    role: 'user',
    status: 'banned',
    plan: 'gratuit',
    quizzesCreated: 0,
    totalPlays: 23,
    averageScore: 45
  },
  {
    id: 6,
    firstName: 'Emma',
    lastName: 'Leroy',
    username: 'emma.leroy',
    email: 'emma.leroy@example.com',
    role: 'moderator',
    status: 'active',
    plan: 'etudiant',
    quizzesCreated: 12,
    totalPlays: 198,
    averageScore: 88
  },
  {
    id: 7,
    firstName: 'Thomas',
    lastName: 'Roux',
    username: 'thomas.roux',
    email: 'thomas.roux@example.com',
    role: 'user',
    status: 'active',
    plan: 'gratuit',
    quizzesCreated: 5,
    totalPlays: 67,
    averageScore: 73
  },
  {
    id: 8,
    firstName: 'Julie',
    lastName: 'David',
    username: 'julie.david',
    email: 'julie.david@example.com',
    role: 'user',
    status: 'active',
    plan: 'etudiant',
    quizzesCreated: 18,
    totalPlays: 245,
    averageScore: 91
  },
  {
    id: 9,
    firstName: 'Antoine',
    lastName: 'Bertrand',
    username: 'antoine.bertrand',
    email: 'antoine.bertrand@example.com',
    role: 'user',
    status: 'active',
    plan: 'gratuit',
    quizzesCreated: 2,
    totalPlays: 34,
    averageScore: 68
  },
  {
    id: 10,
    firstName: 'Camille',
    lastName: 'Rousseau',
    username: 'camille.rousseau',
    email: 'camille.rousseau@example.com',
    role: 'moderator',
    status: 'active',
    plan: 'entreprise',
    quizzesCreated: 22,
    totalPlays: 367,
    averageScore: 87
  }
];
