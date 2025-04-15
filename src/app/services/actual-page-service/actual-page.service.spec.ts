import { TestBed } from '@angular/core/testing';

import { ActualPageService } from './actual-page.service';

describe('ActualPageService', () => {
  let service: ActualPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
