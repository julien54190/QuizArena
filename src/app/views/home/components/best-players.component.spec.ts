import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BestPlayersComponent } from './best-players.component';
import { UserService } from '../../../services/user.service';

describe('BestPlayersComponent', () => {
  let component: BestPlayersComponent;
  let fixture: ComponentFixture<BestPlayersComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const mockTopPlayers = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      username: 'jean.dupont',
      averageScore: 95,
      totalPlays: 150,
      quizzesCreated: 12,
      status: 'active' as const,
      role: 'user' as const,
      plan: 'gratuit' as const
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      username: 'marie.martin',
      averageScore: 88,
      totalPlays: 120,
      quizzesCreated: 8,
      status: 'active' as const,
      role: 'moderator' as const,
      plan: 'etudiant' as const
    },
    {
      id: 3,
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@example.com',
      username: 'pierre.bernard',
      averageScore: 82,
      totalPlays: 95,
      quizzesCreated: 5,
      status: 'active' as const,
      role: 'user' as const,
      plan: 'entreprise' as const
    }
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [], {
      topPlayers: jasmine.createSpy().and.returnValue(mockTopPlayers)
    });

    await TestBed.configureTestingModule({
      imports: [BestPlayersComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestPlayersComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get top players from UserService', () => {
    expect(component.topPlayers()).toEqual(mockTopPlayers);
    expect(userService.topPlayers).toHaveBeenCalled();
  });

  it('should display first place player correctly', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const firstPlace = fixture.nativeElement.querySelector('article');
    const goldMedal = firstPlace.querySelector('[aria-label="Médaille d\'or - 1er place"]');
    const playerName = firstPlace.querySelector('h3');
    const averageScore = firstPlace.querySelector('div > div:nth-child(1) strong');
    const totalPlays = firstPlace.querySelector('div > div:nth-child(2) strong');
    const quizzesCreated = firstPlace.querySelector('div > div:nth-child(3) strong');

    expect(goldMedal.textContent).toBe('🥇');
    expect(playerName.textContent).toContain('Jean Dupont');
    expect(averageScore.textContent).toBe('95%');
    expect(totalPlays.textContent).toBe('150');
    expect(quizzesCreated.textContent).toBe('12');
  });

  it('should display second place player correctly', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const articles = fixture.nativeElement.querySelectorAll('article');
    const secondPlace = articles[1];
    const silverMedal = secondPlace.querySelector('[aria-label="Médaille d\'argent - 2ème place"]');
    const playerName = secondPlace.querySelector('h3');
    const averageScore = secondPlace.querySelector('div div:nth-child(1) strong');

    expect(silverMedal.textContent).toBe('🥈');
    expect(playerName.textContent).toContain('Marie Martin');
    expect(averageScore.textContent).toBe('88%');
  });

  it('should display third place player correctly', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const articles = fixture.nativeElement.querySelectorAll('article');
    const thirdPlace = articles[2];
    const bronzeMedal = thirdPlace.querySelector('[aria-label="Médaille de bronze - 3ème place"]');
    const playerName = thirdPlace.querySelector('h3');
    const averageScore = thirdPlace.querySelector('div div:nth-child(1) strong');

    expect(bronzeMedal.textContent).toBe('🥉');
    expect(playerName.textContent).toContain('Pierre Bernard');
    expect(averageScore.textContent).toBe('82%');
  });

  it('should handle empty players list', () => {
    // Arrange
    (userService.topPlayers as jasmine.Spy).and.returnValue([]);
    fixture.detectChanges();

    // Act
    const articles = fixture.nativeElement.querySelectorAll('article');

    // Assert
    expect(articles.length).toBe(0);
  });

  it('should handle partial players list (less than 3 players)', () => {
    // Arrange
    const partialPlayers = mockTopPlayers.slice(0, 2);
    (userService.topPlayers as jasmine.Spy).and.returnValue(partialPlayers);
    fixture.detectChanges();

    // Act
    const articles = fixture.nativeElement.querySelectorAll('article');

    // Assert
    expect(articles.length).toBe(2);
    expect(articles[0].querySelector('h3').textContent).toContain('Jean Dupont');
    expect(articles[1].querySelector('h3').textContent).toContain('Marie Martin');
  });

  it('should have proper accessibility attributes', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const section = fixture.nativeElement.querySelector('section');
    const list = fixture.nativeElement.querySelector('[role="list"]');
    const listItems = fixture.nativeElement.querySelectorAll('[role="listitem"]');
    const goldMedal = fixture.nativeElement.querySelector('[aria-label="Médaille d\'or - 1er place"]');
    const silverMedal = fixture.nativeElement.querySelector('[aria-label="Médaille d\'argent - 2ème place"]');
    const bronzeMedal = fixture.nativeElement.querySelector('[aria-label="Médaille de bronze - 3ème place"]');

    expect(section.getAttribute('aria-labelledby')).toBe('best-players-title');
    expect(list.getAttribute('aria-label')).toBe('Classement des meilleurs joueurs');
    expect(listItems.length).toBe(3);
    expect(goldMedal).toBeTruthy();
    expect(silverMedal).toBeTruthy();
    expect(bronzeMedal).toBeTruthy();
  });

  it('should display correct statistics labels', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const firstPlace = fixture.nativeElement.querySelector('article');
    const statsDivs = firstPlace.querySelectorAll('div > div');

    expect(statsDivs[0].textContent).toContain('Score moyen:');
    expect(statsDivs[1].textContent).toContain('Parties jouées:');
    expect(statsDivs[2].textContent).toContain('Quiz créés:');
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
    expect(articles[0].classList).toContain('card-hover');
    expect(articles[0].classList).toContain('text-center');
  });

  it('should update display when top players change', () => {
    // Arrange
    const newTopPlayers = [
      {
        id: 4,
        firstName: 'Sophie',
        lastName: 'Petit',
        email: 'sophie.petit@example.com',
        username: 'sophie.petit',
        averageScore: 98,
        totalPlays: 200,
        quizzesCreated: 15,
        status: 'active' as const,
        role: 'user' as const,
        plan: 'gratuit' as const
      }
    ];
    (userService.topPlayers as jasmine.Spy).and.returnValue(newTopPlayers);

    // Act
    fixture.detectChanges();

    // Assert
    const firstPlace = fixture.nativeElement.querySelector('article');
    const playerName = firstPlace.querySelector('h3');
    expect(playerName.textContent).toContain('Sophie Petit');
  });
});
