import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, CreateUserDto } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <h1 class="text-xl text-bold">Créer un utilisateur</h1>
        <p class="text-muted">Créer un nouveau compte utilisateur</p>
      </header>

      <div class="admin-content">
        <form (ngSubmit)="onSubmit()" #userForm="ngForm">
          <div class="form-section">
            <h2 class="text-lg text-bold mb-20">Informations générales</h2>

            <div class="form-row">
              <div class="form-group">
                <label for="firstname">Prénom *</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  [(ngModel)]="userFormData.firstname"
                  required
                  class="form-control"
                  placeholder="Jane">
              </div>
              <div class="form-group">
                <label for="lastname">Nom *</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  [(ngModel)]="userFormData.lastname"
                  required
                  class="form-control"
                  placeholder="Doe">
              </div>
            </div>

            <div class="form-group">
              <label for="email">Adresse e-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="userFormData.email"
                required
                class="form-control"
                placeholder="exemple@domaine.com">
            </div>

            <div class="form-group">
              <label for="username">Nom d'utilisateur *</label>
              <input
                type="text"
                id="username"
                name="username"
                [(ngModel)]="userFormData.username"
                required
                class="form-control"
                placeholder="jane.doe">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="password">Mot de passe *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  [(ngModel)]="userFormData.password"
                  required
                  class="form-control"
                  placeholder="********">
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirmer le mot de passe *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  required
                  class="form-control"
                  placeholder="********">
                @if (confirmPassword && userFormData.password !== confirmPassword) {
                  <p class="error">Les mots de passe ne correspondent pas</p>
                }
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2 class="text-lg text-bold mb-20">Type de compte</h2>

            <fieldset class="role-selection">
              <div class="role-options">
                <label class="role-option" [class.selected]="userFormData.role === 'USER'">
                  <input
                    type="radio"
                    name="role"
                    value="USER"
                    [(ngModel)]="userFormData.role"
                    class="sr-only">
                  <div class="role-card">
                    <i class="fas fa-user"></i>
                    <span>Utilisateur Standard</span>
                    <p>Accès standard à la plateforme</p>
                  </div>
                </label>

                <label class="role-option" [class.selected]="userFormData.role === 'ADMIN'">
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    [(ngModel)]="userFormData.role"
                    class="sr-only">
                  <div class="role-card">
                    <i class="fas fa-crown"></i>
                    <span>Administrateur</span>
                    <p>Accès complet à l'administration</p>
                  </div>
                </label>
              </div>
            </fieldset>
          </div>

          @if (userFormData.role === 'STUDENT') {
            <div class="form-section">
              <h2 class="text-lg text-bold mb-20">Informations étudiant</h2>

              <div class="form-group">
                <label for="studentEmail">Adresse e-mail étudiante *</label>
                <input
                  type="email"
                  id="studentEmail"
                  name="studentEmail"
                  [(ngModel)]="userFormData.studentEmail"
                  required
                  class="form-control"
                  placeholder="prenom.nom@ecole.fr">
              </div>

              <div class="form-group">
                <label for="school">Nom de l'école *</label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  [(ngModel)]="userFormData.school"
                  required
                  class="form-control"
                  placeholder="Université de ...">
              </div>
            </div>
          }

          @if (userFormData.role === 'COMPANY') {
            <div class="form-section">
              <h2 class="text-lg text-bold mb-20">Informations entreprise</h2>

              <div class="form-group">
                <label for="siret">SIRET de l'entreprise *</label>
                <input
                  type="text"
                  id="siret"
                  name="siret"
                  [(ngModel)]="userFormData.siret"
                  required
                  class="form-control"
                  placeholder="123 456 789 00010">
              </div>

              <div class="form-group">
                <label for="phone">Numéro de téléphone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  [(ngModel)]="userFormData.phone"
                  required
                  class="form-control"
                  placeholder="06 12 34 56 78">
              </div>

              <div class="form-group">
                <label for="companyAddress">Adresse de l'entreprise *</label>
                <input
                  type="text"
                  id="companyAddress"
                  name="companyAddress"
                  [(ngModel)]="userFormData.companyAddress"
                  required
                  class="form-control"
                  placeholder="10 rue Exemple, Paris">
              </div>
            </div>
          }

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="goBack()">Annuler</button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!isFormValid() || loading()">
              @if (loading()) {
                <i class="fas fa-spinner fa-spin"></i> Création...
              } @else {
                <i class="fas fa-plus"></i> Créer l'utilisateur
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 20px;
    }

    .page-header {
      margin-bottom: 30px;
    }

    .admin-content {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .form-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #495057;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ced4da;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }

    .role-selection {
      border: none;
      padding: 0;
      margin: 0;
    }

    .role-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .role-option {
      cursor: pointer;
    }

    .role-option input {
      display: none;
    }

    .role-card {
      padding: 20px;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      text-align: center;
      transition: all 0.2s ease;
      background: white;
    }

    .role-option.selected .role-card {
      border-color: #3498db;
      background: #f8f9ff;
    }

    .role-card i {
      font-size: 24px;
      color: #6c757d;
      margin-bottom: 12px;
      display: block;
    }

    .role-option.selected .role-card i {
      color: #3498db;
    }

    .role-card span {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: #2c3e50;
    }

    .role-card p {
      font-size: 12px;
      color: #6c757d;
      margin: 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .role-options {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminCreateUserComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);

  loading = signal(false);
  confirmPassword = '';

  userFormData: CreateUserDto & { studentEmail?: string; school?: string; siret?: string; phone?: string; companyAddress?: string } = {
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    role: 'USER'
  };

  async onSubmit(): Promise<void> {
    if (!this.isFormValid() || this.loading()) return;

    this.loading.set(true);
    try {
      const createData: CreateUserDto = {
        firstname: this.userFormData.firstname,
        lastname: this.userFormData.lastname,
        email: this.userFormData.email,
        username: this.userFormData.username,
        password: this.userFormData.password,
        role: this.userFormData.role
      };

      await this.adminService.createUser(createData);
      alert('Utilisateur créé avec succès');
      this.router.navigate(['/admin/utilisateurs']);
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      alert(error.error?.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      this.loading.set(false);
    }
  }

  isFormValid(): boolean {
    if (!this.userFormData.firstname || !this.userFormData.lastname ||
        !this.userFormData.email || !this.userFormData.username ||
        !this.userFormData.password || !this.confirmPassword) {
      return false;
    }

    if (this.userFormData.password !== this.confirmPassword) {
      return false;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userFormData.email)) {
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.userFormData = {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      role: 'USER'
    };
    this.confirmPassword = '';
  }

  goBack(): void {
    this.router.navigate(['/admin/utilisateurs']);
  }
}
