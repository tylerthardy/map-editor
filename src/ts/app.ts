import { ComponentContainer, GoldenLayout, LayoutConfig } from 'golden-layout';
import { MeshBasicMaterial, MeshStandardMaterial } from "three";
import { Terrain2DViewport } from "./viewports/terrain-2d-viewport";
import { Terrain3DViewport } from "./viewports/terrain-3d-viewport";
import { _keyService } from "./ui/key.service";
import { _terrainService } from  './geometry/terrain.service';

export class App {
    constructor() {}

    private layout: GoldenLayout;

    init() {
        window.addEventListener('resize', this.resizeWindow);

        const container = document.getElementById('container');
        var layoutConfig: LayoutConfig = {
            root: {
                type: 'row',
                content: [
                    // TODO: Hacky - Order here dictates the registered creation order
                    {
                        type: 'component',
                        title: '3D Editor',
                        width: 50,
                        componentType: 'terrain3dViewport',
                        componentState: {}
                    },
                    {
                        type: 'component',
                        title: '2D Editor',
                        width: 50,
                        componentType: 'terrain2dViewport',
                        componentState: {}
                    }
                ]
            }
        }

        this.layout = new GoldenLayout(layoutConfig, container);

        // TODO: Hacky hoist
        let viewport3d: Terrain3DViewport;
        let viewport2d: Terrain2DViewport;

        this.layout.registerComponent('terrain3dViewport', (c: ComponentContainer, state: any) => {
            viewport3d = new Terrain3DViewport({
                name: 'terrain3dViewport',
                parent: c.element,
                terrainGeometry: _terrainService.terrain3dGeometry,
                terrainMaterial: new MeshStandardMaterial({
                    vertexColors: true
                })
            });
        });

        this.layout.registerComponent('terrain2dViewport', (c: ComponentContainer, state: any) => {
            viewport2d = new Terrain2DViewport({
                name: 'terrain2dViewport',
                parent: c.element,
                terrainGeometry: _terrainService.terrain2dGeometry,
                terrainMaterial: new MeshBasicMaterial({
                    vertexColors: true
                }),
                orbitControls3D: viewport3d.orbitControls
            });
        });

        this.layout.init();
    }
    
    resizeWindow() {
        this.layout.setSize(window.innerWidth, window.innerHeight);
    }
}