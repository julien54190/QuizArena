import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [CommonModule],
  template: `
  <section>
    <div>
      <header>
        <h1>Créer un compte</h1>
        <p>Rejoignez la communauté et commencez à jouer.</p>
      </header>

      <form>
        <div>
          <div>
            <label for="firstname">Prénom</label>
            <input id="firstname" name="firstname" type="text" autocomplete="given-name" placeholder="Jane" required />
          </div>
          <div>
            <label for="lastname">Nom</label>
            <input id="lastname" name="lastname" type="text" autocomplete="family-name" placeholder="Doe" required />
          </div>
        </div>

        <div>
          <label for="email">Adresse e-mail</label>
          <input id="email" name="email" type="email" autocomplete="email" placeholder="exemple@domaine.com" required />
        </div>

        <div>
          <div>
            <label for="password">Mot de passe</label>
            <input id="password" name="password" type="password" autocomplete="new-password" placeholder="********" required />
          </div>
          <div>
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" placeholder="********" required />
          </div>
        </div>

        <fieldset>
          <legend>Type de compte</legend>
          <div>
            <label>
              <input type="radio" name="role" [checked]="selectedRole() === 'standard'" (change)="selectRole('standard')" value="standard">
              <span>Standard</span>
            </label>
            <label>
              <input type="radio" name="role" [checked]="selectedRole() === 'student'" (change)="selectRole('student')" value="student">
              <span>Étudiant</span>
            </label>
            <label>
              <input type="radio" name="role" [checked]="selectedRole() === 'company'" (change)="selectRole('company')" value="company">
              <span>Entreprise</span>
            </label>
          </div>
        </fieldset>

        <!-- Champs spécifiques Étudiant -->
        @if (selectedRole() === 'student') {
          <div>
            <div>
              <label for="studentEmail">Adresse e-mail étudiante</label>
              <input id="studentEmail" name="studentEmail" type="email" placeholder="prenom.nom@ecole.fr" />
            </div>
            <div>
              <label for="school">Nom de l'école</label>
              <input id="school" name="school" type="text" placeholder="Université de ..." />
            </div>
          </div>
        }

        <!-- Champs spécifiques Entreprise -->
        @if (selectedRole() === 'company') {
          <div>
            <div>
              <label for="siret">SIRET de l'entreprise</label>
              <input id="siret" name="siret" type="text" inputmode="numeric" placeholder="123 456 789 00010" />
            </div>
            <div>
              <label for="phone">Numéro de téléphone</label>
              <input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="06 12 34 56 78" />
            </div>
            <div>
              <label for="companyAddress">Adresse de l'entreprise</label>
              <input id="companyAddress" name="companyAddress" type="text" autocomplete="street-address" placeholder="10 rue Exemple, Paris" />
            </div>
          </div>
        }

        <div>
          <button type="submit">Créer le compte</button>
        </div>

        <div>
          <span>Vous avez déjà un compte ?</span>
          <a routerLink="/connexion">Se connecter</a>
        </div>
      </form>
    </div>
  </section>
  `,
})
export class RegisterComponent {
  selectedRole = signal<'standard' | 'student' | 'company'>('standard');

  selectRole(role: 'standard' | 'student' | 'company') {
    this.selectedRole.set(role);
  }
}


