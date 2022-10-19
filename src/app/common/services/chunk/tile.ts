import { Color } from 'three';
import { RandomUtils } from '../../util/random';

export class Tile {
  static size: number = 1;
  private colors = [new Color(0xff0000), new Color(0x00ff00), new Color(0x0000ff), new Color(0xffff00)];
  public topLeftCornerColor: Color = this.colors[Math.floor(Math.random() * 4)];
  public topLeftCornerElevation: number = Math.floor(RandomUtils.gaussian(1, 9, 3)) + 1;

  constructor() {}
}
