import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { AuthService, RegisterPayload } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule],
  template: `
  <div class="home-container">
  <div class="home-content p-10">
    <header class="text-center mb-20">
      <h1 id="register-title" class="text-xlg text-bold mb-10">Créer un compte</h1>
      <p class="text-sm">Rejoignez la communauté et commencez à jouer</p>
    </header>

    <section class="card card-shadow mt-20">
      <h2 class="text-lg text-bold mb-20">Informations générales</h2>

      <form class="flex flex-col gap-16" aria-labelledby="register-title" (submit)="onSubmit($event)">
        <div class="flex flex-wrap gap-16">
          <div class="field">
            <label for="firstname">Prénom</label>
            <input #firstname class="w-full p-12 radius" id="firstname" name="firstname" type="text" autocomplete="given-name" placeholder="Jane" required (blur)="touchedFirstname.set(true)" [style.borderColor]="touchedFirstname() && !firstname.value.trim() ? 'var(--danger)' : undefined">
            @if (touchedFirstname() && !firstname.value.trim()) {
              <p class="error">Le prénom est requis.</p>
            }
          </div>
          <div class="field">
            <label for="lastname">Nom</label>
            <input #lastname class="w-full p-12 radius" id="lastname" name="lastname" type="text" autocomplete="family-name" placeholder="Doe" required (blur)="touchedLastname.set(true)" [style.borderColor]="touchedLastname() && !lastname.value.trim() ? 'var(--danger)' : undefined">
            @if (touchedLastname() && !lastname.value.trim()) {
              <p class="error">Le nom est requis.</p>
            }
          </div>
        </div>

        <div class="field w-full">
          <label for="email">Adresse e-mail</label>
          <input #email class="w-full p-12 radius" id="email" name="email" type="email" autocomplete="email" placeholder="exemple@domaine.com" required (blur)="touchedEmail.set(true)" [style.borderColor]="touchedEmail() && !email.validity.valid ? 'var(--danger)' : undefined">
          @if (touchedEmail() && !email.validity.valid) {
            <p class="error">Veuillez renseigner une adresse e-mail valide.</p>
          }
        </div>

        <div class="flex flex-wrap gap-16">
          <div class="field">
            <label for="password">Mot de passe</label>
            <input #password class="w-full p-12 radius" id="password" name="password" type="password" autocomplete="new-password" placeholder="********" required (blur)="touchedPassword.set(true)" [style.borderColor]="touchedPassword() && !password.value.trim() ? 'var(--danger)' : undefined">
            @if (touchedPassword() && !password.value.trim()) {
              <p class="error">Le mot de passe est requis.</p>
            }
          </div>
          <div class="field">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <input #confirmPassword class="w-full p-12 radius" id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" placeholder="********" required (blur)="touchedConfirm.set(true)" [style.borderColor]="touchedConfirm() && ( !confirmPassword.value.trim() || confirmPassword.value !== password.value ) ? 'var(--danger)' : undefined">
            @if (touchedConfirm() && !confirmPassword.value.trim()) {
              <p class="error">La confirmation est requise.</p>
            }
            @if (touchedConfirm() && confirmPassword.value && confirmPassword.value !== password.value) {
              <p class="error">Les mots de passe ne correspondent pas.</p>
            }
          </div>
        </div>

        <fieldset class="card card-white" aria-labelledby="role-legend">
          <legend id="role-legend" class="text-semibold my-2">Type de compte</legend>
          <div class="flex flex-wrap gap-16" role="radiogroup" aria-labelledby="role-legend">
            <label class="card card-white flex align-items-center gap-12 p-12 radius"
                  [class]="selectedRole() === 'STANDARD' ? 'card card-white flex align-items-center gap-12 p-12 radius text-primary' : 'card card-white flex align-items-center gap-12 p-12 radius'">
              <input class="sr-only" type="radio" name="role" [checked]="selectedRole() === 'STANDARD'" (change)="selectRole('STANDARD')" value="STANDARD" aria-checked="selectedRole() === 'STANDARD'" aria-labelledby="role-legend">
              <i class="fas" [class]="selectedRole() === 'STANDARD' ? 'fa-dot-circle' : 'fa-circle'"></i>
              <span class="text-sm">Standard</span>
            </label>

            <label class="card card-white flex align-items-center gap-12 p-12 radius"
                  [class]="selectedRole() === 'STUDENT' ? 'card card-white flex align-items-center gap-12 p-12 radius text-primary' : 'card card-white flex align-items-center gap-12 p-12 radius'">
              <input class="sr-only" type="radio" name="role" [checked]="selectedRole() === 'STUDENT'" (change)="selectRole('STUDENT')" value="STUDENT" aria-checked="selectedRole() === 'STUDENT'" aria-labelledby="role-legend">
              <i class="fas" [class]="selectedRole() === 'STUDENT' ? 'fa-dot-circle' : 'fa-circle'"></i>
              <span class="text-sm">Étudiant</span>
            </label>

            <label class="card card-white flex align-items-center gap-12 p-12 radius"
                  [class]="selectedRole() === 'COMPANY' ? 'card card-white flex align-items-center gap-12 p-12 radius text-primary' : 'card card-white flex align-items-center gap-12 p-12 radius'">
              <input class="sr-only" type="radio" name="role" [checked]="selectedRole() === 'COMPANY'" (change)="selectRole('COMPANY')" value="COMPANY" aria-checked="selectedRole() === 'COMPANY'" aria-labelledby="role-legend">
              <i class="fas" [class]="selectedRole() === 'COMPANY' ? 'fa-dot-circle' : 'fa-circle'"></i>
              <span class="text-sm">Entreprise</span>
            </label>
          </div>
        </fieldset>

        @if (selectedRole() === 'STUDENT') {
          <div class="card card-white">
            <div class="field w-full">
              <label>Adresse e-mail étudiante</label>
              <input #studentEmail class="w-full p-12 radius" id="studentEmail" name="studentEmail" type="email" placeholder="prenom.nom@ecole.fr" [required]="selectedRole() === 'STUDENT'" (blur)="touchedStudentEmail.set(true)" [style.borderColor]="touchedStudentEmail() && selectedRole() === 'STUDENT' && !studentEmail.validity.valid ? 'var(--danger)' : undefined">
              @if (touchedStudentEmail() && selectedRole() === 'STUDENT' && !studentEmail.validity.valid) {
                <p class="error">Veuillez renseigner un e-mail étudiant valide.</p>
              }
            </div>
            <div class="field w-full">
              <label>Nom de l'école</label>
              <input #school class="w-full p-12 radius" id="school" name="school" type="text" placeholder="Université de ..." [required]="selectedRole() === 'STUDENT'" (blur)="touchedSchool.set(true)" [style.borderColor]="touchedSchool() && selectedRole() === 'STUDENT' && !school.value.trim() ? 'var(--danger)' : undefined">
              @if (touchedSchool() && selectedRole() === 'STUDENT' && !school.value.trim()) {
                <p class="error">Le nom de l'école est requis.</p>
              }
            </div>
          </div>
        }

        @if (selectedRole() === 'COMPANY') {
          <div class="card card-white">
            <div class="field w-full">
              <label>SIRET de l'entreprise</label>
              <input #siret class="w-full p-12 radius" id="siret" name="siret" type="text" inputmode="numeric" placeholder="123 456 789 00010" [required]="selectedRole() === 'COMPANY'" (blur)="touchedSiret.set(true)" [style.borderColor]="touchedSiret() && selectedRole() === 'COMPANY' && !siret.value.trim() ? 'var(--danger)' : undefined">
              @if (touchedSiret() && selectedRole() === 'COMPANY' && !siret.value.trim()) {
                <p class="error">Le SIRET est requis.</p>
              }
            </div>
            <div class="field w-full">
              <label>Numéro de téléphone</label>
              <input #phone class="w-full p-12 radius" id="phone" name="phone" type="tel" autocomplete="tel" placeholder="06 12 34 56 78" [required]="selectedRole() === 'COMPANY'" (blur)="touchedPhone.set(true)" [style.borderColor]="touchedPhone() && selectedRole() === 'COMPANY' && !phone.value.trim() ? 'var(--danger)' : undefined">
              @if (touchedPhone() && selectedRole() === 'COMPANY' && !phone.value.trim()) {
                <p class="error">Le numéro de téléphone est requis.</p>
              }
            </div>
            <div class="field w-full">
              <label>Adresse de l'entreprise</label>
              <input #companyAddress class="w-full p-12 radius" id="companyAddress" name="companyAddress" type="text" autocomplete="street-address" placeholder="10 rue Exemple, Paris" [required]="selectedRole() === 'COMPANY'" (blur)="touchedCompanyAddress.set(true)" [style.borderColor]="touchedCompanyAddress() && selectedRole() === 'COMPANY' && !companyAddress.value.trim() ? 'var(--danger)' : undefined">
              @if (touchedCompanyAddress() && selectedRole() === 'COMPANY' && !companyAddress.value.trim()) {
                <p class="error">L'adresse de l'entreprise est requise.</p>
              }
            </div>
          </div>
        }

        <div class="mt-20">
          <button class="btn btn-primary py-12 px-24 w-full" type="submit" [disabled]="!isFormValid()">Créer le compte</button>
        </div>

        <div class="flex justify-content-center align-items-center gap-12 mt-20">
          <span class="text-sm xs-text-normal">Vous avez déjà un compte ?</span>
          <a class="btn btn-outline-primary py-12 px-24 radius" routerLink="/auth/connexion">Se connecter</a>
        </div>
      </form>
    </section>
  </div>
  </div>
  `,
  styles: `
    @media screen and (max-width: 920px) {
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
    }
  `
})
export class RegisterComponent implements OnInit, OnDestroy {
  selectedRole = signal<'STANDARD' | 'STUDENT' | 'COMPANY'>('STANDARD');
  private seo = inject(SeoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  // Touch signals
  touchedFirstname = signal(false);
  touchedLastname = signal(false);
  touchedEmail = signal(false);
  touchedPassword = signal(false);
  touchedConfirm = signal(false);
  touchedStudentEmail = signal(false);
  touchedSchool = signal(false);
  touchedSiret = signal(false);
  touchedPhone = signal(false);
  touchedCompanyAddress = signal(false);

  selectRole(role: 'STANDARD' | 'STUDENT' | 'COMPANY') {
    this.selectedRole.set(role);
  }

  ngOnInit(): void {
    this.seo.updateSEO({
      title: 'Créer un compte - QuizArena',
      description: "Inscrivez-vous pour rejoindre la communauté QuizArena et commencer à jouer.",
      keywords: 'inscription, compte, QuizArena'
    });
  }

  ngOnDestroy(): void {
    this.seo.resetToDefault();
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    // Helper function to get value or undefined if empty
    const getValue = (selector: string): string | undefined => {
      const value = (form.querySelector(selector) as HTMLInputElement)?.value?.trim();
      return value && value.length > 0 ? value : undefined;
    };

    const payload: RegisterPayload = {
      firstname: getValue('#firstname') || '',
      lastname: getValue('#lastname') || '',
      email: getValue('#email') || '',
      password: getValue('#password') || '',
      role: this.selectedRole(),
      studentEmail: getValue('#studentEmail'),
      school: getValue('#school'),
      siret: getValue('#siret'),
      phone: getValue('#phone'),
      companyAddress: getValue('#companyAddress'),
    };

    const res = await this.auth.register(payload);
    if (res.success) {
      this.router.navigate(['/auth', 'connexion']);
    }
  }

  isFormValid(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    const firstname = (document.getElementById('firstname') as HTMLInputElement)?.value?.trim();
    const lastname = (document.getElementById('lastname') as HTMLInputElement)?.value?.trim();
    const email = (document.getElementById('email') as HTMLInputElement);
    const password = (document.getElementById('password') as HTMLInputElement)?.value?.trim();
    const confirm = (document.getElementById('confirmPassword') as HTMLInputElement)?.value?.trim();

    if (!firstname || !lastname || !email?.validity?.valid || !password || !confirm || confirm !== password) {
      return false;
    }

    const role = this.selectedRole();
    if (role === 'STUDENT') {
      const studentEmail = (document.getElementById('studentEmail') as HTMLInputElement);
      const school = (document.getElementById('school') as HTMLInputElement)?.value?.trim();
      if (!studentEmail?.validity?.valid || !school) return false;
    }
    if (role === 'COMPANY') {
      const siret = (document.getElementById('siret') as HTMLInputElement)?.value?.trim();
      const phone = (document.getElementById('phone') as HTMLInputElement)?.value?.trim();
      const companyAddress = (document.getElementById('companyAddress') as HTMLInputElement)?.value?.trim();
      if (!siret || !phone || !companyAddress) return false;
    }
    return true;
  }
}


