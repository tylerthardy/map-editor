import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoldenLayoutComponentState } from 'ngx-golden-layout';
import { BrushService, CameraService, MAIN_CAMERA_NAME, Terrain, TerrainService } from '../common/services';

import { Terrain2dViewportComponent } from './terrain2d-viewport.component';

describe(Terrain2dViewportComponent.name, () => {
  let component: Terrain2dViewportComponent;
  let fixture: ComponentFixture<Terrain2dViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Terrain2dViewportComponent],
      providers: [
        CameraService,
        {
          provide: TerrainService,
          useValue: {
            terrain: new Terrain({
              tiles: [],
              size: 0
            })
          }
        },
        {
          provide: BrushService,
          useValue: {}
        },
        {
          provide: GoldenLayoutComponentState,
          useValue: {}
        }
      ]
    }).compileComponents();

    const mainCanvas: HTMLCanvasElement = document.createElement('canvas');
    const cameraService = TestBed.inject(CameraService);
    cameraService.createOrbitControlCamera(MAIN_CAMERA_NAME, mainCanvas, 1920 / 1080);

    fixture = TestBed.createComponent(Terrain2dViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
