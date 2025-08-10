import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer role="contentinfo">
      <div>
        <div>
          <div>
            <img src="assets/img/logo.png" alt="logo" class="logo">
            <span>QuizAréna</span>
          </div>
          <nav>
            <ul>
              <li><a>Acceuil</a></li>
              <li><a>Contact</a></li>
              <li><a>Confidentialité</a></li>
              <li><a>Conditons</a></li>
              <li><a>Cookies</a></li>
            </ul>
          </nav>
          <div>
            <a title="Facebook"><i class="fa-brands fa-facebook" style="color: #74C0FC;"></i></a>
            <a title="Instagram"><i class="fa-brands fa-square-instagram" style="color: #dd36a0;"></i></a>
          </div>
        </div>
      </div>
      <p>© 2024 QuizArena. Tous droits réservés</p>
    </footer>
  `,
  styles: ``
})
export class FooterComponent {

}
