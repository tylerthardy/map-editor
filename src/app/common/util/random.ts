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

  public static gaussian(min: number, max: number, skew: number) {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = RandomUtils.gaussian(min, max, skew); // resample between 0 and 1 if out of range
    else {
      num = Math.pow(num, skew); // Skew
      num *= max - min; // Stretch to fill range
      num += min; // offset to min
    }
    return num;
  }
}
