import { BufferAttribute, BufferGeometry, Face, Mesh, Vector2 } from "three";
import { ColorDefinition, ColorDefinitions } from "../color/color-definition";
import { GeometryColorizer } from "../color/geometry-colorizer";
import { TerrainGenerator } from "./terrain-generator";

export class Terrain {
    public HEIGHT: number = 5;
    public WIDTH: number = 5;
    public geometry3d: BufferGeometry;
    public geometry2d: BufferGeometry;

    private SIZE: number = 1;

    private _tileAltitudes: number[];
    private _tileColors: ColorDefinition[];

    private _positionAttribute: BufferAttribute;
    private _colorAttribute: BufferAttribute;

    constructor() {
        this.loadData();
        this.generateAttributes();
        this.generateGeometries();
    }

    public getFaceXY(face: Face): Vector2 {
        const tileIndex = Math.floor(face.a / 6);
        const x = tileIndex % this.WIDTH;
        const y = Math.floor(tileIndex / this.WIDTH);
        return new Vector2(x, y);
    }

    public setTileColor(x: number, y: number, color: ColorDefinition): void {
        this.validateValidCoordinates(x, y);

        const tileIndex = y * this.WIDTH + x;
        const vertexIndex = tileIndex * 3 * 2;

        // Set the data
        this._tileColors[vertexIndex] = color;

        this.setTileAttributeColor(x, y, color);
    }

    public resetTileAttributeColor(x: number, y: number): void {
        this.setTileAttributeColor(x, y, this.getTileColor(x, y));
    }

    public setTileAttributeColor(x: number, y: number, color: ColorDefinition): void {
        this.validateValidCoordinates(x, y);

        const tileIndex = y * this.WIDTH + x;
        const vertexIndex = tileIndex * 3 * 2;

        for(let index = vertexIndex; index < vertexIndex + 6; index++)
        {
            this._colorAttribute.setXYZ(index, color.r, color.g, color.b);
        }
        this._colorAttribute.needsUpdate = true;
    }

    public getTileColor(x: number, y: number): ColorDefinition {
        this.validateValidCoordinates(x, y);

        const tileIndex = y * this.WIDTH + x;
        const vertex = tileIndex * 3 * 2;
        return this._tileColors[vertex];
    }

    private validateValidCoordinates(x: number, y: number): void {
        if (x >= this.WIDTH || y >= this.HEIGHT || x < 0 || y < 0) throw new Error("Invalid dimension");
    }

    private loadData() {
        this._tileAltitudes = TerrainGenerator.getRandomAltitudes(this.WIDTH, this.HEIGHT, 2);
        this._tileColors = GeometryColorizer.getSolidSquareColor(this.WIDTH * this.HEIGHT, ColorDefinitions.GRAY);
    }

    private generateAttributes() {
        this._positionAttribute = TerrainGenerator.generateAltitudeVertices(this._tileAltitudes, this.WIDTH, this.HEIGHT, this.SIZE);
        this._colorAttribute = GeometryColorizer.generateColorAttribute(this._tileColors);
    }

    private generateGeometries() {
        this.geometry3d = new BufferGeometry();
        this.geometry3d.attributes.position = this._positionAttribute;
        this.geometry3d.attributes.color = this._colorAttribute;
        this.geometry3d.computeVertexNormals();
        this.geometry3d.attributes.position.needsUpdate = true;
        this.geometry3d.attributes.color.needsUpdate = true;

        this.geometry2d = new BufferGeometry();
        this.geometry2d.copy(this.geometry3d);
        this.geometry2d.attributes.position = TerrainGenerator.flattenVertices(this._positionAttribute)
        this.geometry2d.attributes.color = this._colorAttribute;
        this.geometry3d.attributes.position.needsUpdate = true;
        this.geometry3d.attributes.color.needsUpdate = true;
    }
}