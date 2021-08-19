import { Vector2 } from "three";

export class BrushService {
    public radius: number;
    private _brushOffsets: number[][];

    constructor() { }

    getBrushArray(x: number, y: number): Vector2[] {
        var ret = [];
        for (var j = x - this.radius; j <= x + this.radius; j++) {
            for (var k = y - this.radius; k <= y + this.radius; k++) {
                if (Math.abs(new Vector2(j, k).distanceTo(new Vector2(x, y))) <= this.radius) {
                    ret.push(new Vector2(j, k));
                }
            }
        }
        return ret;
    }
}

export default new BrushService();