import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyViewerComponent } from './body-viewer.component';

describe('BodyViewerComponent', () => {
  let component: BodyViewerComponent;
  let fixture: ComponentFixture<BodyViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BodyViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
