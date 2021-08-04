import { BufferGeometry, BufferAttribute, Color } from "three";
import { ColorDefinition, ColorDefinitions } from "./color-definition";

export abstract class GeometryColorizer {
    static generateColorAttribute(colors: ColorDefinition[]): BufferAttribute {
        // Each vertex has 3 color values (r, g, b)
        const bufferAttribute = new BufferAttribute( new Float32Array( colors.length * 3 ), 3 );
        colors.forEach((cd, i) => bufferAttribute.setXYZ(i, cd.r, cd.g, cd.b));
        return bufferAttribute;
    }

    static testTriangleColorAttribute(count: number): BufferAttribute {
        const bufferAttribute = new BufferAttribute( new Float32Array( count * 3 ), 3 );
        const color = new Color();
        color.g = 1;
        color.b = 0;
        for (let i = 0; i < count; i ++) {
            const isOdd = Math.floor(i / 3) % 2 == 0;
            color.r = isOdd ? 1 : 0;
            bufferAttribute.setXYZ( i, color.r, color.g, color.b );
        }

        return bufferAttribute;
    }

    static getSolidSquareColor(numberOfSquares: number, color: ColorDefinition): ColorDefinition[] {
        let colors: ColorDefinition[] = [];
        for (let i = 0; i < numberOfSquares; i++) {
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            for (let vertexIndex = 0; vertexIndex < 6; vertexIndex++) {
                colors.push(color);
            }
        }
        return colors;
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