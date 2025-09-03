import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateQuizComponent } from '../user-create-quiz.component';

describe('UserCreateQuizComponent', () => {
  let component: UserCreateQuizComponent;
  let fixture: ComponentFixture<UserCreateQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
