import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopularQuizComponent } from '../popular-quiz.component';
import { SearchService } from '../../../../../services/search.service';
import { QuizService } from '../../../../../services/quiz.service';

describe('PopularQuizComponent', () => {
  let component: PopularQuizComponent;
  let fixture: ComponentFixture<PopularQuizComponent>;
  let searchService: jasmine.SpyObj<SearchService>;
  let quizService: jasmine.SpyObj<QuizService>;

  const mockQuiz = {
    id: 1,
    title: 'Test Quiz',
    description: 'Test Description',
    categories: ['Sport'],
    difficulty: 'facile' as const,
    questionCount: 10,
    averageScore: 75,
    totalPlays: 100,
    creator: 'test.user',
    createdAt: '2024-01-01'
  };

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', [], {
      popularQuizzes: jasmine.createSpy().and.returnValue([mockQuiz]),
      hasActiveFilters: jasmine.createSpy().and.returnValue(false)
    });

    const quizServiceSpy = jasmine.createSpyObj('QuizService', [
      'playQuiz',
      'getDifficultyClass',
      'getCategoryIcon'
    ]);

    await TestBed.configureTestingModule({
      imports: [PopularQuizComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: QuizService, useValue: quizServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularQuizComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    quizService = TestBed.inject(QuizService) as jasmine.SpyObj<QuizService>;

    // Configuration des valeurs de retour
    quizService.getDifficultyClass.and.returnValue('badge-facile');
    quizService.getCategoryIcon.and.returnValue('⚽');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get popular quizzes from SearchService', () => {
    expect(component.popularQuizzes()).toEqual([mockQuiz]);
    expect(searchService.popularQuizzes).toHaveBeenCalled();
  });

  it('should get hasActiveFilters from SearchService', () => {
    expect(component.hasActiveFilters()).toBe(false);
    expect(searchService.hasActiveFilters).toHaveBeenCalled();
  });

  it('should call playQuiz when playQuiz method is called', () => {
    // Act
    component.playQuiz(mockQuiz);

    // Assert
    expect(quizService.playQuiz).toHaveBeenCalledWith(mockQuiz);
  });

  it('should return difficulty class from QuizService', () => {
    // Act
    const result = component.getDifficultyClass('facile');

    // Assert
    expect(result).toBe('badge-facile');
    expect(quizService.getDifficultyClass).toHaveBeenCalledWith('facile');
  });

  it('should return category icon from QuizService', () => {
    // Act
    const result = component.getCategoryIcon('Sport');

    // Assert
    expect(result).toBe('⚽');
    expect(quizService.getCategoryIcon).toHaveBeenCalledWith('Sport');
  });

  it('should display quiz information correctly', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const quizTitle = fixture.nativeElement.querySelector('h3');
    const quizDescription = fixture.nativeElement.querySelector('p');
    const questionCount = fixture.nativeElement.querySelector('.badge-info');
    const difficulty = fixture.nativeElement.querySelector('.text-semibold:not(.badge-info)');

    expect(quizTitle.textContent).toContain('Test Quiz');
    expect(quizDescription.textContent).toContain('Test Description');
    expect(questionCount.textContent).toContain('10 questions');
    expect(difficulty.textContent).toContain('facile');
  });

  it('should display empty state when no quizzes are available', () => {
    // Arrange
    (searchService.popularQuizzes as jasmine.Spy).and.returnValue([]);
    fixture.detectChanges();

    // Act
    const emptyState = fixture.nativeElement.querySelector('h3');
    const emptyMessage = fixture.nativeElement.querySelector('p');

    // Assert
    expect(emptyState.textContent).toContain('Aucun quiz trouvé');
    expect(emptyMessage.textContent).toContain('Aucun quiz disponible pour le moment');
  });

  it('should display filtered message when filters are active', () => {
    // Arrange
    (searchService.popularQuizzes as jasmine.Spy).and.returnValue([]);
    (searchService.hasActiveFilters as jasmine.Spy).and.returnValue(true);
    fixture.detectChanges();

    // Act
    const emptyMessage = fixture.nativeElement.querySelector('p');

    // Assert
    expect(emptyMessage.textContent).toContain('Aucun quiz ne correspond à vos critères de recherche');
  });

  it('should have proper accessibility attributes', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const section = fixture.nativeElement.querySelector('section');
    const list = fixture.nativeElement.querySelector('[role="list"]');
    const listItem = fixture.nativeElement.querySelector('[role="listitem"]');
    const quiz = fixture.nativeElement.querySelector('article');

    expect(section.getAttribute('aria-labelledby')).toBe('popular-quizzes-title');
    expect(list.getAttribute('aria-label')).toBe('Liste des quiz populaires');
    expect(listItem).toBeTruthy();
    expect(quiz.getAttribute('aria-label')).toContain('Quiz Test Quiz');
    expect(quiz.getAttribute('aria-describedby')).toBe('quiz-desc-1');
  });

  it('should handle keyboard events for quiz selection', () => {
    // Act
    fixture.detectChanges();
    const quiz = fixture.nativeElement.querySelector('article');

    // Simuler les événements clavier
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });

    quiz.dispatchEvent(enterEvent);
    quiz.dispatchEvent(spaceEvent);

    // Assert
    expect(quiz.getAttribute('tabindex')).toBe('0');
  });
});
