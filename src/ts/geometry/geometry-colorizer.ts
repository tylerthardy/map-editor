import { BufferGeometry, BufferAttribute, Color } from "three";
import { ColorDefinition, ColorDefinitions } from "./color/color-definition";

export abstract class GeometryColorizer {
    static testTriangleColors(geometry: BufferGeometry) {
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

    static testSquareColors(geometry: BufferGeometry): BufferGeometry {
        const count = geometry.attributes.position.count;
        geometry.setAttribute( 'color', new BufferAttribute( new Float32Array( count * 3 ), 3 ) );
        const colors1 = geometry.attributes.color;
        this.getTestSquareColors(count).forEach((cd, i) => colors1.setXYZ(i, cd.r, cd.g, cd.b));

        return geometry;
    }

    static randomSquareColors(geometry: BufferGeometry): BufferGeometry {
        const count = geometry.attributes.position.count;
        geometry.setAttribute( 'color', new BufferAttribute( new Float32Array( count * 3 ), 3 ) );
        const colors1 = geometry.attributes.color;
        this.getRandomSquareColors(count).forEach((cd, i) => colors1.setXYZ(i, cd.r, cd.g, cd.b));

        return geometry;
    }

    static getRandomSquareColors(numberOfSquares: number): ColorDefinition[] {
        let colors: ColorDefinition[] = [];
        for (let i = 0; i < numberOfSquares; i++) {
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            for (let vertexIndex = 0; vertexIndex < 6; vertexIndex++) {
                colors.push(new ColorDefinition(r, g, b));
            }
        }
        return colors;
    }

    static getTestSquareColors(numberOfSquares: number): ColorDefinition[] {
        let colors: ColorDefinition[] = [];
        for (let i = 0; i < numberOfSquares; i++) {
            const colorDefintion = i % 2 ? ColorDefinitions.RED : ColorDefinitions.BLUE;
            for (let vertexIndex = 0; vertexIndex < 6; vertexIndex++) {
                colors.push(colorDefintion);
            }
        }
        return colors;
    }
}