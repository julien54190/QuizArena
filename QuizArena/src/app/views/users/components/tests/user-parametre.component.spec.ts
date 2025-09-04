import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserParametreComponent } from '../user-parametre.component';

describe('UserParametreComponent', () => {
  let component: UserParametreComponent;
  let fixture: ComponentFixture<UserParametreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserParametreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserParametreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
