import { Injectable } from '@angular/core';
import { Color } from 'three';
import { KeyService } from '../key';

@Injectable({
  providedIn: 'root'
})
export class BrushService {
  public brushColor: Color = new Color('white');
  public brushElevation: number = 1;
  public paintMode: boolean = true;
  public modifySurrounding: boolean = true;

  constructor(keyService: KeyService) {
    keyService.registerKeyEvent({
      name: 'brush-service-1',
      key: '1',
      keyDown: () => {},
      keyUp: () => {
        this.paintMode = !this.paintMode;
      }
    });
  }

  public setBrushColor(color: Color): void {
    this.brushColor = color;
  }

  public setBrushElevation(elevation: number): void {
    if (elevation < 1) {
      elevation = 1;
    }
    this.brushElevation = elevation;
    console.log('elevation set to ' + this.brushElevation);
  }

  public isSelectedColor(color: Color): boolean {
    return color.getHexString() === this.brushColor.getHexString();
  }
}
