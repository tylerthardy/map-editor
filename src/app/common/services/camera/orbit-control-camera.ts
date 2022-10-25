import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pane } from 'tweakpane';

export class OrbitControlCamera {
  public label: string;
  public camera: PerspectiveCamera;
  public orbitControls: OrbitControls;

  constructor(label: string, domElement: HTMLElement, aspectRatio: number) {
    this.label = label;
    const fov: number = 70;
    const near: number = 0.01;
    const far: number = 5000;
    this.camera = new PerspectiveCamera(fov, aspectRatio, near, far);
    this.orbitControls = new OrbitControls(this.camera, domElement);
  }

  public save() {
    const camera = this.orbitControls.object;
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
        x: this.orbitControls.target.x,
        y: this.orbitControls.target.y,
        z: this.orbitControls.target.z
      }
    };
    const locationJson = JSON.stringify(location);
    window.localStorage.setItem(`orbitControls.${this.label}`, locationJson);
    console.log('Saved orbitControls location!');
    console.log(locationJson);
  }

  public reset() {
    this.orbitControls.reset();
    this.orbitControls.object.position.set(18, 18, 18);
    this.orbitControls.update();
    window.localStorage.removeItem(`orbitControls.${this.label}`);
    console.log('Reset orbitControls location!');
  }

  public load() {
    const camera = this.orbitControls.object;
    const data = window.localStorage.getItem(`orbitControls.${this.label}`);
    if (!data) {
      this.reset();
      return;
    }
    const location = JSON.parse(data);
    camera.position.set(location.position.x, location.position.y, location.position.z);
    camera.rotation.set(location.rotation.x, location.rotation.y, location.rotation.z);
    this.orbitControls.target.set(location.target.x, location.target.y, location.target.z);
    this.orbitControls.update();
    console.log('Loaded orbitControls location!');
  }

  createSettingsPane(container: HTMLElement) {
    const pane: Pane = new Pane({
      container: container
    });

    const fCamera = pane.addFolder({
      title: 'Camera',
      expanded: false
    });
    const fCameraPosition = fCamera.addFolder({
      title: 'Position'
    });
    fCameraPosition.addMonitor(this.camera.position, 'x');
    fCameraPosition.addMonitor(this.camera.position, 'y');
    fCameraPosition.addMonitor(this.camera.position, 'z');
    const fCameraRotation = fCamera.addFolder({
      title: 'Rotation'
    });
    fCameraRotation.addMonitor(this.camera.rotation, 'x');
    fCameraRotation.addMonitor(this.camera.rotation, 'y');
    fCameraRotation.addMonitor(this.camera.rotation, 'z');
    const bSaveCameraLocation = fCamera.addButton({
      title: 'Save',
      label: 'Save Location'
    });
    bSaveCameraLocation.on('click', () => this.save());
    const bLoadCameraLocation = fCamera.addButton({
      title: 'Load',
      label: 'Load Location'
    });
    bLoadCameraLocation.on('click', () => this.load());
    const bResetCameraLocation = fCamera.addButton({
      title: 'Reset',
      label: 'Reset Location'
    });
    bResetCameraLocation.on('click', () => this.reset());

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
    return pane;
  }
}
