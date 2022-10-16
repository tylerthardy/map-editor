import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoldenLayoutComponentState } from 'ngx-golden-layout';
import { CameraService, KeyService, Terrain, TerrainService } from '../common/services';
import { BrushService } from '../common/services/brush/brush.service';

import { TerrainViewportComponent } from './terrain-viewport.component';

describe('TerrainViewportComponent', () => {
  let component: TerrainViewportComponent;
  let fixture: ComponentFixture<TerrainViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerrainViewportComponent],
      providers: [
        {
          provide: TerrainService,
          useValue: {
            terrain: new Terrain([], 0)
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

    fixture = TestBed.createComponent(TerrainViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
