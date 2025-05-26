import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaredataformComponent } from './caredataform.component';

describe('CaredataformComponent', () => {
  let component: CaredataformComponent;
  let fixture: ComponentFixture<CaredataformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaredataformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaredataformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
