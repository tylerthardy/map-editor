import { Injectable } from '@angular/core';
import { ChunkService } from '../chunk';
import { Terrain } from './terrain';

@Injectable({
  providedIn: 'root'
})
export class TerrainService {
  public terrain: Terrain;

  constructor(chunkService: ChunkService) {
    this.terrain = chunkService.createRandomizedChunk().terrain;
  }
}
