import { BaseTerrainViewport, BaseTerrainViewportConfig } from "./base-terrain-viewport";

export class Terrain3DViewport extends BaseTerrainViewport {
    constructor(config: Terrain3DViewportConfig) {
        super(config);
        super.init();
    }
}

export interface Terrain3DViewportConfig extends BaseTerrainViewportConfig {}