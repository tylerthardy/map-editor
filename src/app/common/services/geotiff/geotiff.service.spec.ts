import { TestBed } from '@angular/core/testing';

import { GeotiffService } from './geotiff.service';

describe('GeotiffService', () => {
  let service: GeotiffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeotiffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(GeotiffService.prototype.loadGeotiff.name, () => {
    it('should load a geotiff from file', async () => {
      const geoTiff = await service.loadGeotiff('C:/example.tiff');
      service.toastInformation(geoTiff);
    });
  });
});
