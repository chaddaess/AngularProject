import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionLogComponent } from './nutrition-log.component';

describe('NutritionLogComponent', () => {
  let component: NutritionLogComponent;
  let fixture: ComponentFixture<NutritionLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NutritionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
