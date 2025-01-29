import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseGridComponent } from './exercise-grid.component';

describe('ExerciseGridComponent', () => {
  let component: ExerciseGridComponent;
  let fixture: ComponentFixture<ExerciseGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExerciseGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
