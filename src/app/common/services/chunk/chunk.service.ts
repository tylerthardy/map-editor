import { Injectable } from '@angular/core';
import { Chunk } from './chunk';
import { Tile } from './tile';

@Injectable({
  providedIn: 'root'
})
export class ChunkService {
  constructor() {}

  createRandomizedChunk(): Chunk {
    const tiles: Tile[] = this.generateTiles();
    const chunk: Chunk = new Chunk(tiles);
    return chunk;
  }

  private generateTiles(): Tile[] {
    const tiles: Tile[] = [];

    for (let y = 0; y < Chunk.size; y++) {
      for (let x = 0; x < Chunk.size; x++) {
        const tileIndex: number = y * Chunk.size + x;
        const tile: Tile = new Tile();
        tiles[tileIndex] = tile;
      }
    }
    return tiles;
  }
}
