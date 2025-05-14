import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalDataComponent } from './add-medical-data.component';

describe('AddMedicalDataComponent', () => {
  let component: AddMedicalDataComponent;
  let fixture: ComponentFixture<AddMedicalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicalDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
