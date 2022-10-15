import { Injectable } from '@angular/core';
import { Color } from 'three';

@Injectable({
  providedIn: 'root'
})
export class BrushService {
  public brushColor: Color = new Color('white');

  constructor() {}

  public setBrushColor(color: Color): void {
    this.brushColor = color;
  }

  public isSelected(color: Color): boolean {
    const colorString = `r${color.r}g${color.g}b${color.b}`;
    const brushColorString = `r${this.brushColor.r}g${this.brushColor.g}b${this.brushColor.b}`;
    return colorString == brushColorString;
  }
}
