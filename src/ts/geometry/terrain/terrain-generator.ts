import { BufferAttribute, BufferGeometry } from 'three';
import { RandomUtils } from "../../util/random";

export abstract class TerrainGenerator {
    static flattenVertices(original: BufferAttribute, height?: number): BufferAttribute {
        height = height ?? 0;

        // Copy geometry and flatten it
        const count = original.array.length;
        const newGeometry = new BufferAttribute(new Float32Array(count), 3);
        newGeometry.copy(original);
        const triangleCount = count / 3;
        for (var triangleIndex = 0; triangleIndex < triangleCount; triangleIndex++) {
            newGeometry.setY(triangleIndex, height);
        }
        newGeometry.needsUpdate = true;

        return newGeometry;
    }

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

    static generateVertices(width: number, height: number, size: number, heightMultiplier?: number): BufferAttribute {
        const h = heightMultiplier;

        var vertices = [];
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                // triangle 1
                vertices.push(x, RandomUtils.perlin(x, y, h), y,);
                vertices.push(x, RandomUtils.perlin(x, y + size, h), y + size);
                vertices.push(x + size, RandomUtils.perlin(x + size, y + size, h), y + size);

                // triangle 2
                vertices.push(x, RandomUtils.perlin(x, y, h), y,);
                vertices.push(x + size, RandomUtils.perlin(x + size, y + size, h), y + size);
                vertices.push(x + size, RandomUtils.perlin(x + size, y, h), y,);
            }
        }

        // itemSize = 3 because there are 3 values (components; xyz) per vertex
        return new BufferAttribute(new Float32Array(vertices), 3);
    }

    static generateGeometry(width: number, height: number, size: number, heightMultiplier?: number): BufferGeometry {
        const geometry = new BufferGeometry();
        const vertices = this.generateVertices(width, height, size, heightMultiplier);

        geometry.setAttribute('position', vertices);
        geometry.computeVertexNormals();

        return geometry;
    }
}