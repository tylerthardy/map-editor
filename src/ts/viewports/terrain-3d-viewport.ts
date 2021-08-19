import { BaseTerrainViewport, BaseTerrainViewportConfig } from "./base-terrain-viewport";

export class Terrain3DViewport extends BaseTerrainViewport {
    constructor(config: Terrain3DViewportConfig) {
        super(config);
        this.terrainGeometry = config.terrain.geometry3d;
        super.init();
    }
}

export interface Terrain3DViewportConfig extends BaseTerrainViewportConfig {}