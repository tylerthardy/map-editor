import { Component, OnInit, ViewChild } from '@angular/core';
import { GoldenLayoutComponent } from 'ngx-golden-layout';
import { IpcRendererService } from './common/services';
import { LayoutService } from './common/services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(GoldenLayoutComponent, { static: true }) layout!: GoldenLayoutComponent;

  constructor(private ipcRendererService: IpcRendererService, public layoutService: LayoutService) {}

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

  private addComponent(name: string) {
    this.layoutService.addComponent(name);
  }
}
