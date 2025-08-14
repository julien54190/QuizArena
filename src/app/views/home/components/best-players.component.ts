import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '../../../interfaces/user';
import { USERS_DATA } from '../../../data/users.data';

@Component({
  selector: 'app-best-players',
  imports: [CommonModule],
  template: `
  <div>
    <h2>Meilleurs joueurs</h2>
    <div>
      <!-- 1er place -->
      @if (topPlayers().length > 0) {
        <div>
          <div>🥇</div>
          <h3>{{ topPlayers()[0].firstName }} {{ topPlayers()[0].lastName }}</h3>
          <div>
            <div>Score moyen: <b>{{ topPlayers()[0].averageScore }}%</b></div>
            <div>Parties jouées: <b>{{ topPlayers()[0].totalPlays }}</b></div>
            <div>Quiz créés: <b>{{ topPlayers()[0].quizzesCreated }}</b></div>
          </div>
        </div>
      }

      <!-- 2ème place -->
      @if (topPlayers().length > 1) {
        <div>
          <div>🥈</div>
          <h3>{{ topPlayers()[1].firstName }} {{ topPlayers()[1].lastName }}</h3>
          <div>
            <div>Score moyen: <b>{{ topPlayers()[1].averageScore }}%</b></div>
            <div>Parties jouées: <b>{{ topPlayers()[1].totalPlays }}</b></div>
            <div>Quiz créés: <b>{{ topPlayers()[1].quizzesCreated }}</b></div>
          </div>
        </div>
      }

      <!-- 3ème place -->
      @if (topPlayers().length > 2) {
        <div>
          <div>🥉</div>
          <h3>{{ topPlayers()[2].firstName }} {{ topPlayers()[2].lastName }}</h3>
          <div>
            <div>Score moyen: <b>{{ topPlayers()[2].averageScore }}%</b></div>
            <div>Parties jouées: <b>{{ topPlayers()[2].totalPlays }}</b></div>
            <div>Quiz créés: <b>{{ topPlayers()[2].quizzesCreated }}</b></div>
          </div>
        </div>
      }
    </div>
  </div>
  `,
  styles: ``
})
export class BestPlayersComponent {
  // Données des utilisateurs
  users = signal<IUser[]>(USERS_DATA);

  // Top 6 des meilleurs joueurs basé sur le score moyen
  topPlayers = computed(() => {
    return this.users()
      .filter(user => user.status === 'active')
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);
  });
}
