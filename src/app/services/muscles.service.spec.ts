import { TestBed } from '@angular/core/testing';

import { MusclesService } from './muscles.service';

describe('RoutinesService', () => {
  let service: MusclesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusclesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
