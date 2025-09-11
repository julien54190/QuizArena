import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, AdminUser, CreateUserDto, UpdateUserDto, UserStats } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <h1 class="text-xl text-bold">Gestion des Utilisateurs</h1>
        <p class="text-muted">Gérer les comptes utilisateurs, rôles et permissions</p>
      </header>

      <!-- Statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ userStats()?.totalUsers ?? 0 }}</div>
          <div class="stat-label">Total Utilisateurs</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ userStats()?.activeUsers ?? 0 }}</div>
          <div class="stat-label">Utilisateurs Actifs</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ userStats()?.adminUsers ?? 0 }}</div>
          <div class="stat-label">Administrateurs</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ userStats()?.suspendedUsers ?? 0 }}</div>
          <div class="stat-label">Suspendus</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ userStats()?.bannedUsers ?? 0 }}</div>
          <div class="stat-label">Bannis</div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="admin-content">
        <div class="content-header">
          <h2 class="text-lg text-bold">Liste des Utilisateurs</h2>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> Ajouter un Utilisateur
          </button>
        </div>

        <!-- Tableau des utilisateurs -->
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Nom d'utilisateur</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @if (users().length > 0) {
                @for (user of users(); track user.id) {
                  <tr>
                    <td>{{ user.firstname }} {{ user.lastname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.username }}</td>
                    <td>
                      <span class="role-badge" [class]="'role-' + user.role.toLowerCase()">
                        {{ user.role }}
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" [class]="'status-' + user.status.toLowerCase()">
                        {{ getStatusLabel(user.status) }}
                      </span>
                    </td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-primary" (click)="openEditModal(user)" title="Modifier">
                          <i class="fas fa-edit"></i>
                        </button>
                        @if (user.status === 'ACTIVE') {
                          <button class="btn btn-sm btn-warning" (click)="suspendUser(user)" title="Suspendre">
                            <i class="fas fa-pause"></i>
                          </button>
                          <button class="btn btn-sm btn-danger" (click)="banUser(user)" title="Bannir">
                            <i class="fas fa-ban"></i>
                          </button>
                        } @else {
                          <button class="btn btn-sm btn-success" (click)="activateUser(user)" title="Activer">
                            <i class="fas fa-check"></i>
                          </button>
                        }
                        <button class="btn btn-sm btn-danger" (click)="deleteUser(user)" title="Supprimer">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              } @else {
                <tr>
                  <td colspan="7" class="text-center text-muted">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de création/modification -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingUser() ? 'Modifier l\'utilisateur' : 'Créer un utilisateur' }}</h3>
            <button class="btn-close" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form (ngSubmit)="saveUser()" #userForm="ngForm">
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstname">Prénom *</label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    [(ngModel)]="userFormData.firstname"
                    required
                    class="form-control">
                </div>
                <div class="form-group">
                  <label for="lastname">Nom *</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    [(ngModel)]="userFormData.lastname"
                    required
                    class="form-control">
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="userFormData.email"
                  required
                  class="form-control">
              </div>

              <div class="form-group">
                <label for="username">Nom d'utilisateur *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  [(ngModel)]="userFormData.username"
                  required
                  class="form-control">
              </div>

              @if (!editingUser()) {
                <div class="form-group">
                  <label for="password">Mot de passe *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    [(ngModel)]="userFormData.password"
                    required
                    class="form-control">
                </div>
              }

              <div class="form-row">
                <div class="form-group">
                  <label for="role">Rôle *</label>
                  <select
                    id="role"
                    name="role"
                    [(ngModel)]="userFormData.role"
                    required
                    class="form-control">
                    <option value="USER">Utilisateur</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                @if (editingUser()) {
                  <div class="form-group">
                    <label for="status">Statut *</label>
                    <select
                      id="status"
                      name="status"
                      [(ngModel)]="userFormData.status"
                      required
                      class="form-control">
                      <option value="ACTIVE">Actif</option>
                      <option value="SUSPENDED">Suspendu</option>
                      <option value="BANNED">Banni</option>
                    </select>
                  </div>
                }
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary" [disabled]="!userForm.valid || loading()">
                @if (loading()) {
                  <i class="fas fa-spinner fa-spin"></i> Enregistrement...
                } @else {
                  {{ editingUser() ? 'Modifier' : 'Créer' }}
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .admin-page {
      padding: 20px;
    }

    .page-header {
      margin-bottom: 30px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }

    .admin-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
      background: #f8f9fa;
    }

    .table-container {
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }

    .admin-table th,
    .admin-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }

    .admin-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .admin-table tbody tr:hover {
      background: #f8f9fa;
    }

    .role-badge, .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .role-user {
      background: #e3f2fd;
      color: #1976d2;
    }

    .role-admin {
      background: #ffebee;
      color: #d32f2f;
    }

    .status-active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-suspended {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-banned {
      background: #ffebee;
      color: #d32f2f;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .action-buttons .btn {
      padding: 4px 8px;
      font-size: 12px;
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 18px;
      color: #6c757d;
      cursor: pointer;
      padding: 4px;
    }

    .btn-close:hover {
      color: #495057;
    }

    .modal-body {
      padding: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 4px;
      font-weight: 600;
      color: #495057;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px;
      border-top: 1px solid #e9ecef;
      background: #f8f9fa;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  // Signals pour l'état du composant
  showModal = signal(false);
  loading = signal(false);
  editingUser = signal<AdminUser | null>(null);

  // Données du formulaire
  userFormData: CreateUserDto & { status?: string } = {
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    role: 'USER',
    status: 'ACTIVE'
  };

  // Computed signals pour les données
  users = this.adminService.users;
  userStats = this.adminService.userStats;

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    try {
      await this.adminService.getUsers();
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  }

  openCreateModal(): void {
    this.router.navigate(['/admin/utilisateurs/creer']);
  }

  openEditModal(user: AdminUser): void {
    this.editingUser.set(user);
    this.userFormData = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      password: '', // Pas de mot de passe en modification
      role: user.role,
      status: user.status
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingUser.set(null);
    this.userFormData = {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      role: 'USER',
      status: 'ACTIVE'
    };
  }

  async saveUser(): Promise<void> {
    if (this.loading()) return;

    this.loading.set(true);
    try {
      if (this.editingUser()) {
        // Modification
        const updateData: UpdateUserDto = {
          firstname: this.userFormData.firstname,
          lastname: this.userFormData.lastname,
          email: this.userFormData.email,
          username: this.userFormData.username,
          role: this.userFormData.role,
          status: this.userFormData.status
        };
        await this.adminService.updateUser(this.editingUser()!.id, updateData);
        alert('Utilisateur modifié avec succès');
      } else {
        // Création
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
      }
      this.closeModal();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(error.error?.message || 'Erreur lors de la sauvegarde');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteUser(user: AdminUser): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.firstname} ${user.lastname}" ?`)) {
      try {
        await this.adminService.deleteUser(user.id);
        alert('Utilisateur supprimé avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        alert(error.error?.message || 'Erreur lors de la suppression');
      }
    }
  }

  async suspendUser(user: AdminUser): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir suspendre l'utilisateur "${user.firstname} ${user.lastname}" ?`)) {
      try {
        await this.adminService.suspendUser(user.id);
        alert('Utilisateur suspendu avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suspension:', error);
        alert(error.error?.message || 'Erreur lors de la suspension');
      }
    }
  }

  async banUser(user: AdminUser): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir bannir l'utilisateur "${user.firstname} ${user.lastname}" ?`)) {
      try {
        await this.adminService.banUser(user.id);
        alert('Utilisateur banni avec succès');
      } catch (error: any) {
        console.error('Erreur lors du bannissement:', error);
        alert(error.error?.message || 'Erreur lors du bannissement');
      }
    }
  }

  async activateUser(user: AdminUser): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir activer l'utilisateur "${user.firstname} ${user.lastname}" ?`)) {
      try {
        await this.adminService.activateUser(user.id);
        alert('Utilisateur activé avec succès');
      } catch (error: any) {
        console.error('Erreur lors de l\'activation:', error);
        alert(error.error?.message || 'Erreur lors de l\'activation');
      }
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'SUSPENDED': return 'Suspendu';
      case 'BANNED': return 'Banni';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
