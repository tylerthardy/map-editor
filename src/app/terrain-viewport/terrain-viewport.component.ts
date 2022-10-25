import { AfterViewInit, Component, ElementRef, Inject, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { GoldenLayoutComponentState } from 'ngx-golden-layout';
import { Subscription } from 'rxjs';
import {
  AxesHelper,
  BufferGeometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  PointLightHelper,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer
} from 'three';
import {
  CameraService,
  Chunk,
  ChunkService,
  KeyService,
  MAIN_CAMERA_NAME,
  OrbitControlCamera
} from '../common/services';
import { BrushService } from '../common/services/brush/brush.service';
import { Terrain } from '../common/services/terrain/terrain';

@Component({
  selector: 'app-terrain-viewport',
  templateUrl: './terrain-viewport.component.html',
  styleUrls: ['./terrain-viewport.component.scss']
})
export class TerrainViewportComponent implements AfterViewInit, OnChanges {
  //TODO: Remove !s because theyre being initialized in a method - refactor that
  @ViewChild('viewport') private viewportRef!: ElementRef;
  private viewport!: HTMLDivElement;
  private resizeObserver!: ResizeObserver;

  protected cameraName: string = MAIN_CAMERA_NAME;

  protected terrain!: Terrain;
  protected terrainMaterial: Material = new MeshStandardMaterial({
    vertexColors: true
  });
  protected terrainGeometry!: BufferGeometry;
  protected terrainSubscription: Subscription;
  protected terrainMesh!: Mesh;

  protected orbitControlCamera!: OrbitControlCamera;

  protected scene!: Scene;
  protected renderer!: WebGLRenderer;
  private raycaster: Raycaster = new Raycaster();
  private mouse: Vector2 = new Vector2();
  private mouseDown: boolean = false;

  protected animationEvents: ((z: any) => void)[] = [];

  constructor(
    protected chunkService: ChunkService,
    protected brushService: BrushService,
    protected cameraService: CameraService,
    protected keyService: KeyService,
    @Inject(GoldenLayoutComponentState) state: any
  ) {
    this.renderer = new WebGLRenderer({ antialias: true });

    this.terrainSubscription = this.chunkService.$chunkUpdated.subscribe((chunk: Chunk) => {
      this.setTerrain(chunk.terrain);
    });

    this.setTerrain(this.chunkService.loadedChunk.terrain);
  }

  setTerrain(terrain: Terrain): void {
    this.terrain = terrain;
    this.terrainGeometry = this.terrain.geometry3d;

    if (this.scene) {
      this.scene.remove(this.terrainMesh);
    }
    this.terrain = this.chunkService.loadedChunk.terrain;
    this.terrainMesh = new Mesh(this.terrainGeometry, this.terrainMaterial);
    if (this.scene) {
      this.scene.add(this.terrainMesh);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.viewport = this.viewportRef.nativeElement;

    // previously in init method

    this.scene = new Scene();
    this.orbitControlCamera = this.cameraService.createOrbitControlCamera(
      this.cameraName,
      this.renderer.domElement,
      this.viewport.offsetWidth / this.viewport.offsetHeight
    );

    // Observers/Listeners
    this.resizeObserver = new ResizeObserver((entries) => this.paneResized(entries));
    this.resizeObserver.observe(this.viewport);

    this.viewport.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event));
    this.viewport.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event));
    this.viewport.addEventListener('mouseup', (event: MouseEvent) => this.onMouseUp(event));

    // Camera
    this.orbitControlCamera.load();
    this.orbitControlCamera.orbitControls.enabled = false;
    this.keyService.registerKeyEvent({
      key: 'Alt',
      name: 'terrain-viewport-alt',
      keyDown: () => (this.orbitControlCamera.orbitControls.enabled = true),
      keyUp: () => (this.orbitControlCamera.orbitControls.enabled = false)
    });
    this.orbitControlCamera.createSettingsPane(
      this.viewport.getElementsByClassName('pane-container').item(0) as HTMLElement
    );

    // Helpers
    const axesHelper = new AxesHelper(500);
    this.scene.add(axesHelper);

    // Animation loop
    this.animationEvents.push((time) => this.processMouse());

    // Light
    const pointLight = new PointLight();
    pointLight.position.set(32, 300, 32);
    pointLight.intensity = 1;
    this.scene.add(pointLight);
    this.scene.add(this.getPointLightHelper(pointLight));

    // Rendering
    this.renderer.setSize(this.viewport.offsetWidth, this.viewport.offsetHeight);
    this.renderer.setAnimationLoop((time) => this.animation(time));

    // Bind to DOM
    this.viewport.appendChild(this.renderer.domElement);

    // Terrain
    // TODO: Move to subscription
    this.terrainMesh = new Mesh(this.terrainGeometry, this.terrainMaterial);
    this.scene.add(this.terrainMesh);
  }

  init(): void {}

  paneResized(entries: ResizeObserverEntry[]) {
    const resized: ResizeObserverEntry = entries[0];
    if (resized.target !== this.viewport) {
      console.log('not viewport');
      return;
    }
    this.orbitControlCamera.camera.aspect = this.viewport.offsetWidth / this.viewport.offsetHeight;
    this.orbitControlCamera.camera.updateProjectionMatrix();

    this.renderer.setSize(resized.contentRect.width, resized.contentRect.height);
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
    console.log('onMouseMove');
    event.preventDefault();
    this.mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
  }

  getPointLightHelper(pointLight: PointLight): PointLightHelper {
    const sphereSize = 1;
    const pointLightHelper = new PointLightHelper(pointLight, sphereSize, 'red');
    pointLightHelper.color = 'red';
    return pointLightHelper;
  }

  animation(time: number) {
    if (!this) return;
    for (var i = 0; i < this.animationEvents.length; i++) {
      this.animationEvents[i](time);
    }

    this.renderer.render(this.scene, this.orbitControlCamera.camera);
  }

  private processMouse() {
    this.raycaster.setFromCamera(this.mouse, this.orbitControlCamera.camera);
    const recursiveFlag = false;
    var intersects = this.raycaster.intersectObjects([this.terrainMesh], recursiveFlag);

    if (intersects.length === 0) {
      return;
    }

    const hit = intersects[0];
    if (!hit.face) {
      return;
    }

    const tileCoords: Vector2 = this.terrain.getFaceXY(hit.face);
    if (this.mouseDown && !this.orbitControlCamera.orbitControls.enabled) {
      if (this.brushService.paintMode) {
        this.terrain.setTileStoredColor(
          tileCoords.x,
          tileCoords.y,
          this.brushService.brushColor,
          this.brushService.modifySurrounding
        );
      } else {
        this.terrain.setTileStoredElevation(tileCoords.x, tileCoords.y, this.brushService.brushElevation / 10);
      }
    }

    this.terrain.highlightTile(tileCoords.x, tileCoords.y, this.brushService.brushColor);
  }
}

export interface BaseTerrainViewportConfig {
  name: string;
  parent: HTMLElement;
  terrain: Terrain;
  terrainMaterial: Material;
}
