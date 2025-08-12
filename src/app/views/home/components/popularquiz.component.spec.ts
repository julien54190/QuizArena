import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopularQuizComponent } from './popularquiz.component';



describe('PopularquizComponent', () => {
  let component: PopularQuizComponent;
  let fixture: ComponentFixture<PopularQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
