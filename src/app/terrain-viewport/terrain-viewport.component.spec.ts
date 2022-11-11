import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoldenLayoutComponentState } from 'ngx-golden-layout';
import { CameraService, MAIN_CAMERA_NAME, Terrain, TerrainService } from '../common/services';
import { BrushService } from '../common/services/brush/brush.service';

import { TerrainViewportComponent } from './terrain-viewport.component';

describe(TerrainViewportComponent.name, () => {
  let component: TerrainViewportComponent;
  let fixture: ComponentFixture<TerrainViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerrainViewportComponent],
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

    fixture = TestBed.createComponent(TerrainViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
