import { AxesHelper, BufferGeometry, Material, Mesh, PerspectiveCamera, PointLight, PointLightHelper, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import { ColorDefinition, ColorDefinitions } from "../geometry/color/color-definition";
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

    private pane: Pane;
    protected animationEvents: ((z: any) => void)[] = [];

    constructor(config: BaseTerrainViewportConfig) {
        this.parent = config.parent;
        this.name = config.name;
        this.terrainGeometry = config.terrainGeometry;
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
        this.animationEvents.push((time) => this.paintWithMouse());

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

    private paintWithMouse() {
        if (!this.mouseDown) {
            return;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const recursiveFlag = false;
        var intersects = this.raycaster.intersectObjects([this.terrainMesh], recursiveFlag);

        if (intersects.length > 0) {
            const hit = intersects[0];
            const mesh: Mesh = hit.object as Mesh;
            const color: ColorDefinition = ColorDefinitions.RED;

            // TODO: There's probably a way to clean this up mathematically
            mesh.geometry.attributes.color.setXYZ(hit.face.a, color.r, color.g, color.b);
            mesh.geometry.attributes.color.setXYZ(hit.face.b, color.r, color.g, color.b);
            mesh.geometry.attributes.color.setXYZ(hit.face.c, color.r, color.g, color.b);
            if (hit.face.a % 6 === 0) {
                mesh.geometry.attributes.color.setXYZ(hit.face.a + 3, color.r, color.g, color.b);
                mesh.geometry.attributes.color.setXYZ(hit.face.b + 3, color.r, color.g, color.b);
                mesh.geometry.attributes.color.setXYZ(hit.face.c + 3, color.r, color.g, color.b);
            }
            if (hit.face.a % 6 === 3) {
                mesh.geometry.attributes.color.setXYZ(hit.face.a - 3, color.r, color.g, color.b);
                mesh.geometry.attributes.color.setXYZ(hit.face.b - 3, color.r, color.g, color.b);
                mesh.geometry.attributes.color.setXYZ(hit.face.c - 3, color.r, color.g, color.b);
            }
            mesh.geometry.attributes.color.needsUpdate = true;
        }
    }
}

export interface BaseTerrainViewportConfig {
    name: string;
    parent: HTMLElement;
    terrainMaterial: Material;
    terrainGeometry: BufferGeometry;
}