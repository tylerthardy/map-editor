import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushService } from '../common/services/brush/brush.service';

import { BrushElevationComponent } from './brush-elevation.component';

describe(BrushElevationComponent.name, () => {
  const STARTING_BRUSH_SIZE: number = 1;
  let component: BrushElevationComponent;
  let componentElement: HTMLElement;
  let fixture: ComponentFixture<BrushElevationComponent>;
  let mockBrushService: BrushService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrushElevationComponent],
      providers: [
        {
          provide: BrushService,
          useValue: jasmine.createSpyObj(BrushService.name, ['setBrushElevation'], {
            brushElevation: STARTING_BRUSH_SIZE
          })
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrushElevationComponent);
    component = fixture.componentInstance;
    componentElement = fixture.nativeElement as HTMLElement;
    mockBrushService = TestBed.inject(BrushService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('brush elevation value rendering', () => {
    it('should display the current brush elevation', () => {
      const brushElevationLabel: HTMLSpanElement = componentElement.querySelector(
        '.brush-elevation'
      ) as HTMLSpanElement;
      expect(brushElevationLabel.textContent).toEqual(mockBrushService.brushElevation.toString());
    });
  });

  describe(BrushElevationComponent.prototype.onMinusClick.name, () => {
    it('should add 1 to brush elevation and set in brush service', () => {
      component.onMinusClick();
      expect(mockBrushService.setBrushElevation).toHaveBeenCalledOnceWith(STARTING_BRUSH_SIZE - 1);
    });
  });

  describe(BrushElevationComponent.prototype.onPlusClick.name, () => {
    it('should add 1 to brush elevation and set in brush service', () => {
      component.onPlusClick();
      expect(mockBrushService.setBrushElevation).toHaveBeenCalledOnceWith(STARTING_BRUSH_SIZE + 1);
    });
  });
});
