import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionItemComponent } from './nutrition-item.component';

describe('NutritionItemComponent', () => {
  let component: NutritionItemComponent;
  let fixture: ComponentFixture<NutritionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NutritionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
