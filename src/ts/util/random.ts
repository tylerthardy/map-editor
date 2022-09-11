import { Noise } from 'noisejs';

export abstract class RandomUtils {
  private static noise = new Noise(Math.random());

  public static perlin(x: number, y: number, heightMultiplier?: number) {
    heightMultiplier = heightMultiplier ?? 500;
    // TODO: This doesn't belong here, not a responsibility of perlin
    if (heightMultiplier == 0) {
      return 1;
    }
    return this.noise.perlin2(x + 0.001, y + 0.001) * heightMultiplier;
  }
}
