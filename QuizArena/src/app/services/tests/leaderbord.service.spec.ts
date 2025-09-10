import { TestBed } from '@angular/core/testing';
import { LeaderboardService } from '../leaderbord.service';



describe('LeaderbordService', () => {
  let service: LeaderboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
