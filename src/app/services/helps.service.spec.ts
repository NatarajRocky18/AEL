import { TestBed } from '@angular/core/testing';

import { HelpsService } from './helps.service';

describe('HelpsService', () => {
  let service: HelpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
