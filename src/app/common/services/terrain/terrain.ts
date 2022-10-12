import { BufferAttribute, BufferGeometry, Color, Face, Vector2, Vector3 } from 'three';
import { ColorUtils } from '../../util/color';
import { Tile } from '../chunk/tile';
import { TileColors } from '../chunk/tile-colors';
import { TerrainGenerator } from './terrain-generator';

export class Terrain {
  public geometry3d!: BufferGeometry;
  public geometry2d!: BufferGeometry;
  public width: number;
  public height: number;

  private highlightedTiles: boolean[] = [];

  private positionAttribute!: BufferAttribute;
  private colorAttribute!: BufferAttribute;
  private tiles: Tile[];
  private tileColors: TileColors[] = [];

  constructor(tiles: Tile[], size: number) {
    this.tiles = tiles;
    this.width = size;
    this.height = size;

    const attributes: {
      colorAttribute: BufferAttribute;
      positionAttribute: BufferAttribute;
      tileColors: TileColors[];
    } = Terrain.setAttributesFromTiles(tiles, size);
    this.tileColors = attributes.tileColors;
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
    this.geometry2d.attributes.position.needsUpdate = true;
    this.geometry2d.attributes.color.needsUpdate = true;
  }

  public getFaceXY(face: Face): Vector2 {
    const tileIndex = Math.floor(face.a / 6);
    const x: number = tileIndex % this.width;
    const y: number = Math.floor(tileIndex / this.height);
    return new Vector2(x, y);
  }

  public highlightTile(x: number, y: number, highlightColor: Color) {
    this.validateValidCoordinates(x, y);

    if (this.highlightedTiles[x] && this.highlightedTiles[x][y]) {
      return;
    }

    this.unhighlightTiles();
    const tileIndex: number | null = this.getTileIndex(x, y);
    if (tileIndex === null) {
      throw new Error(`Invalid coordinates for tile ${x},${y}`);
    }
    this.highlightedTiles[tileIndex] = true;
    const tileColors: TileColors = this.tileColors[tileIndex];
    const tintedColors: TileColors = ColorUtils.tintTileColors(tileColors, highlightColor, 0.6);
    this.setTileColorAttributeWithTileColors(x, y, tintedColors);
  }

  public unhighlightTiles() {
    this.highlightedTiles.forEach((value: boolean, tileIndex: number) => {
      const originalColor = this.tileColors[tileIndex];
      const x: number = tileIndex % this.width;
      const y: number = Math.floor(tileIndex / this.height);
      this.setTileColorAttributeWithTileColors(x, y, originalColor);
    });
    this.highlightedTiles = [];
  }

  public setTileColor(x: number, y: number, color: Color, modifySurrounding: boolean = true): void {
    this.validateValidCoordinates(x, y);

    const tileIndex: number | null = this.getTileIndex(x, y);
    if (tileIndex === null) {
      throw new Error(`Invalid coordinates for tile ${x},${y}`);
    }

    // Set the data
    this.tileColors[tileIndex] = {
      bottomLeftColor: color,
      bottomRightColor: color,
      topLeftColor: color,
      topRightColor: color
    };

    if (modifySurrounding) {
      const tl: number | null = this.getTileIndex(x - 1, y - 1);
      const t: number | null = this.getTileIndex(x, y - 1);
      const tr: number | null = this.getTileIndex(x + 1, y - 1);
      const l: number | null = this.getTileIndex(x - 1, y);
      const r: number | null = this.getTileIndex(x + 1, y);
      const bl: number | null = this.getTileIndex(x - 1, y + 1);
      const b: number | null = this.getTileIndex(x, y + 1);
      const br: number | null = this.getTileIndex(x + 1, y + 1);

      if (tl) {
        console.log(x, y);
        console.log(tl);
        if (!this.tileColors[tl]) debugger;
        this.tileColors[tl].bottomRightColor = color;
        this.updateAttributeFromTileColors(tl);
      }
      if (t) {
        this.tileColors[t].bottomLeftColor = color;
        this.tileColors[t].bottomRightColor = color;
        this.updateAttributeFromTileColors(t);
      }
      if (tr) {
        this.tileColors[tr].bottomLeftColor = color;
        this.updateAttributeFromTileColors(tr);
      }

      if (l) {
        this.tileColors[l].topRightColor = color;
        this.tileColors[l].bottomRightColor = color;
        this.updateAttributeFromTileColors(l);
      }
      if (r) {
        this.tileColors[r].topLeftColor = color;
        this.tileColors[r].bottomLeftColor = color;
        this.updateAttributeFromTileColors(r);
      }

      if (bl) {
        this.tileColors[bl].topRightColor = color;
        this.updateAttributeFromTileColors(bl);
      }
      if (b) {
        this.tileColors[b].topLeftColor = color;
        this.tileColors[b].topRightColor = color;
        this.updateAttributeFromTileColors(b);
      }
      if (br) {
        this.tileColors[br].topLeftColor = color;
        this.updateAttributeFromTileColors(br);
      }
    }

    this.setTileColorAttributeWithSingleColor(x, y, color);
  }

  public setTileColorAttributeWithTileColors(x: number, y: number, colors: TileColors): void {
    // TODO: Cleanup this duplicated mess
    this.validateValidCoordinates(x, y);

    const tileIndex = this.getTileIndex(x, y);
    if (tileIndex === null) {
      throw new Error(`Invalid coordinates for tile ${x},${y}`);
    }
    const tile: Tile = this.tiles[tileIndex];

    const { topLeftColor, topRightColor, bottomLeftColor, bottomRightColor }: TileColors = colors;

    const topLeftPosition = new Vector3(x, tile.cornerElevations[0], y);
    const topRightPosition = new Vector3(x + Tile.size, tile.cornerElevations[1], y);
    const bottomLeftPosition = new Vector3(x, tile.cornerElevations[2], y + Tile.size);
    const bottomRightPosition = new Vector3(x + Tile.size, tile.cornerElevations[3], y + Tile.size);

    if (topLeftPosition.distanceTo(bottomRightPosition) < bottomLeftPosition.distanceTo(topRightPosition)) {
      // triangle 1
      this.colorAttribute.setXYZ(tileIndex * 6 + 0, topLeftColor.r, topLeftColor.g, topLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 1, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 2, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);

      // triangle 2
      this.colorAttribute.setXYZ(tileIndex * 6 + 3, topLeftColor.r, topLeftColor.g, topLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 4, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 5, topRightColor.r, topRightColor.g, topRightColor.b);
    } else {
      // triangle 1
      this.colorAttribute.setXYZ(tileIndex * 6 + 0, topLeftColor.r, topLeftColor.g, topLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 1, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 2, topRightColor.r, topRightColor.g, topRightColor.b);

      // triangle 2
      this.colorAttribute.setXYZ(tileIndex * 6 + 3, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 4, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 5, topRightColor.r, topRightColor.g, topRightColor.b);
    }
    this.colorAttribute.needsUpdate = true;
  }

  public setTileColorAttributeWithSingleColor(x: number, y: number, color: Color): void {
    this.validateValidCoordinates(x, y);

    const tileIndex = this.getTileIndex(x, y);
    if (tileIndex === null) {
      throw new Error(`Invalid coordinates for tile ${x},${y}`);
    }
    const vertexIndex = tileIndex * 3 * 2;

    for (let index = vertexIndex; index < vertexIndex + 6; index++) {
      this.colorAttribute.setXYZ(index, color.r, color.g, color.b);
    }
    this.colorAttribute.needsUpdate = true;
  }

  // TODO: Reduce duplicate code by using this method where applicable
  private updateAttributeFromTileColors(tileIndex: number): void {
    const tile: Tile = this.tiles[tileIndex];
    const x: number = tileIndex % this.width;
    const y: number = Math.floor(tileIndex / this.height);

    this.validateValidCoordinates(x, y);

    const topLeftPosition = new Vector3(x, tile.cornerElevations[0], y);
    const topRightPosition = new Vector3(x + Tile.size, tile.cornerElevations[1], y);
    const bottomLeftPosition = new Vector3(x, tile.cornerElevations[2], y + Tile.size);
    const bottomRightPosition = new Vector3(x + Tile.size, tile.cornerElevations[3], y + Tile.size);

    const { topLeftColor, topRightColor, bottomLeftColor, bottomRightColor }: TileColors = this.tileColors[tileIndex];

    if (topLeftPosition.distanceTo(bottomRightPosition) < bottomLeftPosition.distanceTo(topRightPosition)) {
      // triangle 1
      this.colorAttribute.setXYZ(tileIndex * 6 + 0, topLeftColor.r, topLeftColor.g, topLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 1, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 2, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);

      // triangle 2
      this.colorAttribute.setXYZ(tileIndex * 6 + 3, topLeftColor.r, topLeftColor.g, topLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 4, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 5, topRightColor.r, topRightColor.g, topRightColor.b);
    } else {
      // triangle 1
      this.colorAttribute.setXYZ(tileIndex * 6 + 0, topLeftColor.r, topLeftColor.g, topLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 1, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 2, topRightColor.r, topRightColor.g, topRightColor.b);

      // triangle 2
      this.colorAttribute.setXYZ(tileIndex * 6 + 3, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 4, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
      this.colorAttribute.setXYZ(tileIndex * 6 + 5, topRightColor.r, topRightColor.g, topRightColor.b);
    }

    this.colorAttribute.needsUpdate = true;
  }

  private getTileIndex(x: number, y: number): number | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return y * this.width + x;
  }

  private static setAttributesFromTiles(
    tiles: Tile[],
    size: number
  ): { colorAttribute: BufferAttribute; positionAttribute: BufferAttribute; tileColors: TileColors[] } {
    const verticesPerTriangle: number = 3;
    const trianglesPerTile: number = 2;
    const vertexCount: number = size * size * verticesPerTriangle * trianglesPerTile * 3;
    const colorAttribute = new BufferAttribute(new Float32Array(vertexCount), 3);
    const positionAttribute = new BufferAttribute(new Float32Array(vertexCount), 3);
    const tileColors: TileColors[] = [];

    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        const tileIndex: number = y * size + x;
        const tile: Tile = tiles[tileIndex];

        let nextXTile: Tile = x + 1 >= size ? tile : tiles[tileIndex + 1];
        let nextYTile: Tile = y + 1 >= size ? tile : tiles[tileIndex + size];
        // FIXME: Use proper logic for diagonals
        let nextXYTile: Tile = x + 1 >= size || y + 1 >= size ? tile : tiles[tileIndex + size + 1];

        const colors: TileColors = {
          topLeftColor: tile.topLeftCornerColor,
          topRightColor: nextXTile.topLeftCornerColor,
          bottomLeftColor: nextYTile.topLeftCornerColor,
          bottomRightColor: nextXYTile.topLeftCornerColor
        };
        const { topLeftColor, topRightColor, bottomLeftColor, bottomRightColor }: TileColors = colors;
        tileColors[tileIndex] = colors;

        const topLeftPosition = new Vector3(x, tile.cornerElevations[0], y);
        const topRightPosition = new Vector3(x + Tile.size, tile.cornerElevations[1], y);
        const bottomLeftPosition = new Vector3(x, tile.cornerElevations[2], y + Tile.size);
        const bottomRightPosition = new Vector3(x + Tile.size, tile.cornerElevations[3], y + Tile.size);

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
      positionAttribute,
      tileColors
    };
  }

  private validateValidCoordinates(x: number, y: number): void {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) throw new Error('Invalid dimension');
  }
}
