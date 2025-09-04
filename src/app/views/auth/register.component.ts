import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [CommonModule],
  template: `
  <div class="home-container">
  <div class="home-content p-10">
    <header class="text-center mb-20">
      <h1 class="text-xlg text-bold mb-10">Créer un compte</h1>
      <p class="text-sm">Rejoignez la communauté et commencez à jouer</p>
    </header>

    <section class="card card-shadow mt-20">
      <h2 class="text-lg text-bold mb-20">Informations générales</h2>

      <form class="flex flex-col gap-16">
        <div class="flex flex-wrap gap-16">
          <div class="field">
            <label>Prénom</label>
            <input class="w-full p-12 radius" id="firstname" name="firstname" type="text" autocomplete="given-name" placeholder="Jane" required>
          </div>
          <div class="field">
            <label>Nom</label>
            <input class="w-full p-12 radius" id="lastname" name="lastname" type="text" autocomplete="family-name" placeholder="Doe" required>
          </div>
        </div>

        <div class="field w-full">
          <label>Adresse e-mail</label>
          <input class="w-full p-12 radius" id="email" name="email" type="email" autocomplete="email" placeholder="exemple@domaine.com" required>
        </div>

        <div class="flex flex-wrap gap-16">
          <div class="field">
            <label>Mot de passe</label>
            <input class="w-full p-12 radius" id="password" name="password" type="password" autocomplete="new-password" placeholder="********" required>
          </div>
          <div class="field">
            <label>Confirmer le mot de passe</label>
            <input class="w-full p-12 radius" id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" placeholder="********" required>
          </div>
        </div>

        <div class="card card-white">
          <h3 class="text-semibold my-2">Type de compte</h3>
          <div class="flex flex-wrap gap-16">
            <label class="card card-white flex align-items-center gap-12 p-12 radius"
                   [class]="selectedRole() === 'standard' ? 'card card-white flex align-items-center gap-12 p-12 radius text-primary' : 'card card-white flex align-items-center gap-12 p-12 radius'">
              <input class="sr-only" type="radio" name="role" [checked]="selectedRole() === 'standard'" (change)="selectRole('standard')" value="standard">
              <i class="fas" [class]="selectedRole() === 'standard' ? 'fa-dot-circle' : 'fa-circle'"></i>
              <span class="text-sm">Standard</span>
            </label>

            <label class="card card-white flex align-items-center gap-12 p-12 radius"
                   [class]="selectedRole() === 'student' ? 'card card-white flex align-items-center gap-12 p-12 radius text-primary' : 'card card-white flex align-items-center gap-12 p-12 radius'">
              <input class="sr-only" type="radio" name="role" [checked]="selectedRole() === 'student'" (change)="selectRole('student')" value="student">
              <i class="fas" [class]="selectedRole() === 'student' ? 'fa-dot-circle' : 'fa-circle'"></i>
              <span class="text-sm">Étudiant</span>
            </label>

            <label class="card card-white flex align-items-center gap-12 p-12 radius"
                   [class]="selectedRole() === 'company' ? 'card card-white flex align-items-center gap-12 p-12 radius text-primary' : 'card card-white flex align-items-center gap-12 p-12 radius'">
              <input class="sr-only" type="radio" name="role" [checked]="selectedRole() === 'company'" (change)="selectRole('company')" value="company">
              <i class="fas" [class]="selectedRole() === 'company' ? 'fa-dot-circle' : 'fa-circle'"></i>
              <span class="text-sm">Entreprise</span>
            </label>
          </div>
        </div>

        @if (selectedRole() === 'student') {
          <div class="card card-white">
            <div class="field w-full">
              <label>Adresse e-mail étudiante</label>
              <input class="w-full p-12 radius" id="studentEmail" name="studentEmail" type="email" placeholder="prenom.nom@ecole.fr">
            </div>
            <div class="field w-full">
              <label>Nom de l'école</label>
              <input class="w-full p-12 radius" id="school" name="school" type="text" placeholder="Université de ...">
            </div>
          </div>
        }

        @if (selectedRole() === 'company') {
          <div class="card card-white">
            <div class="field w-full">
              <label>SIRET de l'entreprise</label>
              <input class="w-full p-12 radius" id="siret" name="siret" type="text" inputmode="numeric" placeholder="123 456 789 00010">
            </div>
            <div class="field w-full">
              <label>Numéro de téléphone</label>
              <input class="w-full p-12 radius" id="phone" name="phone" type="tel" autocomplete="tel" placeholder="06 12 34 56 78">
            </div>
            <div class="field w-full">
              <label>Adresse de l'entreprise</label>
              <input class="w-full p-12 radius" id="companyAddress" name="companyAddress" type="text" autocomplete="street-address" placeholder="10 rue Exemple, Paris">
            </div>
          </div>
        }

        <div class="mt-20">
          <button class="btn btn-primary py-12 px-24 w-full" type="submit">Créer le compte</button>
        </div>

        <div class="flex justify-content-center align-items-center gap-12 mt-20">
          <span class="text-sm xs-text-normal">Vous avez déjà un compte ?</span>
          <a class="btn btn-outline-primary py-12 px-24 radius" routerLink="/connexion">Se connecter</a>
        </div>
      </form>
    </section>
  </div>
  </div>
  `,
})
export class RegisterComponent {
  selectedRole = signal<'standard' | 'student' | 'company'>('standard');

  selectRole(role: 'standard' | 'student' | 'company') {
    this.selectedRole.set(role);
  }
}


