import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDataDisplayComponent } from './medical-data-display.component';

describe('MedicalDataDisplayComponent', () => {
  let component: MedicalDataDisplayComponent;
  let fixture: ComponentFixture<MedicalDataDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalDataDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalDataDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
