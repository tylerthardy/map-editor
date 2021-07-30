import { BufferGeometry } from "three";
import { TerrainGenerator, GeometryColorizer } from ".";
import { ColorDefinitions } from "./color/color-definition";

export class TerrainService {
    terrain3dGeometry: BufferGeometry;
    terrain2dGeometry: BufferGeometry;

    constructor() {
        this.init();
    }

    init() {
        this.terrain3dGeometry = TerrainGenerator.generateGeometry(64, 64, 1, 200);
        this.terrain2dGeometry = TerrainGenerator.flattenGeometry(this.terrain3dGeometry);

        const colors = GeometryColorizer.getSolidSquareColor(64 * 64, ColorDefinitions.GRAY);
        const vertexPositionCount = this.terrain3dGeometry.attributes.position.count;
        const colorAttribute = GeometryColorizer.generateColorAttribute(vertexPositionCount, colors);
        this.terrain2dGeometry.attributes.color = colorAttribute;
        this.terrain3dGeometry.attributes.color = colorAttribute;
    }
}
export const _terrainService = new TerrainService();