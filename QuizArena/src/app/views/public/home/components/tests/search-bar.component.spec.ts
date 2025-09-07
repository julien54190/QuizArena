import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../search-bar.component';
import { HomeService } from '../../../../../services/home.service';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let homeService: jasmine.SpyObj<HomeService>;

  beforeEach(async () => {
    const homeServiceSpy = jasmine.createSpyObj('HomeService', [
      'searchTerm',
      'categoryFilter',
      'difficultyFilter',
      'minQuestions',
      'minScore',
      'categories',
      'updateSearchFilters',
      'resetFilters'
    ]);

    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, FormsModule],
      providers: [
        { provide: HomeService, useValue: homeServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;

    // Configuration des valeurs de retour pour les spies
    homeService.searchTerm.and.returnValue('');
    homeService.categoryFilter.and.returnValue('');
    homeService.difficultyFilter.and.returnValue('');
    homeService.minQuestions.and.returnValue(0);
    homeService.minScore.and.returnValue(0);
    homeService.categories.and.returnValue([
      { id: 1, name: 'Histoire', icon: '🏛️', color: '#8B5CF6', description: 'Quiz sur l\'histoire', quizCount: 12 },
      { id: 2, name: 'Sport', icon: '⚽', color: '#EF4444', description: 'Tous les sports', quizCount: 10 }
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with values from HomeService', () => {
    expect(homeService.searchTerm).toHaveBeenCalled();
    expect(homeService.categoryFilter).toHaveBeenCalled();
    expect(homeService.difficultyFilter).toHaveBeenCalled();
    expect(homeService.minQuestions).toHaveBeenCalled();
    expect(homeService.minScore).toHaveBeenCalled();
  });

  it('should call updateSearchFilters when onSearchChange is called', () => {
    // Arrange
    component.searchQuery = 'test';
    component.categoryFilter = 'Histoire';
    component.difficultyFilter = 'facile';
    component.minQuestions = 10;
    component.minScore = 70;

    // Act
    component.onSearchChange();

    // Assert
    expect(homeService.updateSearchFilters).toHaveBeenCalledWith({
      searchTerm: 'test',
      categoryFilter: 'Histoire',
      difficultyFilter: 'facile',
      minQuestions: 10,
      minScore: 70
    });
  });

  it('should convert string values to numbers for minQuestions and minScore', () => {
    // Arrange
    component.searchQuery = 'test';
    component.categoryFilter = 'Sport';
    component.difficultyFilter = 'moyen';
    component.minQuestions = '15' as any; // Simuler une valeur string
    component.minScore = '80' as any; // Simuler une valeur string

    // Act
    component.onSearchChange();

    // Assert
    expect(homeService.updateSearchFilters).toHaveBeenCalledWith({
      searchTerm: 'test',
      categoryFilter: 'Sport',
      difficultyFilter: 'moyen',
      minQuestions: 15,
      minScore: 80
    });
  });

  it('should reset all filters when resetFilters is called', () => {
    // Arrange
    component.searchQuery = 'test';
    component.categoryFilter = 'Histoire';
    component.difficultyFilter = 'facile';
    component.minQuestions = 10;
    component.minScore = 70;

    // Act
    component.resetFilters();

    // Assert
    expect(homeService.resetFilters).toHaveBeenCalled();
    expect(component.searchQuery).toBe('');
    expect(component.categoryFilter).toBe('');
    expect(component.difficultyFilter).toBe('');
    expect(component.minQuestions).toBe(0);
    expect(component.minScore).toBe(0);
  });

  it('should display categories from HomeService', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const categoryOptions = fixture.nativeElement.querySelectorAll('#category-select option');
    expect(categoryOptions.length).toBe(3); // "Toutes les catégories" + 2 catégories
    expect(categoryOptions[1].textContent).toContain('Histoire');
    expect(categoryOptions[2].textContent).toContain('Sport');
  });

  it('should have proper accessibility attributes', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const searchInput = fixture.nativeElement.querySelector('#search-input');
    const categorySelect = fixture.nativeElement.querySelector('#category-select');
    const difficultySelect = fixture.nativeElement.querySelector('#difficulty-select');
    const resetButton = fixture.nativeElement.querySelector('button');

    expect(searchInput.getAttribute('aria-label')).toBe('Rechercher un quiz par nom ou description');
    expect(categorySelect.getAttribute('aria-label')).toBe('Filtrer par catégorie');
    expect(difficultySelect.getAttribute('aria-label')).toBe('Filtrer par niveau de difficulté');
    expect(resetButton.getAttribute('aria-label')).toBe('Réinitialiser tous les filtres de recherche');
  });
});
