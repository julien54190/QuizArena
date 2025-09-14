import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUserEmail()).toBe('');
    expect(service.jwtToken()).toBe('');
  });

  it('should logout correctly', () => {
    // Simuler un état authentifié
    service['currentUserEmail'].set('test@test.com');
    service['isAuthenticated'].set(true);
    service['jwtToken'].set('jwt-token');

    // Logout
    service.logout();

    // Vérifier que tout est réinitialisé
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUserEmail()).toBe('');
    expect(service.jwtToken()).toBe('');
    expect(service.authError()).toBe('');
  });

  it('should get token from memory', () => {
    service['jwtToken'].set('memory-token');
    expect(service.getToken()).toBe('memory-token');
  });

  it('should handle token fallback to localStorage', () => {
    service['jwtToken'].set('');
    spyOn(localStorage, 'getItem').and.returnValue('localstorage-token');
    expect(service.getToken()).toBe('localstorage-token');
  });
});
