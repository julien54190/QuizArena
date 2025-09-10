import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  totalScore?: number;
  avgScore?: number;
  totalSessions?: number;
}

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private http = inject(HttpClient);
  private readonly api = 'http://localhost:3000';

  private _entries = signal<LeaderboardEntry[]>([]);
  entries = this._entries.asReadonly();

  load(limit = 10): void {
    this.http
      .get<any[]>(`${this.api}/quiz-session/leaderboard`, {
        params: { limit } as any,
      })
      .subscribe((rows) => {
        const mapped: LeaderboardEntry[] = (rows ?? []).map((r: any) => ({
          userId: r?.user?.id ?? '',
          username: [r?.user?.firstname, r?.user?.lastname].filter(Boolean).join(' '),
          avatar: r?.user?.avatar ?? undefined,
          avgScore: r?.averageScore ?? r?._avg?.score ?? 0,
          totalSessions: r?.totalSessions ?? r?._count?.id ?? 0,
        }));
        this._entries.set(mapped);
      });
  }
}


