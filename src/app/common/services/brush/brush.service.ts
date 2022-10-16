import { Injectable } from '@angular/core';
import { Color } from 'three';

@Injectable({
  providedIn: 'root'
})
export class BrushService {
  public brushColor: Color = new Color('white');
  public brushElevation: number = 1;

  constructor() {}

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
