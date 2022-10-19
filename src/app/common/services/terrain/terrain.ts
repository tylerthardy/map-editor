import { BufferAttribute, BufferGeometry, Color, Face, Vector2, Vector3 } from 'three';
import { ColorUtils } from '../../util/color';
import { Tile } from '../chunk/tile';
import { TileColors } from '../chunk/tile-colors';
import { TileElevations } from '../chunk/tile-elevations';
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
  private tileElevations: TileElevations[] = [];

  constructor(tiles: Tile[], size: number) {
    this.tiles = tiles;
    this.width = size;
    this.height = size;

    const verticesPerTriangle: number = 3;
    const trianglesPerTile: number = 2;
    const vertexCount: number = size * size * verticesPerTriangle * trianglesPerTile * 3;
    this.colorAttribute = new BufferAttribute(new Float32Array(vertexCount), 3);
    this.positionAttribute = new BufferAttribute(new Float32Array(vertexCount), 3);
    this.setAllTilesFromStoredProperties();

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
    this.assertValidCoordinates(x, y);

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
    this.setTileColorAttributeWithTileColors(tileIndex, tintedColors);
  }

  public unhighlightTiles() {
    this.highlightedTiles.forEach((value: boolean, tileIndex: number) => {
      const originalColor = this.tileColors[tileIndex];
      this.setTileColorAttributeWithTileColors(tileIndex, originalColor);
    });
    this.highlightedTiles = [];
  }

  public setTileStoredElevation(
    x: number,
    y: number,
    elevationChange: number,
    modifySurrounding: boolean = true
  ): void {
    this.assertValidCoordinates(x, y);

    const tileIndex: number | null = this.getTileIndex(x, y);
    if (tileIndex === null) {
      throw new Error(`Invalid coordinates for tile ${x},${y}`);
    }

    this.tileElevations[tileIndex].topLeftElevation += elevationChange;
    this.tileElevations[tileIndex].topRightElevation += elevationChange;
    this.tileElevations[tileIndex].bottomLeftElevation += elevationChange;
    this.tileElevations[tileIndex].bottomRightElevation += elevationChange;

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
        this.tileElevations[tl].bottomRightElevation += elevationChange;
        this.setTilePositionAttributeWithTileElevations(tl, this.tileElevations[tl]);
      }
      if (t) {
        this.tileElevations[t].bottomLeftElevation += elevationChange;
        this.tileElevations[t].bottomRightElevation += elevationChange;
        this.setTilePositionAttributeWithTileElevations(t, this.tileElevations[t]);
      }
      if (tr) {
        this.tileElevations[tr].bottomLeftElevation += elevationChange;
        this.setTilePositionAttributeWithTileElevations(tr, this.tileElevations[tr]);
      }

      if (l) {
        this.tileElevations[l].topRightElevation += elevationChange;
        this.tileElevations[l].bottomRightElevation += elevationChange;
        this.setTilePositionAttributeWithTileElevations(l, this.tileElevations[l]);
      }
      if (r) {
        this.tileElevations[r].topLeftElevation += elevationChange;
        this.tileElevations[r].bottomLeftElevation += elevationChange;
        this.setTilePositionAttributeWithTileElevations(r, this.tileElevations[r]);
      }

      if (bl) {
        this.tileElevations[bl].topRightElevation += elevationChange;
        this.setTilePositionAttributeWithTileElevations(bl, this.tileElevations[bl]);
      }
      if (b) {
        this.tileElevations[b].topLeftElevation += elevationChange;
        this.tileElevations[b].topRightElevation += elevationChange;
        this.setTilePositionAttributeWithTileElevations(b, this.tileElevations[b]);
      }
      if (br) {
        this.tileElevations[br].topLeftElevation += elevationChange;
        this.setTilePositionAttributeWithTileElevations(br, this.tileElevations[br]);
      }
    }

    this.setTilePositionAttributeWithTileElevations(tileIndex, this.tileElevations[tileIndex]);
  }

  public setTileStoredColor(x: number, y: number, color: Color, modifySurrounding: boolean = true): void {
    this.assertValidCoordinates(x, y);

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
        this.tileColors[tl].bottomRightColor = color;
        this.setTileColorAttributeWithTileColors(tl, this.tileColors[tl]);
      }
      if (t) {
        this.tileColors[t].bottomLeftColor = color;
        this.tileColors[t].bottomRightColor = color;
        this.setTileColorAttributeWithTileColors(t, this.tileColors[t]);
      }
      if (tr) {
        this.tileColors[tr].bottomLeftColor = color;
        this.setTileColorAttributeWithTileColors(tr, this.tileColors[tr]);
      }

      if (l) {
        this.tileColors[l].topRightColor = color;
        this.tileColors[l].bottomRightColor = color;
        this.setTileColorAttributeWithTileColors(l, this.tileColors[l]);
      }
      if (r) {
        this.tileColors[r].topLeftColor = color;
        this.tileColors[r].bottomLeftColor = color;
        this.setTileColorAttributeWithTileColors(r, this.tileColors[r]);
      }

      if (bl) {
        this.tileColors[bl].topRightColor = color;
        this.setTileColorAttributeWithTileColors(bl, this.tileColors[bl]);
      }
      if (b) {
        this.tileColors[b].topLeftColor = color;
        this.tileColors[b].topRightColor = color;
        this.setTileColorAttributeWithTileColors(b, this.tileColors[b]);
      }
      if (br) {
        this.tileColors[br].topLeftColor = color;
        this.setTileColorAttributeWithTileColors(br, this.tileColors[br]);
      }
    }

    this.setTileColorAttributeWithSingleColor(tileIndex, color);
  }

  private setTilePositionAttributeWithTileElevations(tileIndex: number, elevations: TileElevations): void {
    const x: number = tileIndex % this.width;
    const y: number = Math.floor(tileIndex / this.height);

    const topLeftPosition = new Vector3(x, elevations.topLeftElevation, y);
    const topRightPosition = new Vector3(x + Tile.size, elevations.topRightElevation, y);
    const bottomLeftPosition = new Vector3(x, elevations.bottomLeftElevation, y + Tile.size);
    const bottomRightPosition = new Vector3(x + Tile.size, elevations.bottomRightElevation, y + Tile.size);

    if (topLeftPosition.distanceTo(bottomRightPosition) < bottomLeftPosition.distanceTo(topRightPosition)) {
      // triangle 1
      this.positionAttribute.setXYZ(tileIndex * 6 + 0, ...topLeftPosition.toArray());
      this.positionAttribute.setXYZ(tileIndex * 6 + 1, ...bottomLeftPosition.toArray());
      this.positionAttribute.setXYZ(tileIndex * 6 + 2, ...bottomRightPosition.toArray());

      // triangle 2
      this.positionAttribute.setXYZ(tileIndex * 6 + 3, ...topLeftPosition.toArray());
      this.positionAttribute.setXYZ(tileIndex * 6 + 4, ...bottomRightPosition.toArray());
      this.positionAttribute.setXYZ(tileIndex * 6 + 5, ...topRightPosition.toArray());
    } else {
      // triangle 1
      this.positionAttribute.setXYZ(tileIndex * 6 + 0, ...topLeftPosition.toArray());
      this.positionAttribute.setXYZ(tileIndex * 6 + 1, ...bottomLeftPosition.toArray());
      this.positionAttribute.setXYZ(tileIndex * 6 + 2, ...topRightPosition.toArray());

      // triangle 2
      this.positionAttribute.setXYZ(tileIndex * 6 + 3, ...bottomLeftPosition.toArray());
      this.positionAttribute.setXYZ(tileIndex * 6 + 4, ...bottomRightPosition.toArray());
      this.positionAttribute.setXYZ(tileIndex * 6 + 5, ...topRightPosition.toArray());
    }

    this.positionAttribute.needsUpdate = true;
  }

  private setTileColorAttributeWithTileColors(tileIndex: number, colors: TileColors): void {
    // TODO: Cleanup this duplicated mess
    const tile: Tile = this.tiles[tileIndex];
    const x: number = tileIndex % this.width;
    const y: number = Math.floor(tileIndex / this.height);

    const elevations: TileElevations = this.tileElevations[tileIndex];
    const topLeftPosition = new Vector3(x, elevations.topLeftElevation, y);
    const topRightPosition = new Vector3(x + Tile.size, elevations.topRightElevation, y);
    const bottomLeftPosition = new Vector3(x, elevations.bottomLeftElevation, y + Tile.size);
    const bottomRightPosition = new Vector3(x + Tile.size, elevations.bottomRightElevation, y + Tile.size);

    const { topLeftColor, topRightColor, bottomLeftColor, bottomRightColor }: TileColors = colors;

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

  private setTileColorAttributeWithSingleColor(tileIndex: number, color: Color): void {
    const vertexIndex = tileIndex * 3 * 2;

    for (let index = vertexIndex; index < vertexIndex + 6; index++) {
      this.colorAttribute.setXYZ(index, color.r, color.g, color.b);
    }
    this.colorAttribute.needsUpdate = true;
  }

  private setAllTilesFromStoredProperties(): void {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        this.setTileFromStoredProperties(x, y);
      }
    }
  }

  private setTileFromStoredProperties(x: number, y: number) {
    const tileIndex: number | null = this.getTileIndex(x, y);
    if (tileIndex === null) {
      throw new Error(`invalid tile index: ${x},${y}`);
    }

    const tile: Tile = this.tiles[tileIndex];

    let nextXTile: Tile = x + 1 >= this.width ? tile : this.tiles[tileIndex + 1];
    let nextYTile: Tile = y + 1 >= this.height ? tile : this.tiles[tileIndex + this.width];
    // FIXME: Use proper logic for diagonals
    let nextXYTile: Tile = x + 1 >= this.width || y + 1 >= this.height ? tile : this.tiles[tileIndex + this.width + 1];

    const colors: TileColors = {
      topLeftColor: tile.topLeftCornerColor,
      topRightColor: nextXTile.topLeftCornerColor,
      bottomLeftColor: nextYTile.topLeftCornerColor,
      bottomRightColor: nextXYTile.topLeftCornerColor
    };
    this.tileColors[tileIndex] = colors;

    const elevations: TileElevations = {
      topLeftElevation: tile.topLeftCornerElevation,
      topRightElevation: nextXTile.topLeftCornerElevation,
      bottomLeftElevation: nextYTile.topLeftCornerElevation,
      bottomRightElevation: nextXYTile.topLeftCornerElevation
    };
    this.tileElevations[tileIndex] = elevations;

    const { topLeftColor, topRightColor, bottomLeftColor, bottomRightColor }: TileColors = colors;
    const topLeftPosition = new Vector3(x, elevations.topLeftElevation, y);
    const topRightPosition = new Vector3(x + Tile.size, elevations.topRightElevation, y);
    const bottomLeftPosition = new Vector3(x, elevations.bottomLeftElevation, y + Tile.size);
    const bottomRightPosition = new Vector3(x + Tile.size, elevations.bottomRightElevation, y + Tile.size);

    if (topLeftPosition.distanceTo(bottomRightPosition) < bottomLeftPosition.distanceTo(topRightPosition)) {
      // triangle 1
      this.colorAttribute.setXYZ(tileIndex * 6 + 0, topLeftColor.r, topLeftColor.g, topLeftColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 0, ...topLeftPosition.toArray());
      this.colorAttribute.setXYZ(tileIndex * 6 + 1, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 1, ...bottomLeftPosition.toArray());
      this.colorAttribute.setXYZ(tileIndex * 6 + 2, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 2, ...bottomRightPosition.toArray());

      // triangle 2
      this.colorAttribute.setXYZ(tileIndex * 6 + 3, topLeftColor.r, topLeftColor.g, topLeftColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 3, ...topLeftPosition.toArray());
      this.colorAttribute.setXYZ(tileIndex * 6 + 4, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 4, ...bottomRightPosition.toArray());
      this.colorAttribute.setXYZ(tileIndex * 6 + 5, topRightColor.r, topRightColor.g, topRightColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 5, ...topRightPosition.toArray());
    } else {
      // triangle 1
      this.colorAttribute.setXYZ(tileIndex * 6 + 0, topLeftColor.r, topLeftColor.g, topLeftColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 0, ...topLeftPosition.toArray());
      this.colorAttribute.setXYZ(tileIndex * 6 + 1, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 1, ...bottomLeftPosition.toArray());
      this.colorAttribute.setXYZ(tileIndex * 6 + 2, topRightColor.r, topRightColor.g, topRightColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 2, ...topRightPosition.toArray());

      // triangle 2
      this.colorAttribute.setXYZ(tileIndex * 6 + 3, bottomLeftColor.r, bottomLeftColor.g, bottomLeftColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 3, ...bottomLeftPosition.toArray());
      this.colorAttribute.setXYZ(tileIndex * 6 + 4, bottomRightColor.r, bottomRightColor.g, bottomRightColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 4, ...bottomRightPosition.toArray());
      this.colorAttribute.setXYZ(tileIndex * 6 + 5, topRightColor.r, topRightColor.g, topRightColor.b);
      this.positionAttribute.setXYZ(tileIndex * 6 + 5, ...topRightPosition.toArray());
    }

    this.colorAttribute.needsUpdate = true;
    this.positionAttribute.needsUpdate = true;
  }

  private assertValidCoordinates(x: number, y: number): void {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) throw new Error('Invalid dimension');
  }

  private getTileIndex(x: number, y: number): number | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      console.log(`invalid tile index returned ${x} ${y} ${this.width} ${this.height}`);
      return null;
    }
    return y * this.width + x;
  }
}
