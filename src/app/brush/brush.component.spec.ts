import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from 'three';
import { BrushService } from '../common/services/brush/brush.service';

import { BrushComponent } from './brush.component';
import { ButtonColor } from './button-color';

fdescribe('BrushComponent', () => {
  let component: BrushComponent;
  let componentElement: HTMLElement;
  let fixture: ComponentFixture<BrushComponent>;
  let mockBrushService: jasmine.SpyObj<BrushService>;

  beforeEach(async () => {
    mockBrushService = jasmine.createSpyObj('BrushService', ['setBrushColor', 'isSelected']);
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

  describe('color button rendering', () => {
    it('should have border class when the color is the brush color', async () => {
      mockBrushService.isSelected.and.returnValue(true);

      fixture.detectChanges();
      await fixture.whenStable();

      const colorButtons: HTMLButtonElement[] = Array.from(componentElement.querySelectorAll('.brush-button'));
      const selectedButtons: HTMLButtonElement[] = Array.from(componentElement.querySelectorAll('.selected-color'));
      expect(colorButtons.length).toEqual(selectedButtons.length);
    });
  });

  describe(BrushComponent.prototype.onButtonColorClick.name, () => {
    it('should call set brush color on service when color clicked', async () => {
      const colorButtons: HTMLButtonElement[] = Array.from(componentElement.querySelectorAll('.brush-button'));
      const button: HTMLButtonElement = colorButtons.find((button) => !button.classList.contains('selected-color'))!;

      button.click();
      fixture.detectChanges();
      await fixture.whenStable();

      const selectedColor: Color = new Color(button.style.backgroundColor);
      expect(mockBrushService.setBrushColor).toHaveBeenCalledWith(selectedColor);
    });

    it('should set color to specified color', () => {
      const color: Color = new Color('green');
      const buttonColor: ButtonColor = {
        color,
        name: 'green button'
      };
      component.onButtonColorClick(buttonColor);

      expect(mockBrushService.setBrushColor).toHaveBeenCalledOnceWith(color);
    });
  });
});
