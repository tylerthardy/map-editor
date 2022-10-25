import { Component, OnInit, ViewChild } from '@angular/core';
import GeoTIFF, { fromBlob } from 'geotiff';
import { GoldenLayoutComponent } from 'ngx-golden-layout';
import { ToastrService } from 'ngx-toastr';
import { Chunk, ChunkService, IpcRendererService } from './common/services';
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
    private chunkService: ChunkService,
    private ipcRendererService: IpcRendererService,
    public layoutService: LayoutService,
    public geotiffService: GeotiffService,
    private toastrService: ToastrService
  ) {
    ipcRendererService.register('file-loading', (file) => this.fileLoading(file));
  }

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

  public saveFile(): void {
    this.ipcRendererService.ipcRenderer.sendSync('save-file');
  }

  public openFile(): void {
    this.ipcRendererService.ipcRenderer.send('open-file');
  }

  public loadNewRandomChunk(): void {
    this.chunkService.setChunk(ChunkService.createRandomizedChunk());
  }

  private addComponent(name: string): void {
    this.layoutService.addComponent(name);
  }

  private fileLoading(fileBuffer: Uint8Array): void {
    const blob: Blob = new Blob([fileBuffer]);
    fromBlob(blob).then((geotiff: GeoTIFF) => {
      this.geotiffService.geotiffToChunk(geotiff, 1000).then((chunk: Chunk) => {
        this.chunkService.setChunk(chunk);
      });
    });
  }
}
