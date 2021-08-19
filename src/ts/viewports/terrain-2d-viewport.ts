import { BoxGeometry, ConeGeometry, Mesh, MeshBasicMaterial } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BaseTerrainViewport, BaseTerrainViewportConfig } from "./base-terrain-viewport";

export class Terrain2DViewport extends BaseTerrainViewport {
    public orbitControls3D: OrbitControls;
    private orbitControls3DRepresentation: Mesh;
    private target3DRepresentation: Mesh;

    constructor(config: Terrain2DViewportConfig) {
        super(config);
        this.terrainGeometry = config.terrain.geometry2d;
        this.orbitControls3D = config.orbitControls3D;
        this.init();
    }

    init() {
        super.init();

        // 3D Camera
        this.orbitControls3DRepresentation = this.initCamera3DRepresentation();
        this.scene.add(this.orbitControls3DRepresentation);
        this.target3DRepresentation = this.initTarget3DRepresentation();
        this.scene.add(this.target3DRepresentation);

        this.orbitControls.enabled = false;

        this.registerAnimationEvents();
    }

    registerAnimationEvents() {
        this.animationEvents.push((time) => this.updateOrbitControls3DPosition());
        this.animationEvents.push((time) => this.updateTargetPosition());
    }

    initTarget3DRepresentation(): Mesh {
        const geometry = new BoxGeometry(0.25, 0.25, 0.25);
        const material = new MeshBasicMaterial({ color: 0x00ffff });
        const cone = new Mesh(geometry, material);
        return cone;
    }

    initCamera3DRepresentation(): Mesh {
        // TODO: there is an svg loader we can use instead
        // https://threejs.org/docs/#examples/en/loaders/SVGLoader

        const geometry = new ConeGeometry(0.25, 1, 32);
        geometry.rotateX(Math.PI / 2)
        const material = new MeshBasicMaterial({ color: 0xff00ff });
        const cone = new Mesh(geometry, material);
        return cone;
    }

    updateOrbitControls3DPosition() {
        const position = this.orbitControls3D.object.position;
        const target = this.orbitControls3D.target;
        this.orbitControls3DRepresentation.position.set(position.x, position.y, position.z);
        this.orbitControls3DRepresentation.lookAt(target);
    }

    updateTargetPosition() {
        const target = this.orbitControls3D.target;
        this.target3DRepresentation.position.set(target.x, target.y, target.z);
    }
}

export interface Terrain2DViewportConfig extends BaseTerrainViewportConfig {
    orbitControls3D: OrbitControls;
}