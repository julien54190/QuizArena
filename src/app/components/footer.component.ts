import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer role="contentinfo" class="py-6">
      <div>
        <div class="flex justify-content-between align-items-center gap-16 xs-flex-col">
          <div class="flex align-items-center gap-8 p-12">
            <img src="assets/img/logo.png" alt="logo" class="logo">
            <span class="text-semibold">QuizAréna</span>
          </div>
          <nav aria-label="Liens utiles" class="flex justify-content-center">
            <ul class="flex flex-wrap w-half gap-12 p-12 xs-w-full">
              <li><a class="text-semibold">Accueil</a></li>
              <li><a class="text-semibold">Confidentialité</a></li>
              <li><a class="text-semibold">Contact</a></li>
              <li><a class="text-semibold">Conditions</a></li>
              <li><a class="text-semibold">Cookies</a></li>
            </ul>
          </nav>
          <div class="flex align-items-center gap-8">
            <a title="Facebook"><i class="fa-brands fa-facebook" style="color: #74C0FC; font-size: 32px;"></i></a>
            <a title="Instagram"><i class="fa-brands fa-square-instagram" style="color: #dd36a0; font-size: 32px;"></i></a>
          </div>
        </div>
      </div>
      <p class="text-center text-semibold">© 2024 QuizArena. Tous droits réservés</p>
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
