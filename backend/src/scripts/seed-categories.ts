/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    id: 'histoire',
    name: 'Histoire',
    icon: '🏛️',
    color: '#8B5CF6',
    description: "Quiz sur l'histoire mondiale et française",
  },
  {
    id: 'geographie',
    name: 'Géographie',
    icon: '🌍',
    color: '#10B981',
    description: 'Découvrez les pays, capitales et reliefs',
  },
  {
    id: 'sciences',
    name: 'Sciences',
    icon: '🔬',
    color: '#3B82F6',
    description: 'Physique, chimie, biologie et astronomie',
  },
  {
    id: 'culture-generale',
    name: 'Culture Générale',
    icon: '📚',
    color: '#F59E0B',
    description: 'Art, littérature et musique',
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: '⚽',
    color: '#EF4444',
    description: 'Tous les sports et leurs champions',
  },
  {
    id: 'technologie',
    name: 'Technologie',
    icon: '💻',
    color: '#6366F1',
    description: 'Informatique, innovation et numérique',
  },
  {
    id: 'cuisine',
    name: 'Cuisine',
    icon: '🍳',
    color: '#F97316',
    description: 'Recettes, chefs et gastronomie',
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    color: '#059669',
    description: 'Animaux, plantes et environnement',
  },
  {
    id: 'cinema',
    name: 'Cinéma',
    icon: '🎬',
    color: '#EC4899',
    description: 'Films, acteurs et réalisateurs',
  },
];

async function seedCategories() {
  console.log('🌱 Seeding categories...');

  for (const category of categories) {
    // Vérifier si la catégorie existe déjà
    const existingCategory = await prisma.category.findUnique({
      where: { id: category.id },
    });

    if (existingCategory) {
      // Mettre à jour la catégorie existante
      await prisma.category.update({
        where: { id: category.id },
        data: category,
      });
    } else {
      // Créer une nouvelle catégorie
      await prisma.category.create({
        data: category,
      });
    }
    console.log(`✅ Catégorie "${category.name}" créée/mise à jour`);
  }

  console.log('🎉 Toutes les catégories ont été initialisées !');
}

seedCategories()
  .catch((e) => {
    console.error("❌ Erreur lors de l'initialisation des catégories:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
