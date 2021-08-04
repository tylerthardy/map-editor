import { ColorDefinition } from "../geometry/color/color-definition";

export abstract class ColorUtils {
    public static calculateOverlayColor(baseColor: ColorDefinition, overlayColor: ColorDefinition, overlayOpacity: number): ColorDefinition {
        const r = this.calculateOverlayColorBand(baseColor.r, overlayColor.r, overlayOpacity);
        const g = this.calculateOverlayColorBand(baseColor.g, overlayColor.g, overlayOpacity);
        const b = this.calculateOverlayColorBand(baseColor.b, overlayColor.b, overlayOpacity);
        return new ColorDefinition(r, g, b);
    }

    public static calculateOverlayColorBand(baseBandValue: number, overlayBandValue: number, overlayOpacity: number): number {
        // https://stackoverflow.com/a/29039328
        const baseOpacity = 1;
        const targetOpacity = 1;
        const opacityCoeff = 1 / targetOpacity;
        return opacityCoeff * (overlayBandValue * overlayOpacity + baseBandValue * baseOpacity * (1 - overlayOpacity));
    }
}