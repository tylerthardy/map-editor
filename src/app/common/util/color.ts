import { ColorDefinition } from '../services/terrain/color-definition';

export abstract class ColorUtils {
  public static tintColor(baseColor: ColorDefinition, tint: ColorDefinition, opacity: number): ColorDefinition {
    const r = this.calculateOverlayColorBand(baseColor.r, tint.r, opacity);
    const g = this.calculateOverlayColorBand(baseColor.g, tint.g, opacity);
    const b = this.calculateOverlayColorBand(baseColor.b, tint.b, opacity);
    return new ColorDefinition(r, g, b);
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
