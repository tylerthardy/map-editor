import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GoldenLayoutModule } from 'ngx-golden-layout';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { INITIAL_LAYOUT, IpcRendererService, LayoutService } from './common/services';
import { TerrainViewportComponent } from './terrain-viewport/terrain-viewport.component';
import { Terrain2dViewportComponent } from './terrain2d-viewport/terrain2d-viewport.component';

describe(AppComponent.name, () => {
  let app: AppComponent;
  let mockLayoutService: jasmine.SpyObj<LayoutService> = jasmine.createSpyObj(LayoutService.name, ['addComponent'], {
    config$: of(INITIAL_LAYOUT)
  });
  let mockIpcRendererService: jasmine.SpyObj<IpcRendererService> = jasmine.createSpyObj(LayoutService.name, [
    'sendSync'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, GoldenLayoutModule.forRoot([])],
      declarations: [AppComponent],
      providers: [
        {
          provide: IpcRendererService,
          useValue: mockIpcRendererService
        },
        {
          provide: LayoutService,
          useValue: mockLayoutService
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app.layout).toBeTruthy();
    expect(app).toBeTruthy();
  });

  describe(AppComponent.prototype.add2dViewport.name, () => {
    it('should add 2d viewport component to layout service', () => {
      app.add2dViewport();
      expect(mockLayoutService.addComponent).toHaveBeenCalledWith(Terrain2dViewportComponent.name);
    });
  });

  describe(AppComponent.prototype.add3dViewport.name, () => {
    it('should add 3d viewport component to layout service', () => {
      app.add3dViewport();
      expect(mockLayoutService.addComponent).toHaveBeenCalledWith(TerrainViewportComponent.name);
    });
  });

  describe(AppComponent.prototype.toggleMenu.name, () => {
    it('should add 2d viewport component to layout service', () => {
      app.toggleMenu();
      expect(mockIpcRendererService.sendSync).toHaveBeenCalledWith('toggle-menu');
    });
  });
});
