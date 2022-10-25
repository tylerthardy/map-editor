import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Chunk } from './chunk';
import { Tile } from './tile';

@Injectable({
  providedIn: 'root'
})
export class ChunkService {
  public loadedChunk: Chunk = ChunkService.createRandomizedChunk();
  public $chunkUpdated: Subject<Chunk> = new Subject();

  constructor() {}

  public setChunk(chunk: Chunk): void {
    this.loadedChunk = chunk;
    this.$chunkUpdated.next(this.loadedChunk);
  }

  public static createRandomizedChunk(): Chunk {
    const tiles: Tile[] = this.generateTiles();
    const chunk: Chunk = new Chunk(tiles);
    return chunk;
  }

  private static generateTiles(): Tile[] {
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
