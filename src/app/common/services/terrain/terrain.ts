import { BufferAttribute, BufferGeometry, Color, Face, Vector2 } from 'three';
import { GeometryColorizer } from './geometry-colorizer';
import { TerrainGenerator } from './terrain-generator';

export class Terrain {
  public HEIGHT: number = 10;
  public WIDTH: number = 10;
  public geometry3d!: BufferGeometry;
  public geometry2d!: BufferGeometry;

  private SIZE: number = 1;

  private _tileAltitudes!: number[];
  private _tileColors!: Color[];
  private _highlightedTiles: { [key: number]: { [key: number]: boolean } } = {};

  private _positionAttribute!: BufferAttribute;
  private _colorAttribute!: BufferAttribute;

  constructor(positionAttribute?: BufferAttribute, colorAttribute?: BufferAttribute) {
    this._tileAltitudes = TerrainGenerator.getRandomAltitudes(this.WIDTH, this.HEIGHT, 2);
    this._tileColors = GeometryColorizer.getSolidSquareColor(this.WIDTH * this.HEIGHT, new Color('gray'));
    this._positionAttribute =
      positionAttribute ??
      TerrainGenerator.generateAltitudeVertices(this._tileAltitudes, this.WIDTH, this.HEIGHT, this.SIZE);
    this._colorAttribute = colorAttribute ?? GeometryColorizer.generateColorAttribute(this._tileColors);

    this.generateGeometries();
  }

  public getFaceXY(face: Face): Vector2 {
    const tileIndex = Math.floor(face.a / 6);
    const x = tileIndex % this.WIDTH;
    const y = Math.floor(tileIndex / this.WIDTH);
    return new Vector2(x, y);
  }

  public highlightTile(x: number, y: number, color: Color) {
    this.validateValidCoordinates(x, y);

    if (this._highlightedTiles[x] && this._highlightedTiles[x][y]) {
      return;
    }

    this.unhighlightTiles();
    this._highlightedTiles[x] = this._highlightedTiles[x] ?? {};
    this._highlightedTiles[x][y] = true;
    this.setTileAttributeColor(x, y, color);
  }

  public unhighlightTiles() {
    Object.entries(this._highlightedTiles).forEach((xValue: [string, { [key: number]: boolean }]) => {
      const x: number = Number.parseInt(xValue[0]);
      Object.entries(xValue[1]).forEach((yValue: [string, boolean]) => {
        const y = Number.parseInt(yValue[0]);
        const tileIndex = y * this.WIDTH + x;
        const vertexIndex = tileIndex * 3 * 2;
        const originalColor = this._tileColors[vertexIndex];
        this.setTileAttributeColor(x, y, originalColor);
      });
    });
    this._highlightedTiles = {};
  }

  public setTileColor(x: number, y: number, color: Color): void {
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

  public setTileAttributeColor(x: number, y: number, color: Color): void {
    this.validateValidCoordinates(x, y);

    const tileIndex = y * this.WIDTH + x;
    const vertexIndex = tileIndex * 3 * 2;

    for (let index = vertexIndex; index < vertexIndex + 6; index++) {
      this._colorAttribute.setXYZ(index, color.r, color.g, color.b);
    }
    this._colorAttribute.needsUpdate = true;
  }

  public getTileColor(x: number, y: number): Color {
    this.validateValidCoordinates(x, y);

    const tileIndex = y * this.WIDTH + x;
    const vertex = tileIndex * 3 * 2;
    return this._tileColors[vertex];
  }

  private validateValidCoordinates(x: number, y: number): void {
    if (x >= this.WIDTH || y >= this.HEIGHT || x < 0 || y < 0) throw new Error('Invalid dimension');
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
    this.geometry2d.attributes.position = TerrainGenerator.flattenVertices(this._positionAttribute);
    this.geometry2d.attributes.color = this._colorAttribute;
    this.geometry3d.attributes.position.needsUpdate = true;
    this.geometry3d.attributes.color.needsUpdate = true;
  }
}
