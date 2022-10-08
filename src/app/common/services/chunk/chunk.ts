import { BufferAttribute, Vector3 } from 'three';
import { Terrain } from '../terrain';
import { Tile } from './tile';

export class Chunk {
  static size: number = 10;

  public terrain: Terrain;
  private tiles: Tile[];

  constructor(tiles: Tile[]) {
    this.tiles = tiles;
    this.terrain = this.generateTerrain();
  }

  private generateTerrain(): Terrain {
    const verticesPerTriangle: number = 3;
    const trianglesPerTile: number = 2;
    const vertexCount: number = Chunk.size * Chunk.size * verticesPerTriangle * trianglesPerTile * 3;
    const colorAttribute = new BufferAttribute(new Float32Array(vertexCount), 3);
    const positionAttribute = new BufferAttribute(new Float32Array(vertexCount), 3);

    for (var y = 0; y < Chunk.size; y++) {
      for (var x = 0; x < Chunk.size; x++) {
        const tileIndex = y * Chunk.size + x;
        const tile: Tile = this.tiles[tileIndex];

        let nextXTile: Tile = x + 1 >= Chunk.size ? tile : this.tiles[tileIndex + 1];
        let nextYTile: Tile = y + 1 >= Chunk.size ? tile : this.tiles[tileIndex + Chunk.size];
        // FIXME: Use proper logic for diagonals
        let nextXYTile: Tile =
          x + 1 >= Chunk.size || y + 1 >= Chunk.size ? tile : this.tiles[tileIndex + Chunk.size + 1];

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

    return new Terrain(positionAttribute, colorAttribute);
  }
}
