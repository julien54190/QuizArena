import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-content p-10">
      <header class="text-center mb-20">
        <h1 class="text-xlg text-bold mb-10">Admin - Tableau de bord</h1>
        <p class="text-sm">Vue d'ensemble des statistiques de la plateforme</p>
      </header>

      <section class="card card-shadow mt-20">
        <h2 class="text-lg text-bold mb-20">Statistiques globales</h2>
        <div class="flex flex-wrap gap-16">
          <div class="card card-white">
            <h3 class="text-semibold">Utilisateurs</h3>
            <p class="text-lg">{{ stats?.users ?? 0 }}</p>
          </div>
          <div class="card card-white">
            <h3 class="text-semibold">Quiz</h3>
            <p class="text-lg">{{ stats?.quizzes ?? 0 }}</p>
          </div>
          <div class="card card-white">
            <h3 class="text-semibold">Sessions</h3>
            <p class="text-lg">{{ stats?.sessions ?? 0 }}</p>
          </div>
        </div>
      </section>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  stats: { users: number; quizzes: number; sessions: number } | null = null;
  private readonly api = 'http://localhost:3000';

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } as any : undefined;
    this.http.get<any>(`${this.api}/admin/overview`, { headers }).subscribe({
      next: d => this.stats = d,
      error: () => this.stats = { users: 0, quizzes: 0, sessions: 0 }
    });
  }
}


