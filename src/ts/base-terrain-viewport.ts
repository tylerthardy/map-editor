import { AxesHelper, BufferGeometry, Material, Mesh, PerspectiveCamera, PointLight, PointLightHelper, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

export class BaseTerrainViewport {
    private domElement: HTMLElement;
    private name: string;

    private terrainMaterial: Material;
    private terrainGeometry: BufferGeometry;
    private terrainMesh: Mesh;

    private camera: PerspectiveCamera;
    public orbitControls: OrbitControls;

    protected scene: Scene;
    private renderer: WebGLRenderer;
    
    private pane: Pane;
    protected animationEvents: ((z: any) => void)[] = [];

    constructor(config: BaseTerrainViewportConfig) {
        this.domElement = config.domElement;
        this.name = config.name;
        this.terrainGeometry = config.terrainGeometry;
        this.terrainMaterial = config.terrainMaterial;
    }

    init(): void {
        this.camera = new PerspectiveCamera(70, this.domElement.offsetWidth / this.domElement.offsetHeight, 0.01, 200);
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ antialias: true });
        new ResizeObserver(() => this.paneResized()).observe(this.domElement);

        // Camera
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.loadOrbitControlsLocation(this.orbitControls);

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

    initLight(showHelper: boolean) {
        const pointLight = new PointLight();
        pointLight.position.set(8, 30, 8);
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
}

export interface BaseTerrainViewportConfig {
    name: string;
    domElement: HTMLElement;
    terrainMaterial: Material;
    terrainGeometry: BufferGeometry;
}