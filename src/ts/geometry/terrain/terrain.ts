import { BufferAttribute, BufferGeometry, Mesh } from "three";
import { ColorDefinitions } from "../color/color-definition";
import { GeometryColorizer } from "../geometry-colorizer";
import { TerrainGenerator } from "./terrain-generator";

export class Terrain {
    private SIZE: number = 64
    private WIDTH: number = this.SIZE;
    private HEIGHT: number = this.SIZE;

    public geometry3d: BufferGeometry;
    public geometry2d: BufferGeometry;

    private _vertices: BufferAttribute;
    private _color: BufferAttribute;

    constructor() {
        this.loadAttributes();
        this.generateGeometries();
    }

    private loadAttributes() {
        this._vertices = TerrainGenerator.generateVertices(this.WIDTH, this.HEIGHT, 1, 200);
        const colors = GeometryColorizer.getSolidSquareColor(this.WIDTH * this.HEIGHT, ColorDefinitions.GRAY);
        const vertexPositionCount = this._vertices.array.length;
        this._color = GeometryColorizer.generateColorAttribute(vertexPositionCount, colors);
    }

    private generateGeometries() {
        this.geometry3d = new BufferGeometry();
        this.geometry3d.attributes.position = this._vertices;
        this.geometry3d.attributes.color = this._color;
        this.geometry3d.computeVertexNormals();
        this.geometry3d.attributes.position.needsUpdate = true;
        this.geometry3d.attributes.color.needsUpdate = true;

        this.geometry2d = new BufferGeometry();
        this.geometry2d.copy(this.geometry3d);
        this.geometry2d.attributes.position = TerrainGenerator.flattenVertices(this._vertices)
        this.geometry2d.attributes.color = this._color;
        this.geometry3d.attributes.position.needsUpdate = true;
        this.geometry3d.attributes.color.needsUpdate = true;
    }
}