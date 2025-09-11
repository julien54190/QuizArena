import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatBarComponent } from '../stat-bar.component';
import { HomeService } from '../../../../../services/home.service';

describe('StatBarComponent', () => {
  let component: StatBarComponent;
  let fixture: ComponentFixture<StatBarComponent>;
  let homeService: jasmine.SpyObj<HomeService>;

  beforeEach(async () => {
    const homeServiceSpy = jasmine.createSpyObj('HomeService', [], {
      totalQuizzes: jasmine.createSpy().and.returnValue(150),
      totalCategories: jasmine.createSpy().and.returnValue(8),
      averageScore: jasmine.createSpy().and.returnValue(75),
      totalPlays: jasmine.createSpy().and.returnValue(5000)
    });

    await TestBed.configureTestingModule({
      imports: [StatBarComponent],
      providers: [
        { provide: HomeService, useValue: homeServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatBarComponent);
    component = fixture.componentInstance;
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get totalQuizzes from HomeService', () => {
    expect(component.totalQuizzes()).toBe(150);
    expect(homeService.totalQuizzes).toHaveBeenCalled();
  });

  it('should get totalCategories from HomeService', () => {
    expect(component.totalCategories()).toBe(8);
    expect(homeService.totalCategories).toHaveBeenCalled();
  });

  it('should get averageScore from HomeService', () => {
    expect(component.averageScore()).toBe(75);
    expect(homeService.averageScore).toHaveBeenCalled();
  });

  it('should get totalPlays from HomeService', () => {
    expect(component.totalPlays()).toBe(5000);
    expect(homeService.totalPlays).toHaveBeenCalled();
  });

  it('should display all statistics correctly', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const statElements = fixture.nativeElement.querySelectorAll('article');
    expect(statElements.length).toBe(4);

    // Vérifier le contenu de chaque statistique
    const quizCount = statElements[0].querySelector('.text-bold');
    const categoriesCount = statElements[1].querySelector('.text-bold');
    const avgScore = statElements[2].querySelector('.text-bold');
    const totalPlays = statElements[3].querySelector('.text-bold');

    expect(quizCount.textContent).toContain('150');
    expect(categoriesCount.textContent).toContain('8');
    expect(avgScore.textContent).toContain('75%');
    expect(totalPlays.textContent).toContain('5000');
  });

  it('should display correct labels for each statistic', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const statElements = fixture.nativeElement.querySelectorAll('article');

    expect(statElements[0].textContent).toContain('Quiz disponibles');
    expect(statElements[1].textContent).toContain('Catégories');
    expect(statElements[2].textContent).toContain('Score moyen');
    expect(statElements[3].textContent).toContain('Parties jouées');
  });

  it('should have proper accessibility attributes', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const section = fixture.nativeElement.querySelector('section');
    const articles = fixture.nativeElement.querySelectorAll('article');
    const quizStat = articles[0].querySelector('.text-bold');
    const categoryStat = articles[1].querySelector('.text-bold');
    const scoreStat = articles[2].querySelector('.text-bold');
    const playsStat = articles[3].querySelector('.text-bold');

    expect(section.getAttribute('aria-label')).toBe('Statistiques de QuizArena');
    expect(articles[0].getAttribute('role')).toBe('article');
    expect(articles[1].getAttribute('role')).toBe('article');
    expect(articles[2].getAttribute('role')).toBe('article');
    expect(articles[3].getAttribute('role')).toBe('article');

    expect(quizStat.getAttribute('aria-label')).toBe('Nombre total de quiz disponibles');
    expect(categoryStat.getAttribute('aria-label')).toBe('Nombre total de catégories');
    expect(scoreStat.getAttribute('aria-label')).toBe('Score moyen des utilisateurs');
    expect(playsStat.getAttribute('aria-label')).toBe('Nombre total de parties jouées');
  });

  it('should update statistics when service values change', () => {
    // Arrange
    (homeService.totalQuizzes as jasmine.Spy).and.returnValue(200);
    (homeService.averageScore as jasmine.Spy).and.returnValue(80);

    // Act
    fixture.detectChanges();

    // Assert
    const statElements = fixture.nativeElement.querySelectorAll('article');
    const quizCount = statElements[0].querySelector('.text-bold');
    const avgScore = statElements[2].querySelector('.text-bold');

    expect(quizCount.textContent).toContain('200');
    expect(avgScore.textContent).toContain('80%');
  });

  it('should have proper CSS classes for styling', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const section = fixture.nativeElement.querySelector('section');
    const articles = fixture.nativeElement.querySelectorAll('article');

    expect(section.classList).toContain('card');
    expect(section.classList).toContain('card-shadow');
    expect(articles[0].classList).toContain('card');
    expect(articles[0].classList).toContain('card-white');
    expect(articles[0].classList).toContain('text-center');
  });
});
