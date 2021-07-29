import { BufferGeometry, BufferAttribute, Color } from "three";

export abstract class GeometryColorizer {
    static triangleTestColors(geometry: BufferGeometry) {
        const count = geometry.attributes.position.count;
        geometry.setAttribute( 'color', new BufferAttribute( new Float32Array( count * 3 ), 3 ) );
        const colors1 = geometry.attributes.color;
        const color = new Color();
        color.g = 1;
        color.b = 0;
        for (let i = 0; i < count; i ++) {
            const isOdd = Math.floor(i / 3) % 2 == 0;
            color.r = isOdd ? 1 : 0;
            colors1.setXYZ( i, color.r, color.g, color.b );
        }

        return geometry;
    }

    static squareTestColors(geometry: BufferGeometry) {
        const count = geometry.attributes.position.count;
        geometry.setAttribute( 'color', new BufferAttribute( new Float32Array( count * 3 ), 3 ) );
        const colors1 = geometry.attributes.color;
        const color = new Color();
        color.g = 0;
        for (let squareIndex = 0; squareIndex < count / 6; squareIndex++) {
            const isEvenSquare = squareIndex % 2;
            color.r = isEvenSquare ? 1 : 0;
            color.b = isEvenSquare ? 0 : 1;
            colors1.setXYZ( squareIndex, color.r, color.g, color.b );
        }

        return geometry;
    }

    static randomSquareColors(geometry: BufferGeometry) {
        const count = geometry.attributes.position.count;
        geometry.setAttribute( 'color', new BufferAttribute( new Float32Array( count * 3 ), 3 ) );
        const colors1 = geometry.attributes.color;
        const color = new Color();
        color.g = 0;
        for (let squareIndex = 0; squareIndex < count / 6; squareIndex++) {
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            for (let vertexIndex = 0; vertexIndex < 6; vertexIndex++) {
                colors1.setXYZ( (squareIndex * 6) + vertexIndex, r, g, b );
            }
        }
    }
}