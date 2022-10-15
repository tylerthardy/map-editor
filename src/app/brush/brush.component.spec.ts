import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from 'three';
import { BrushService } from '../common/services/brush/brush.service';

import { BrushComponent } from './brush.component';
import { ButtonColor } from './button-color';

describe('BrushComponent', () => {
  let component: BrushComponent;
  let componentElement: HTMLElement;
  let fixture: ComponentFixture<BrushComponent>;
  let mockBrushService: BrushService = jasmine.createSpyObj([BrushService.name, ['setBrushColor']]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrushComponent],
      providers: [
        {
          provide: BrushService,
          useValue: mockBrushService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrushComponent);
    component = fixture.componentInstance;
    componentElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(BrushComponent.prototype.onButtonColorClick.name, () => {
    it('should set color to specified color', () => {
      const color: Color = new Color('red');
      const buttonColor: ButtonColor = {
        color,
        name: 'red button'
      };
      component.onButtonColorClick(buttonColor);

      expect(mockBrushService.setBrushColor).toHaveBeenCalledOnceWith(color);
    });

    it('should be called when a button is clicked, with appropriate params', () => {
      const colorButtons: HTMLButtonElement[] = Array.from(componentElement.querySelectorAll('.brush-button'));
      const button: HTMLButtonElement = colorButtons.find((button) => !button.classList.contains('selected'))!;

      button.click();
      const selectedColor: Color = new Color(button.style.backgroundColor);
      expect(mockBrushService.setBrushColor).toHaveBeenCalledWith(selectedColor);
      expect(mockBrushService.brushColor).toEqual(selectedColor);
      expect(button.style.border).toEqual('1 px solid white');
    });
  });
});
