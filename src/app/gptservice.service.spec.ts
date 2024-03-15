import { TestBed } from '@angular/core/testing';

import { GptserviceService } from './gptservice.service';

describe('GptserviceService', () => {
  let service: GptserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GptserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
