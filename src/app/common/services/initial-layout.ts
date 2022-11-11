import { IExtendedGoldenLayoutConfig } from 'ngx-golden-layout';
import { BrushComponent } from '../../brush/brush.component';
import { TerrainViewportComponent } from '../../terrain-viewport/terrain-viewport.component';
import { Terrain2dViewportComponent } from '../../terrain2d-viewport/terrain2d-viewport.component';

export const INITIAL_LAYOUT: IExtendedGoldenLayoutConfig = {
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
