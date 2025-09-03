import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { PlayComponent } from './play.component';
import { HomeService } from '../../../services/home.service';
import { QuizService } from '../../../services/quiz.service';

describe('PlayComponent', () => {
  let component: PlayComponent;
  let fixture: ComponentFixture<PlayComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockHomeService: jasmine.SpyObj<HomeService>;
  let mockQuizService: jasmine.SpyObj<QuizService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    // Créer les mocks
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockCategories = [
      { id: 1, name: 'Histoire', description: 'Quiz d\'histoire', icon: '🏛️', quizCount: 5, color: '#7e22ce' },
      { id: 2, name: 'Géographie', description: 'Quiz de géographie', icon: '🌍', quizCount: 3, color: '#2563eb' }
    ];

    mockHomeService = jasmine.createSpyObj('HomeService', ['categories'], {
      categories: signal(mockCategories)
    });
    mockQuizService = jasmine.createSpyObj('QuizService', ['getQuizById']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['params'], {
      params: of({})
    });

    await TestBed.configureTestingModule({
      imports: [PlayComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: HomeService, useValue: mockHomeService },
        { provide: QuizService, useValue: mockQuizService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  describe('goBack', () => {
    it('should navigate to play page when no quiz is selected', () => {
      component['selectedQuizId'].set(null);
      component['selectedCategoryId'].set(null);

      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/jouer']);
    });

    it('should navigate to category page when quiz is selected and category exists', () => {
      component['selectedQuizId'].set(1);
      component['selectedCategoryId'].set('2');

      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/jouer', '2']);
    });

    it('should navigate to play page when quiz is selected but no category', () => {
      component['selectedQuizId'].set(1);
      component['selectedCategoryId'].set(null);

      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/jouer']);
    });
  });

  describe('selectedCategory computed', () => {
    it('should return null when no category is selected', () => {
      component['selectedCategoryId'].set(null);
      expect(component.selectedCategory()).toBeNull();
    });

    it('should return category when category is selected', () => {
      component['selectedCategoryId'].set('1');
      const category = component.selectedCategory();
      expect(category).toEqual({ id: 1, name: 'Histoire', description: 'Quiz d\'histoire', icon: '🏛️', quizCount: 5, color: '#7e22ce' });
    });
  });


});
