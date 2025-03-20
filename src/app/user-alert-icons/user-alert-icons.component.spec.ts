import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAlertIconsComponent } from './user-alert-icons.component';

describe('UserAlertIconsComponent', () => {
  let component: UserAlertIconsComponent;
  let fixture: ComponentFixture<UserAlertIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAlertIconsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAlertIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
