import { Terrain } from '../terrain';
import { Tile } from './tile';

export class Chunk {
  static size: number = 50;

  public terrain: Terrain;
  private tiles: Tile[];

  constructor(tiles: Tile[]) {
    this.tiles = tiles;
    this.terrain = new Terrain(this.tiles, Chunk.size);
  }
}
