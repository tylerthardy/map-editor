export class ColorDefinition {
  public r: number;
  public g: number;
  public b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  toString() {
    return this.toHexString();
  }

  toRGB(): { r: number; g: number; b: number } {
    return {
      r: Math.floor(this.r * 255),
      g: Math.floor(this.g * 255),
      b: Math.floor(this.b * 255)
    };
  }

  toHexString(): string {
    const rgb = this.toRGB();
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  private componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  private rgbToHex(r: number, g: number, b: number) {
    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
}

export abstract class ColorDefinitions {
  static BLACK = new ColorDefinition(0, 0, 0);
  static WHITE = new ColorDefinition(1, 1, 1);
  static RED = new ColorDefinition(1, 0, 0);
  static GREEN = new ColorDefinition(0, 1, 0);
  static BLUE = new ColorDefinition(0, 0, 1);
  static CYAN = new ColorDefinition(0, 1, 1);
  static MAGENTA = new ColorDefinition(1, 0, 1);
  static YELLOW = new ColorDefinition(1, 1, 0);
  static GRAY = new ColorDefinition(0.5, 0.5, 0.5);
}
