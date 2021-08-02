import { AxesHelper, BufferGeometry, Face, Material, Mesh, PerspectiveCamera, PointLight, PointLightHelper, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import { ColorDefinition, ColorDefinitions } from "../geometry/color/color-definition";
import { Terrain } from "../geometry/terrain/terrain";
import { _terrainService } from "../geometry/terrain/terrain.service";
import { _keyService } from "../ui/key.service";

export class BaseTerrainViewport {
    private parent: HTMLElement;
    private domElement: HTMLElement;
    private name: string;

    private terrainMaterial: Material;
    protected terrainGeometry: BufferGeometry;
    private terrainMesh: Mesh;

    private camera: PerspectiveCamera;
    public orbitControls: OrbitControls;

    protected scene: Scene;
    private renderer: WebGLRenderer;
    private raycaster: Raycaster = new Raycaster();
    private mouse: Vector2 = new Vector2();
    private mouseDown: boolean;
    private highlightedSquareTriangle: Face;
    private highlightedSquareOriginalColor: ColorDefinition;

    private pane: Pane;
    protected animationEvents: ((z: any) => void)[] = [];

    constructor(config: BaseTerrainViewportConfig) {
        this.parent = config.parent;
        this.name = config.name;
        this.terrainMaterial = config.terrainMaterial;
    }

    init(): void {
        this.domElement = this.constructViewportContainer(this.parent);
        this.camera = new PerspectiveCamera(70, this.domElement.offsetWidth / this.domElement.offsetHeight, 0.01, 200);
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ antialias: true });

        // Observers/Listeners
        new ResizeObserver(() => this.paneResized()).observe(this.domElement);
        this.domElement.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event));
        this.domElement.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event));
        this.domElement.addEventListener('mouseup', (event: MouseEvent) => this.onMouseUp(event));

        // Camera
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.loadOrbitControlsLocation(this.orbitControls);
        this.orbitControls.enabled = false;
        _keyService.registerKeyEvent({
            key: "Alt",
            name: "terrain-viewport-alt",
            keyDown: () => this.orbitControls.enabled = true,
            keyUp: () => this.orbitControls.enabled = false
        });

        // Helpers
        const axesHelper = new AxesHelper(5);
        this.scene.add(axesHelper);
        this.initPane();

        // Light
        let [pointLight, pointLightHelper] = this.initLight(true);
        this.scene.add(pointLight);
        if (!!pointLightHelper) this.scene.add(pointLightHelper);

        // Terrain
        this.terrainMesh = this.generateTerrainMesh(this.terrainGeometry);
        this.scene.add(this.terrainMesh);

        // Animation loop
        this.animationEvents.push((time) => this.processMouse());

        // Rendering
        this.renderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight);
        this.renderer.setAnimationLoop((time) => this.animation(time));

        // Bind to DOM
        this.domElement.appendChild(this.renderer.domElement);
    }

    generateTerrainMesh(terrainGeometry: BufferGeometry): Mesh {
        const mesh = new Mesh(terrainGeometry, this.terrainMaterial);
        return mesh;
    }

    paneResized() {
        this.camera.aspect = this.domElement.offsetWidth / this.domElement.offsetHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight);
    }

    onMouseDown(event: MouseEvent) {
        event.preventDefault();
        if (event.button === 0) {
            this.mouseDown = true;
        }
    }

    onMouseUp(event: MouseEvent) {
        event.preventDefault();
        if (event.button === 0) {
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent) {
        event.preventDefault();
        this.mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = - (event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
    }

    initLight(showHelper: boolean) {
        const pointLight = new PointLight();
        pointLight.position.set(32, 300, 32);
        pointLight.intensity = 1;

        let pointLightHelper = null;
        if (showHelper) {
            const sphereSize = 1;
            pointLightHelper = new PointLightHelper(pointLight, sphereSize, 'red');
            pointLightHelper.color = 'red';
        }

        return [pointLight, pointLightHelper];
    }

    initPane() {
        this.pane = new Pane({
            container: this.domElement.getElementsByClassName('pane-container').item(0) as HTMLElement
        });

        const fCamera = this.pane.addFolder({
            title: 'Camera',
            expanded: false
        });
        const fCameraPosition = fCamera.addFolder({
            title: 'Position',
        });
        fCameraPosition.addMonitor(this.camera.position, 'x');
        fCameraPosition.addMonitor(this.camera.position, 'y');
        fCameraPosition.addMonitor(this.camera.position, 'z');
        const fCameraRotation = fCamera.addFolder({
            title: 'Rotation',
        });
        fCameraRotation.addMonitor(this.camera.rotation, 'x');
        fCameraRotation.addMonitor(this.camera.rotation, 'y');
        fCameraRotation.addMonitor(this.camera.rotation, 'z');
        const bSaveCameraLocation = fCamera.addButton({
            title: 'Save',
            label: 'Save Location'
        });
        bSaveCameraLocation.on('click', () => {
            this.saveOrbitControlsLocation(this.orbitControls);
        });
        const bLoadCameraLocation = fCamera.addButton({
            title: 'Load',
            label: 'Load Location'
        });
        bLoadCameraLocation.on('click', () => {
            this.loadOrbitControlsLocation(this.orbitControls);
        });
        const bResetCameraLocation = fCamera.addButton({
            title: 'Reset',
            label: 'Reset Location'
        });
        bResetCameraLocation.on('click', () => {
            this.resetOrbitControlsLocation(this.orbitControls);
        });

        // const fLight = this.pane.addFolder({
        //     title: 'Light',
        //     expanded: true
        // });
        // const fLightPosition = fLight.addFolder({
        //     title: 'Position',
        // });
        // fLightPosition.addInput(pointLight.position, 'x');
        // fLightPosition.addInput(pointLight.position, 'y');
        // fLightPosition.addInput(pointLight.position, 'z');
        // fLightPosition.addInput(pointLight, 'intensity', { min: 0, max: 5 });
    }

    saveOrbitControlsLocation(orbitControls: OrbitControls) {
        const camera = orbitControls.object;
        const location = {
            position: {
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z
            },
            rotation: {
                x: camera.rotation.x,
                y: camera.rotation.y,
                z: camera.rotation.z
            },
            target: {
                x: orbitControls.target.x,
                y: orbitControls.target.y,
                z: orbitControls.target.z
            },
        };
        const locationJson = JSON.stringify(location);
        window.localStorage.setItem(`orbitControls.${this.name}`, locationJson);
        console.log('Saved orbitControls location!');
        console.log(locationJson);
    }

    resetOrbitControlsLocation(orbitControls: OrbitControls) {
        orbitControls.reset();
        orbitControls.object.position.set(0.5, 0.5, 0.5);
        orbitControls.update();
        window.localStorage.removeItem(`orbitControls.${this.name}`);
        console.log('Reset orbitControls location!');
    }

    loadOrbitControlsLocation(orbitControls: OrbitControls) {
        const camera = orbitControls.object;
        const data = window.localStorage.getItem(`orbitControls.${this.name}`);
        if (!data) {
            this.resetOrbitControlsLocation(orbitControls);
            return;
        }
        const location = JSON.parse(data);
        camera.position.set(location.position.x, location.position.y, location.position.z);
        camera.rotation.set(location.rotation.x, location.rotation.y, location.rotation.z);
        orbitControls.target.set(location.target.x, location.target.y, location.target.z);
        this.orbitControls.update();
        console.log('Loaded orbitControls location!');
    }

    animation(time: number) {
        if (!this) return;
        for (var i = 0; i < this.animationEvents.length; i++) {
            this.animationEvents[i](time);
        }

        this.renderer.render(this.scene, this.camera);
    }

    private constructViewportContainer(parent: HTMLElement) {
        const viewportContainer = document.createElement('div');
        viewportContainer.classList.add('viewport-container');

        const paneContainer = document.createElement('div');
        paneContainer.classList.add('pane-container');

        const viewport = document.createElement('div');
        viewport.classList.add('viewport');
        viewport.appendChild(paneContainer);

        viewportContainer.appendChild(viewport);

        parent.appendChild(viewportContainer);

        return viewport;
    }

    private processMouse() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const recursiveFlag = false;
        var intersects = this.raycaster.intersectObjects([this.terrainMesh], recursiveFlag);

        if (intersects.length === 0) {
            return;
        }

        const hit = intersects[0];
        const mesh: Mesh = hit.object as Mesh;
        
        if (!hit.face) {
            return;
        }

        if (this.mouseDown && !this.orbitControls.enabled) {
            this.paintWithMouse(mesh, hit.face, ColorDefinitions.RED);
        }

        this.drawMouseHighlight(mesh, hit.face, ColorDefinitions.RED);
    }

    // FIXME: This is a hacky solution. We should be maintaining the color of a tile in a separate area, not as part of a state machine.
    private drawMouseHighlight(mesh: Mesh, face: Face, color: ColorDefinition) {
        this.unhighlightMousePosition(mesh);
        this.highlightMousePosition(face, mesh, color);
    }

    private highlightMousePosition(face: Face, mesh: Mesh, color: ColorDefinition) {
        this.highlightedSquareTriangle = face;
        this.highlightedSquareOriginalColor = new ColorDefinition(
            mesh.geometry.attributes.color.getX(face.a),
            mesh.geometry.attributes.color.getY(face.a),
            mesh.geometry.attributes.color.getZ(face.a)
        );
        GeometryColorUtils.tintColorSquareByFace(mesh, face, color, 0.4);
    }

    private unhighlightMousePosition(mesh: Mesh) {
        if (!this.highlightedSquareTriangle) {
            return;
        }

        GeometryColorUtils.colorSquareByFace(mesh, this.highlightedSquareTriangle, this.highlightedSquareOriginalColor);
    }

    private paintWithMouse(mesh: Mesh, face: Face, color: ColorDefinition) {
        GeometryColorUtils.colorSquareByFace(mesh, face, ColorDefinitions.RED);
    }
}

// TODO: Move these as responsibilities of the terrain layer. So we can determine the x/y coords of the square, rather than always relying on the faces of geometry.
export abstract class GeometryColorUtils {
    public static colorSquareByFace(mesh: Mesh, face: Face, color: ColorDefinition) {
        this.colorFace(mesh, face, color);
        if (face.a % 6 === 0) {
            this.colorVertexByIndex(mesh, face.a + 3, color);
            this.colorVertexByIndex(mesh, face.b + 3, color);
            this.colorVertexByIndex(mesh, face.c + 3, color);
        }
        if (face.a % 6 === 3) {
            this.colorVertexByIndex(mesh, face.a - 3, color);
            this.colorVertexByIndex(mesh, face.b - 3, color);
            this.colorVertexByIndex(mesh, face.c - 3, color);
        }
        mesh.geometry.attributes.color.needsUpdate = true;
    }

    public static colorVertexByIndex(mesh: Mesh, index: number, color: ColorDefinition) {
        mesh.geometry.attributes.color.setXYZ(index, color.r, color.g, color.b);
    }

    private static colorFace(mesh: Mesh, face: Face, color: ColorDefinition) {
        this.colorVertexByIndex(mesh, face.a, color);
        this.colorVertexByIndex(mesh, face.b, color);
        this.colorVertexByIndex(mesh, face.c, color);
    }

    public static tintColorSquareByFace(mesh: Mesh, face: Face, overlayColor: ColorDefinition, opacity: number) {
        const baseColor = new ColorDefinition(
            mesh.geometry.attributes.color.getX(face.a),
            mesh.geometry.attributes.color.getY(face.a),
            mesh.geometry.attributes.color.getZ(face.a)
        );

        const tintedColor = this.calculateOverlayColor(baseColor, overlayColor, opacity);
        this.colorSquareByFace(mesh, face, tintedColor);
    }

    public static calculateOverlayColor(baseColor: ColorDefinition, overlayColor: ColorDefinition, overlayOpacity: number): ColorDefinition {
        const r = this.calculateOverlayColorBand(baseColor.r, overlayColor.r, overlayOpacity);
        const g = this.calculateOverlayColorBand(baseColor.g, overlayColor.g, overlayOpacity);
        const b = this.calculateOverlayColorBand(baseColor.b, overlayColor.b, overlayOpacity);
        return new ColorDefinition(r, g, b);
    }

    public static calculateOverlayColorBand(baseBandValue: number, overlayBandValue: number, overlayOpacity: number): number {
        // https://stackoverflow.com/a/29039328
        const baseOpacity = 1;
        const targetOpacity = 1;
        const opacityCoeff = 1 / targetOpacity;
        return opacityCoeff * (overlayBandValue * overlayOpacity + baseBandValue * baseOpacity * (1 - overlayOpacity));
    }
}

export interface BaseTerrainViewportConfig {
    name: string;
    parent: HTMLElement;
    terrain: Terrain;
    terrainMaterial: Material;
}