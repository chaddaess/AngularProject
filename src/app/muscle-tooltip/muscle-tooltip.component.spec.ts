import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleTooltipComponent } from './muscle-tooltip.component';

describe('MuscleTooltipComponent', () => {
  let component: MuscleTooltipComponent;
  let fixture: ComponentFixture<MuscleTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleTooltipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MuscleTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
