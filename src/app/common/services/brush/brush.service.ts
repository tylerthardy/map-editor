import { Injectable } from '@angular/core';
import { Color } from 'three';
import { KeyService } from '../key';

@Injectable({
  providedIn: 'root'
})
export class BrushService {
  public get brushColor(): Color {
    return this._brushColor;
  }
  public get brushElevation(): number {
    return this._brushElevation;
  }
  public get modifySurrounding(): boolean {
    return this._modifySurrounding;
  }
  public get paintMode(): boolean {
    return this._paintMode;
  }

  private _brushColor: Color = new Color('white');
  private _brushElevation: number = 1;
  private _modifySurrounding: boolean = true;
  private _paintMode: boolean = true;

  constructor(keyService: KeyService) {
    keyService.registerKeyEvent({
      name: 'brush-service-1',
      key: '1',
      keyDown: () => {},
      keyUp: () => {
        this.setPaintMode(!this.paintMode);
      }
    });
  }

  public setPaintMode(paintOn: boolean): void {
    this._paintMode = paintOn;
  }

  public setBrushColor(color: Color): void {
    this._brushColor = color;
  }

  public setBrushElevation(elevation: number): void {
    if (elevation < 1) {
      elevation = 1;
    }
    this._brushElevation = elevation;
    console.log('elevation set to ' + this.brushElevation);
  }

  public setModifySurrounding(modifySurrounding: boolean): void {
    this._modifySurrounding = modifySurrounding;
  }

  public isSelectedColor(color: Color): boolean {
    return color.getHexString() === this.brushColor.getHexString();
  }
}
