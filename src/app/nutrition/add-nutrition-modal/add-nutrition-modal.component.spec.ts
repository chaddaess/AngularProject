import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNutritionModalComponent } from './add-nutrition-modal.component';

describe('AddNutritionModalComponent', () => {
  let component: AddNutritionModalComponent;
  let fixture: ComponentFixture<AddNutritionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNutritionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNutritionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
