import { Noise } from "noisejs";
import { BufferAttribute, BufferGeometry, Color } from "three";

export abstract class TerrainGenerator {
    private static noise = new Noise(Math.random());

    static flattenGeometry(geometry: BufferGeometry, height?: number): BufferGeometry {
        height = height ?? 0;

        // Copy geometry and flatten it
        const newGeometry = new BufferGeometry();
        newGeometry.copy(geometry);
        const count = newGeometry.attributes.position.array.length;
        const triangleCount = count / 3;
        for (var triangleIndex = 0; triangleIndex < triangleCount; triangleIndex++) {
            newGeometry.attributes.position.setY(triangleIndex, height);
        }
        newGeometry.attributes.position.needsUpdate = true;

        return newGeometry;
    }

    static generateGeometry(width: number, height: number, size: number, heightMultiplier?: number): BufferGeometry {
        const h = heightMultiplier;
        const geometry = new BufferGeometry();

        var vertices = [];
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                // triangle 1
                vertices.push(x, this.perlin(x, y, h), y,);
                vertices.push(x, this.perlin(x, y + size, h), y + size);
                vertices.push(x + size, this.perlin(x + size, y + size, h), y + size);

                // triangle 2
                vertices.push(x, this.perlin(x, y, h), y,);
                vertices.push(x + size, this.perlin(x + size, y + size, h), y + size);
                vertices.push(x + size, this.perlin(x + size, y, h), y,);
            }
        }

        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        geometry.computeVertexNormals();

        return geometry;
    }

    private static perlin(x: number, y: number, heightMultiplier?: number) {
        heightMultiplier = heightMultiplier ?? 500;
        // TODO: This doesn't belong here, not a responsibility of perlin
        if (heightMultiplier == 0) {
            return 1;
        }
        return this.noise.perlin2(x + 0.001, y + 0.001) * heightMultiplier;
    }
}