import { Color } from 'three';
import { TileColors } from '../services';

export abstract class ColorUtils {
  public static tintColor(baseColor: Color, tint: Color, opacity: number): Color {
    const r = this.calculateOverlayColorBand(baseColor.r, tint.r, opacity);
    const g = this.calculateOverlayColorBand(baseColor.g, tint.g, opacity);
    const b = this.calculateOverlayColorBand(baseColor.b, tint.b, opacity);
    return new Color(r, g, b);
  }
  public static tintTileColors(tileColors: TileColors, tint: Color, opacity: number): TileColors {
    const tintedColors: any = {};
    Object.entries(tileColors).map((kvp: [string, Color]) => {
      const color: Color = kvp[1];
      const tinted: Color = ColorUtils.tintColor(color, tint, opacity);
      tintedColors[kvp[0]] = tinted;
    });
    return tintedColors as TileColors;
  }

  public static calculateOverlayColorBand(
    baseBandValue: number,
    overlayBandValue: number,
    overlayOpacity: number
  ): number {
    // https://stackoverflow.com/a/29039328
    const baseOpacity = 1;
    const targetOpacity = 1;
    const opacityCoeff = 1 / targetOpacity;
    return opacityCoeff * (overlayBandValue * overlayOpacity + baseBandValue * baseOpacity * (1 - overlayOpacity));
  }
}
