import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDietsComponent } from './card-diets.component';

describe('CardDietsComponent', () => {
  let component: CardDietsComponent;
  let fixture: ComponentFixture<CardDietsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDietsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDietsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
