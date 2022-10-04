import { Color } from 'three';

export class Tile {
  static size: number = 1;
  public cornerElevations: number[] = [2, 1, 1, 2];
  // public cornerColors: Color[] = [new Color(0xff0000), new Color(0x00ff00), new Color(0x0000ff), new Color(0xffff00)];
  private colors = [new Color(0xff0000), new Color(0x00ff00), new Color(0x0000ff), new Color(0xffff00)];
  public topLeftCornerColor: Color = this.colors[Math.floor(Math.random() * 4)];

  constructor() {}
}
