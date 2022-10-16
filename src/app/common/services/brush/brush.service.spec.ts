import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';

describe('BrushService', () => {
  let service: BrushService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BrushService,
          useValue: {}
        }
      ]
    });
    service = TestBed.inject(BrushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
