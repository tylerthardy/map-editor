import { MeshBasicMaterial, MeshStandardMaterial } from "three";
import { Terrain2DViewport } from "./terrain-2d-viewport";
import { Terrain3DViewport } from "./terrain-3d-viewport";
import { ComponentContainer, GoldenLayout, LayoutConfig } from 'golden-layout';
import { GeometryColorizer, TerrainGenerator } from "./geometry";
import { ColorDefinitions } from "./geometry/color/color-definition";

window.addEventListener('resize', resizeWindow);

const terrain3dGeometry = TerrainGenerator.generateGeometry(16, 16, 1, 200);
const terrain2dGeometry = TerrainGenerator.flattenGeometry(terrain3dGeometry);

const colors = GeometryColorizer.getSolidSquareColor(16 * 16, ColorDefinitions.GRAY);
const vertexPositionCount = terrain3dGeometry.attributes.position.count;
const colorAttribute = GeometryColorizer.generateColorAttribute(vertexPositionCount, colors);
terrain2dGeometry.attributes.color = colorAttribute;
terrain3dGeometry.attributes.color = colorAttribute;

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

var layout = new GoldenLayout(layoutConfig, container);


// TODO: Hacky hoist
let viewport3d: Terrain3DViewport;
let viewport2d: Terrain2DViewport;

layout.registerComponent( 'terrain3dViewport', (c: ComponentContainer, state: any) => {
    viewport3d = new Terrain3DViewport({
        name: 'terrain3dViewport',
        domElement: constructViewportContainer(c.element),
        terrainGeometry: terrain3dGeometry,
        terrainMaterial: new MeshStandardMaterial({
            vertexColors: true
        })
    });
});

layout.registerComponent('terrain2dViewport', (c: ComponentContainer, state: any) => {
    viewport2d = new Terrain2DViewport({
        name: 'terrain2dViewport',
        domElement: constructViewportContainer(c.element),
        terrainGeometry: terrain2dGeometry,
        terrainMaterial: new MeshBasicMaterial({
            vertexColors: true
        }),
        orbitControls3D: viewport3d.orbitControls
    });
});

layout.init();

// TODO: Should be moved into the base terrain viewport construction
function constructViewportContainer(parent: HTMLElement) {
    const viewportContainer = document.createElement('div');
    viewportContainer.classList.add('viewport-container');

    const paneContainer = document.createElement('div');
    paneContainer.classList.add('pane-container');

    const viewport = document.createElement('div');
    viewport.classList.add('viewport');
    viewport.appendChild(paneContainer);

    viewportContainer.appendChild(viewport);

    parent.appendChild(viewportContainer);

    return viewport;
}

function resizeWindow() {
    layout.setSize(window.innerWidth, window.innerHeight);
}