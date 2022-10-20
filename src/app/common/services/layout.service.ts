import { ComponentRef, Injectable } from '@angular/core';
import { GoldenLayoutComponent, IExtendedGoldenLayoutConfig } from 'ngx-golden-layout';
import { Observable, of } from 'rxjs';
import { BrushComponent } from '../../brush/brush.component';
import { TerrainViewportComponent } from '../../terrain-viewport/terrain-viewport.component';
import { Terrain2dViewportComponent } from '../../terrain2d-viewport/terrain2d-viewport.component';

const INITIAL_LAYOUT: IExtendedGoldenLayoutConfig = {
  content: [
    {
      type: 'column',
      content: [
        {
          type: 'row',
          content: [
            {
              type: 'component',
              componentName: TerrainViewportComponent.name,
              title: 'Terrain 3D'
            },
            {
              type: 'component',
              componentName: Terrain2dViewportComponent.name,
              title: 'Terrain 2D'
            }
          ]
        },
        {
          type: 'row',
          content: [
            {
              type: 'component',
              componentName: BrushComponent.name,
              title: 'Brush'
            }
          ],
          height: 25
        }
      ]
    }
  ],
  settings: {}
};

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  layout!: GoldenLayoutComponent;
  config$: Observable<IExtendedGoldenLayoutConfig> = of(INITIAL_LAYOUT);

  constructor() {}

  public addComponent(name: string): Promise<ComponentRef<any>> {
    return this.layout.createNewComponent({
      type: 'component',
      componentName: name,
      title: 'Dynamic ' + name,
      componentState: {
        aTestString: 'asdf'
      }
    });
  }
}
