import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatBarComponent } from './statbar.component';

describe('StatbarComponent', () => {
  let component: StatBarComponent;
  let fixture: ComponentFixture<StatBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
