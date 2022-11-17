import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushService } from '../common/services';

import { BrushTypeComponent } from './brush-type.component';

describe(BrushTypeComponent.name, () => {
  let component: BrushTypeComponent;
  let fixture: ComponentFixture<BrushTypeComponent>;
  let mockBrushService: BrushService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrushTypeComponent],
      providers: [
        {
          provide: BrushService,
          useValue: jasmine.createSpyObj(BrushService.name, ['setPaintMode'])
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrushTypeComponent);
    component = fixture.componentInstance;
    mockBrushService = TestBed.inject(BrushService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(BrushTypeComponent.prototype.onPaintModeClick.name, () => {
    it('should set paintMode true', () => {
      component.onPaintModeClick();
      expect(mockBrushService.setPaintMode).toHaveBeenCalledWith(true);
    });
  });

  describe(BrushTypeComponent.prototype.onElevationModeClick.name, () => {
    it('should set paintMode false', () => {
      component.onElevationModeClick();
      expect(mockBrushService.setPaintMode).toHaveBeenCalledWith(false);
    });
  });
});
