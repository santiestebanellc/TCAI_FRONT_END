import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareDataComponent } from './care-data.component';

describe('CareDataComponent', () => {
  let component: CareDataComponent;
  let fixture: ComponentFixture<CareDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
