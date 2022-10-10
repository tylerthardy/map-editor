import { BufferAttribute, BufferGeometry, Color, Face, Vector2, Vector3 } from 'three';
import { Tile } from '../chunk/tile';
import { GeometryColorizer } from './geometry-colorizer';
import { TerrainGenerator } from './terrain-generator';

export class Terrain {
  public geometry3d!: BufferGeometry;
  public geometry2d!: BufferGeometry;

  private tileColors!: Color[];
  private highlightedTiles: { [key: number]: { [key: number]: boolean } } = {};

  private positionAttribute!: BufferAttribute;
  private colorAttribute!: BufferAttribute;
  private width: number;
  private height: number;

  constructor(tiles: Tile[], size: number) {
    this.width = size;
    this.height = size;

    const attributes: { colorAttribute: BufferAttribute; positionAttribute: BufferAttribute } =
      Terrain.generateAttributesFromTiles(tiles, size);
    this.tileColors = GeometryColorizer.getSolidSquareColor(this.width * this.height, new Color('gray'));
    this.positionAttribute = attributes.positionAttribute;
    this.colorAttribute = attributes.colorAttribute;

    this.geometry3d = new BufferGeometry();
    this.geometry3d.attributes.position = this.positionAttribute;
    this.geometry3d.attributes.color = this.colorAttribute;
    this.geometry3d.computeVertexNormals();
    this.geometry3d.attributes.position.needsUpdate = true;
    this.geometry3d.attributes.color.needsUpdate = true;

    this.geometry2d = new BufferGeometry();
    this.geometry2d.copy(this.geometry3d);
    this.geometry2d.attributes.position = TerrainGenerator.flattenVertices(this.positionAttribute);
    this.geometry2d.attributes.color = this.colorAttribute;
    this.geometry3d.attributes.position.needsUpdate = true;
    this.geometry3d.attributes.color.needsUpdate = true;
  }

  public getFaceXY(face: Face): Vector2 {
    const tileIndex = Math.floor(face.a / 6);
    const x = tileIndex % this.width;
    const y = Math.floor(tileIndex / this.width);
    return new Vector2(x, y);
  }

  public highlightTile(x: number, y: number, color: Color) {
    this.validateValidCoordinates(x, y);

    if (this.highlightedTiles[x] && this.highlightedTiles[x][y]) {
      return;
    }

    this.unhighlightTiles();
    this.highlightedTiles[x] = this.highlightedTiles[x] ?? {};
    this.highlightedTiles[x][y] = true;
    this.setTileAttributeColor(x, y, color);
  }

  public unhighlightTiles() {
    Object.entries(this.highlightedTiles).forEach((xValue: [string, { [key: number]: boolean }]) => {
      const x: number = Number.parseInt(xValue[0]);
      Object.entries(xValue[1]).forEach((yValue: [string, boolean]) => {
        const y = Number.parseInt(yValue[0]);
        const tileIndex = y * this.width + x;
        const vertexIndex = tileIndex * 3 * 2;
        const originalColor = this.tileColors[vertexIndex];
        this.setTileAttributeColor(x, y, originalColor);
      });
    });
    this.highlightedTiles = {};
  }

  public setTileColor(x: number, y: number, color: Color): void {
    this.validateValidCoordinates(x, y);

    const tileIndex = y * this.width + x;
    const vertexIndex = tileIndex * 3 * 2;

    // Set the data
    this.tileColors[vertexIndex] = color;

    this.setTileAttributeColor(x, y, color);
  }

  public resetTileAttributeColor(x: number, y: number): void {
    this.setTileAttributeColor(x, y, this.getTileColor(x, y));
  }

  public setTileAttributeColor(x: number, y: number, color: Color): void {
    this.validateValidCoordinates(x, y);

    const tileIndex = y * this.width + x;
    const vertexIndex = tileIndex * 3 * 2;

    for (let index = vertexIndex; index < vertexIndex + 6; index++) {
      this.colorAttribute.setXYZ(index, color.r, color.g, color.b);
    }
    this.colorAttribute.needsUpdate = true;
  }

  public getTileColor(x: number, y: number): Color {
    this.validateValidCoordinates(x, y);

    const tileIndex = y * this.width + x;
    const vertex = tileIndex * 3 * 2;
    return this.tileColors[vertex];
  }

  private static generateAttributesFromTiles(
    tiles: Tile[],
    size: number
  ): { colorAttribute: BufferAttribute; positionAttribute: BufferAttribute } {
    const verticesPerTriangle: number = 3;
    const trianglesPerTile: number = 2;
    const vertexCount: number = size * size * verticesPerTriangle * trianglesPerTile * 3;
    const colorAttribute = new BufferAttribute(new Float32Array(vertexCount), 3);
    const positionAttribute = new BufferAttribute(new Float32Array(vertexCount), 3);

    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        const tileIndex = y * size + x;
        const tile: Tile = tiles[tileIndex];

        let nextXTile: Tile = x + 1 >= size ? tile : tiles[tileIndex + 1];
        let nextYTile: Tile = y + 1 >= size ? tile : tiles[tileIndex + size];
        // FIXME: Use proper logic for diagonals
        let nextXYTile: Tile = x + 1 >= size || y + 1 >= size ? tile : tiles[tileIndex + size + 1];

        const topLeftPosition = new Vector3(x, tile.cornerElevations[0], y);
        const topLeftColor = tile.topLeftCornerColor;

        const topRightPosition = new Vector3(x + Tile.size, tile.cornerElevations[1], y);
        const topRightColor = nextXTile.topLeftCornerColor;

        const bottomLeftPosition = new Vector3(x, tile.cornerElevations[2], y + Tile.size);
        const bottomLeftColor = nextYTile.topLeftCornerColor;

        const bottomRightPosition = new Vector3(x + Tile.size, tile.cornerElevations[3], y + Tile.size);
        const bottomRightColor = nextXYTile.topLeftCornerColor;

        if (topLeftPosition.distanceTo(bottomRightPosition) < bottomLeftPosition.distanceTo(topRightPosition)) {
          // triangle 1
          colorAttribute.setXYZ(tileIndex * 6 + 0, topLeftColor.r, topLeftColor.g, topLeftColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 0, ...topLeftPosition.toArray());
          colorAttribute.setXYZ(tileIndex * 6 + 1, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 1, ...bottomLeftPosition.toArray());
          colorAttribute.setXYZ(tileIndex * 6 + 2, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 2, ...bottomRightPosition.toArray());

          // triangle 2
          colorAttribute.setXYZ(tileIndex * 6 + 3, topLeftColor.r, topLeftColor.g, topLeftColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 3, ...topLeftPosition.toArray());
          colorAttribute.setXYZ(tileIndex * 6 + 4, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 4, ...bottomRightPosition.toArray());
          colorAttribute.setXYZ(tileIndex * 6 + 5, topRightColor.r, topRightColor.g, topRightColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 5, ...topRightPosition.toArray());
        } else {
          // triangle 1
          colorAttribute.setXYZ(tileIndex * 6 + 0, topLeftColor.r, topLeftColor.g, topLeftColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 0, ...topLeftPosition.toArray());
          colorAttribute.setXYZ(tileIndex * 6 + 1, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 1, ...bottomLeftPosition.toArray());
          colorAttribute.setXYZ(tileIndex * 6 + 2, topRightColor.r, topRightColor.g, topRightColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 2, ...topRightPosition.toArray());

          // triangle 2
          colorAttribute.setXYZ(tileIndex * 6 + 3, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 3, ...bottomLeftPosition.toArray());
          colorAttribute.setXYZ(tileIndex * 6 + 4, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 4, ...bottomRightPosition.toArray());
          colorAttribute.setXYZ(tileIndex * 6 + 5, topRightColor.r, topRightColor.g, topRightColor.b);
          positionAttribute.setXYZ(tileIndex * 6 + 5, ...topRightPosition.toArray());
        }
      }
    }

    return {
      colorAttribute,
      positionAttribute
    };
  }

  private validateValidCoordinates(x: number, y: number): void {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) throw new Error('Invalid dimension');
  }
}
