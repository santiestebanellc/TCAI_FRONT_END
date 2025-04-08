import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDataNavIconsComponent } from './patient-data-nav-icons.component';

describe('PatientDataNavIconsComponent', () => {
  let component: PatientDataNavIconsComponent;
  let fixture: ComponentFixture<PatientDataNavIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDataNavIconsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDataNavIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
