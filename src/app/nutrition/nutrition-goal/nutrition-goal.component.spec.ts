import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionGoalComponent } from './nutrition-goal.component';

describe('NutritionDetailsComponent', () => {
  let component: NutritionGoalComponent;
  let fixture: ComponentFixture<NutritionGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionGoalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutritionGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
