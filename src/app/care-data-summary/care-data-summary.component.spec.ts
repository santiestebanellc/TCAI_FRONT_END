import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareDataSummaryComponent } from './care-data-summary.component';

describe('CareDataSummaryComponent', () => {
  let component: CareDataSummaryComponent;
  let fixture: ComponentFixture<CareDataSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareDataSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareDataSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
