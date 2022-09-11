import { Terrain } from './terrain';

export class TerrainService {
  terrain: Terrain;

  constructor() {
    this.init();
  }

  init() {
    this.terrain = new Terrain();
  }
}
export const _terrainService = new TerrainService();
