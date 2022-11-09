import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoldenLayoutComponentState } from 'ngx-golden-layout';
import { CameraService, KeyService, Terrain, TerrainService } from '../common/services';
import { BrushService } from '../common/services/brush/brush.service';

import { Terrain2dViewportComponent } from './terrain2d-viewport.component';

describe(Terrain2dViewportComponent.name, () => {
  let component: Terrain2dViewportComponent;
  let fixture: ComponentFixture<Terrain2dViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Terrain2dViewportComponent],
      providers: [
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
          provide: TerrainService,
          useValue: {}
        },
        {
          provide: BrushService,
          useValue: {}
        },
        {
          provide: CameraService,
          useValue: {}
        },
        {
          provide: KeyService,
          useValue: {}
        },
        {
          provide: GoldenLayoutComponentState,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Terrain2dViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
