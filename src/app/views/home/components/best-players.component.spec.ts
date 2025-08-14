import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestPlayersComponent } from './best-players.component';

describe('BestPlayersComponent', () => {
  let component: BestPlayersComponent;
  let fixture: ComponentFixture<BestPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestPlayersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
