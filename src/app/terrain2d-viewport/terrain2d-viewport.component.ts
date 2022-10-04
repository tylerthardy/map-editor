import { AfterViewInit, Component, Inject } from '@angular/core';
import { GoldenLayoutComponentState } from 'ngx-golden-layout';
import { BoxGeometry, BufferGeometry, ConeGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CameraService, KeyService, MAIN_CAMERA_NAME, TerrainService } from '../common/services';
import { TerrainViewportComponent } from '../terrain-viewport/terrain-viewport.component';

@Component({
  selector: 'app-terrain2d-viewport',
  templateUrl: './terrain2d-viewport.component.html',
  styleUrls: ['./terrain2d-viewport.component.scss']
})
export class Terrain2dViewportComponent extends TerrainViewportComponent implements AfterViewInit {
  public orbitControls3D!: OrbitControls;
  private orbitControls3DRepresentation!: Mesh;
  private target3DRepresentation!: Mesh;
  constructor(
    terrainService: TerrainService,
    override cameraService: CameraService,
    override keyService: KeyService,
    @Inject(GoldenLayoutComponentState) state: any
  ) {
    super(terrainService, cameraService, keyService, state);
    this.cameraName = 'terrain2dViewport';
    this.terrainGeometry = terrainService.terrain.geometry2d;
  }
  override ngAfterViewInit(): void {
    this.terrainMaterial = new MeshBasicMaterial({
      vertexColors: true
    });
    this.cameraName = 'viewport-2d-camera';

    super.ngAfterViewInit();

    this.orbitControls3D = this.cameraService.getOrbitControlCamera(MAIN_CAMERA_NAME)!.orbitControls;
    // previously in init
    // 3D Camera
    this.orbitControls3DRepresentation = this.get3DCameraRepresentationMesh();
    this.scene.add(this.orbitControls3DRepresentation);
    this.target3DRepresentation = this.getTarget3DRepresentationMesh();
    this.scene.add(this.target3DRepresentation);
    this.orbitControlCamera.orbitControls.enabled = false;
    // override for 2d view downward
    this.orbitControlCamera.orbitControls.reset();
    this.orbitControlCamera.orbitControls.object.position.set(4, 15, 4);
    this.orbitControlCamera.orbitControls.object.rotation.set(-1.57, 0, 0);
    this.registerAnimationEvents();

    this.addTileGrid();
  }

  registerAnimationEvents() {
    console.log('register animation events');
    this.animationEvents.push((time) => this.updateOrbitControls3DPosition());
    this.animationEvents.push((time) => this.updateTargetPosition());
  }

  getTarget3DRepresentationMesh(): Mesh {
    const geometry = new BoxGeometry(0.25, 0.25, 0.25);
    const material = new MeshBasicMaterial({ color: 0x00ffff });
    const cone = new Mesh(geometry, material);
    return cone;
  }

  addTileGrid(): void {
    const meshConfig = {
      sceneHeight: 10,
      sceneWidth: 10,
      lineWidth: 0.002,
      color: 0x000000
    };
    for (let x = 0; x < meshConfig.sceneWidth; x++) {
      this.scene.add(this.getVerticalMeshLine(x, meshConfig));
    }
    for (let y = 0; y < meshConfig.sceneHeight; y++) {
      this.scene.add(this.getHorizontalMeshLine(y, meshConfig));
    }
  }

  // TODO: Move out & clean up code (vars, names, etc)
  getHorizontalMeshLine(y: number, config?: any): Object3D {
    const points: Vector3[] = [];

    //width
    const zDepth = 0.01;
    points.push(new Vector3(0, zDepth, y));
    points.push(new Vector3(0 + config.sceneWidth, zDepth, y));

    const geometry = new BufferGeometry().setFromPoints(points);

    var line = new MeshLine();
    line.setGeometry(geometry, () => 20); // TODO: Define type

    var material = new MeshLineMaterial({
      color: config.color,
      opacity: 0.2,
      lineWidth: config.lineWidth,
      sizeAttenuation: true
    });

    return new Mesh(line, material);
  }

  // TODO: Move out & clean up code (vars, names, etc)
  getVerticalMeshLine(x: number, config?: any): Object3D {
    const points: Vector3[] = [];

    //width
    const zDepth = 0.01;
    points.push(new Vector3(x, zDepth, 0));
    points.push(new Vector3(x, zDepth, 0 + config.sceneHeight));

    const geometry = new BufferGeometry().setFromPoints(points);

    var line = new MeshLine();
    line.setGeometry(geometry, () => 20); // TODO: Define type

    var material = new MeshLineMaterial({
      color: config.color,
      opacity: 0.2,
      lineWidth: config.lineWidth,
      sizeAttenuation: true
    });

    return new Mesh(line, material);
  }

  get3DCameraRepresentationMesh(): Mesh {
    // TODO: there is an svg loader we can use instead
    // https://threejs.org/docs/#examples/en/loaders/SVGLoader
    const geometry = new ConeGeometry(0.25, 1, 32);
    geometry.rotateX(Math.PI / 2);
    const material = new MeshBasicMaterial({ color: 0xff00ff });
    const cone = new Mesh(geometry, material);
    return cone;
  }

  updateOrbitControls3DPosition() {
    const position = this.cameraService.getOrbitControlCamera(MAIN_CAMERA_NAME)!.camera.position;
    const target = this.orbitControls3D.target;
    this.orbitControls3DRepresentation.position.set(position.x, position.y, position.z);
    this.orbitControls3DRepresentation.lookAt(target);
  }

  updateTargetPosition() {
    const target = this.orbitControls3D.target;
    this.target3DRepresentation.position.set(target.x, target.y, target.z);
  }
}
