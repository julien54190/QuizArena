import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ISEOConfig } from '../interfaces/seo';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  private defaultConfig: ISEOConfig = {
    title: 'QuizArena - Testez vos connaissances',
    description: 'Découvrez des quiz passionnants sur divers sujets. Testez vos connaissances et améliorez votre culture générale avec QuizArena.',
    keywords: 'quiz, culture générale, jeux, éducation, connaissances'
  };

  // Mettre à jour le SEO avec une configuration personnalisée
  updateSEO(config: Partial<ISEOConfig>): void {
    const fullConfig = { ...this.defaultConfig, ...config };

    // Titre de la page
    this.title.setTitle(fullConfig.title);

    // Meta description
    this.meta.updateTag({ name: 'description', content: fullConfig.description });

    // Meta keywords
    if (fullConfig.keywords) {
      this.meta.updateTag({ name: 'keywords', content: fullConfig.keywords });
    }

    // Open Graph
    if (fullConfig.ogTitle) {
      this.meta.updateTag({ property: 'og:title', content: fullConfig.ogTitle });
    }
    if (fullConfig.ogDescription) {
      this.meta.updateTag({ property: 'og:description', content: fullConfig.ogDescription });
    }
    if (fullConfig.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: fullConfig.ogImage });
    }
  }

  // Méthodes spécifiques pour chaque page
  setHomePage(): void {
    this.updateSEO({
      title: 'QuizArena - Accueil',
      description: 'Bienvenue sur QuizArena ! Découvrez des quiz passionnants sur l\'histoire, la géographie, les sciences et bien plus encore.',
      keywords: 'quiz, accueil, culture générale, jeux éducatifs'
    });
  }

  setPlayPage(): void {
    this.updateSEO({
      title: 'Jouer aux Quiz - QuizArena',
      description: 'Choisissez une catégorie et jouez à nos quiz interactifs. Testez vos connaissances et améliorez votre score !',
      keywords: 'jouer, quiz, catégories, jeux'
    });
  }

  setCategoryPage(categoryName: string): void {
    this.updateSEO({
      title: `Quiz ${categoryName} - QuizArena`,
      description: `Découvrez nos quiz sur ${categoryName}. Testez vos connaissances et améliorez votre culture générale.`,
      keywords: `${categoryName}, quiz, culture générale`
    });
  }

  setQuizPage(quizTitle: string, quizDescription: string, categories: string[]): void {
    this.updateSEO({
      title: `[Quiz] ${quizTitle} - QuizArena`,
      description: `Jouez au quiz ${quizTitle}. ${quizDescription}`,
      keywords: `${categories.join(', ')}, quiz, jeux`,
      ogTitle: `Quiz ${quizTitle}`,
      ogDescription: quizDescription
    });
  }

  // Réinitialiser aux valeurs par défaut
  resetToDefault(): void {
    this.updateSEO(this.defaultConfig);
  }
}
