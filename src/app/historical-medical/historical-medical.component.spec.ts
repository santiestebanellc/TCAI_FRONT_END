import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalMedicalComponent } from './historical-medical.component';

describe('HistoricalMedicalComponent', () => {
  let component: HistoricalMedicalComponent;
  let fixture: ComponentFixture<HistoricalMedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalMedicalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricalMedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
