import { TestBed } from '@angular/core/testing';
import { Color } from 'three';
import { KeyService } from '../key';

import { BrushService } from './brush.service';

describe('BrushService', () => {
  let service: BrushService;
  let mockKeyService: KeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: KeyService,
          useValue: jasmine.createSpyObj(KeyService, ['registerKeyEvent'])
        }
      ]
    });

    service = TestBed.inject(BrushService);
    mockKeyService = TestBed.inject(KeyService);
  });

  it('should be created', () => {
    expect(mockKeyService.registerKeyEvent).toHaveBeenCalledOnceWith({
      name: 'brush-service-1',
      key: '1',
      keyDown: jasmine.any(Function),
      keyUp: jasmine.any(Function)
    });
    expect(service).toBeTruthy();
  });

  describe(BrushService.prototype.setPaintMode.name, () => {
    it('should set paintMode', () => {
      const initialMode: boolean = service.paintMode;
      service.setPaintMode(!initialMode);
      expect(service.paintMode).toEqual(!initialMode);
    });
  });

  describe(BrushService.prototype.setBrushColor.name, () => {
    it('should set brushColor', () => {
      service.setBrushColor(new Color('red'));
      expect(service.brushColor).toEqual(new Color('red'));
    });
  });

  describe(BrushService.prototype.setBrushElevation.name, () => {
    it('should set brushElevation', () => {
      service.setBrushElevation(48973);
      expect(service.brushElevation).toEqual(48973);
    });

    it('should set elevation below 1 to 1', () => {
      service.setBrushElevation(-9382);
      expect(service.brushElevation).toEqual(1);
    });
  });

  describe(BrushService.prototype.setModifySurrounding.name, () => {
    it('should set modifySurrounding', () => {
      const initialMode: boolean = service.modifySurrounding;
      service.setModifySurrounding(!initialMode);
      expect(service.modifySurrounding).toEqual(!initialMode);
    });
  });

  describe(BrushService.prototype.isSelectedColor.name, () => {
    it('should return true when the provided color equals selected color', () => {
      service.setBrushColor(new Color('pink'));
      const isSelectedColor: boolean = service.isSelectedColor(new Color('pink'));
      expect(isSelectedColor).toEqual(true);
    });

    it('should return false when the provided color does not equal selected color', () => {
      service.setBrushColor(new Color('green'));
      const isSelectedColor: boolean = service.isSelectedColor(new Color('pink'));
      expect(isSelectedColor).toEqual(false);
    });
  });
});
