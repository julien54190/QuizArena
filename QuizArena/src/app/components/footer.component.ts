import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer role="contentinfo" class="py-6">
      <div>
        <div class="flex justify-content-between align-items-center gap-16 xs-flex-col">
          <div class="flex align-items-center gap-8 p-12">
            <img src="assets/img/logo.png" alt="Logo QuizAréna" class="logo">
            <span class="text-semibold">QuizAréna</span>
          </div>
          <nav aria-label="Liens utiles du pied de page" class="flex justify-content-center">
            <ul class="flex flex-wrap w-half gap-12 p-12 xs-w-full" role="list">
              <li role="listitem"><a href="#" class="text-semibold" aria-label="Aller à la page d'accueil">Accueil</a></li>
              <li role="listitem"><a href="#" class="text-semibold" aria-label="Consulter la politique de confidentialité">Confidentialité</a></li>
              <li role="listitem"><a href="#" class="text-semibold" aria-label="Nous contacter">Contact</a></li>
              <li role="listitem"><a href="#" class="text-semibold" aria-label="Consulter les conditions d'utilisation">Conditions</a></li>
              <li role="listitem"><a href="#" class="text-semibold" aria-label="Consulter la politique des cookies">Cookies</a></li>
            </ul>
          </nav>
          <div class="flex align-items-center gap-8" role="group" aria-label="Réseaux sociaux">
            <a href="#" title="Suivez-nous sur Facebook" aria-label="Suivez-nous sur Facebook">
              <i class="fa-brands fa-facebook" style="color: #74C0FC; font-size: 32px;" aria-hidden="true"></i>
            </a>
            <a href="#" title="Suivez-nous sur Instagram" aria-label="Suivez-nous sur Instagram">
              <i class="fa-brands fa-square-instagram" style="color: #dd36a0; font-size: 32px;" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
      <p class="text-center text-semibold" role="contentinfo">© 2024 QuizArena. Tous droits réservés</p>
    </footer>
  `,
  styles: `
    footer {
      background-color: var(--primary);
      color: var(--gray-100);
      width: 100%;
    }

    span{
      font-size: 1.5rem;
    }

    footer a {
      color: var(--gray-100);
    }

    footer a:focus {
      outline: 2px solid var(--gray-100);
      outline-offset: 2px;
    }

    @media screen and (max-width: 920px) {
      .logo {
        width: 40px;
        height: 40px;
      }


      span {
        font-size: 1.2rem;
      }

      .fa-brands {
        font-size: 24px !important;
      }
    }
  `
})
export class FooterComponent {

}
