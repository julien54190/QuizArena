import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSideBarMobileComponent } from './admin-side-bar-mobile.component';

describe('AdminSideBarMobileComponent', () => {
  let component: AdminSideBarMobileComponent;
  let fixture: ComponentFixture<AdminSideBarMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSideBarMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSideBarMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
