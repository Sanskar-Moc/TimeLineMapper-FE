import { TestBed } from '@angular/core/testing';

import { TimelinedataService } from './timelinedata.service';

describe('TimelinedataService', () => {
  let service: TimelinedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelinedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
