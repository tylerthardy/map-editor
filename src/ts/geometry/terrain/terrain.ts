import { BufferAttribute, BufferGeometry, Mesh } from "three";
import { ColorDefinition, ColorDefinitions } from "../color/color-definition";
import { GeometryColorizer } from "../geometry-colorizer";
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

    public getTileColor(x: number, y: number): ColorDefinition {
        if (x >= this.WIDTH || y >= this.HEIGHT || x < 0 || y < 0) throw new Error("Invalid dimension");

        const tile = y * x + x;
        const vertex = tile * 3 * 2;
        return this._tileColors[vertex];
    }

    private loadData() {
        this._tileAltitudes = TerrainGenerator.getRandomAltitudes(this.WIDTH, this.HEIGHT, 2);
        this._tileColors = GeometryColorizer.getRandomSquareColors(this.WIDTH * this.HEIGHT);
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