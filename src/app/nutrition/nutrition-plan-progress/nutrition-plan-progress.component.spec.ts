import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionPlanProgressComponent } from './nutrition-plan-progress.component';

describe('NutritionPlanProgressComponent', () => {
  let component: NutritionPlanProgressComponent;
  let fixture: ComponentFixture<NutritionPlanProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionPlanProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NutritionPlanProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
