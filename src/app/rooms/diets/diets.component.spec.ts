import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietsComponent } from './diets.component';
import { CardDietsComponent } from '../../room-cards/card-diets/card-diets.component';
import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';

describe('DietsComponent', () => {
  let component: DietsComponent;
  let fixture: ComponentFixture<DietsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietsComponent, CardEmptyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
