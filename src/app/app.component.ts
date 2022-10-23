import { Component, OnInit, ViewChild } from '@angular/core';
import GeoTIFF from 'geotiff';
import { GoldenLayoutComponent } from 'ngx-golden-layout';
import { concatMap, from, Observable } from 'rxjs';
import { IpcRendererService } from './common/services';
import { GeotiffService } from './common/services/geotiff/geotiff.service';
import { LayoutService } from './common/services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(GoldenLayoutComponent, { static: true }) layout!: GoldenLayoutComponent;

  constructor(
    private ipcRendererService: IpcRendererService,
    public layoutService: LayoutService,
    public geotiffService: GeotiffService
  ) {}

  ngOnInit(): void {
    this.layoutService.layout = this.layout;
  }

  public toggleMenu(): void {
    this.ipcRendererService.ipcRenderer.sendSync('toggle-menu');
  }

  public add3dViewport(): void {
    this.addComponent('TerrainViewportComponent');
  }

  public add2dViewport(): void {
    this.addComponent('Terrain2dViewportComponent');
  }

  public geoTiffer(): void {
    const geoTiffPromise = this.geotiffService.loadGeotiff('C:/example.tiff');
    const observable: Observable<GeoTIFF> = from(geoTiffPromise);
    observable.pipe(concatMap((geotiff) => this.geotiffService.printInformation(geotiff))).subscribe();
  }

  public saveFile(): void {
    this.ipcRendererService.ipcRenderer.sendSync('save-file');
  }

  public openFile(): void {
    this.ipcRendererService.ipcRenderer.send('open-file', 'datdatdat');
  }

  private addComponent(name: string): void {
    this.layoutService.addComponent(name);
  }
}
