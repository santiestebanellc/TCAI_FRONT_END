import { TestBed } from '@angular/core/testing';

import { ActualRoomService } from './actual-room.service';

describe('ActualRoomService', () => {
  let service: ActualRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
