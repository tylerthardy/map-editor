declare module 'three.meshline' {
    const classes: { MeshLine: any, MeshLineMaterial: any, MeshLineRaycast: any }
    export class MeshLine extends THREE.BufferGeometry {[key: string]: any}
    export class MeshLineMaterial extends THREE.ShaderMaterial {
        [key: string]: any;
        props: any;
        constructor(parameters: MeshLineMaterialParameters)
    }
    export class MeshLineMaterialParameters {
        /**
         *  - a THREE.Texture to paint along the line (requires useMap set to true)
         */
         map?: any;
         /**
          *  - tells the material to use map (0 - solid color, 1 use texture)
          */
         useMap?: any;
         /**
          *  - a THREE.Texture to use as alpha along the line (requires useAlphaMap set to true)
          */
         alphaMap?: any;
         /**
          *  - tells the material to use alphaMap (0 - no alpha, 1 modulate alpha)
          */
         useAlphaMap?: any;
         /**
          *  - THREE.Vector2 to define the texture tiling (applies to map and alphaMap - MIGHT CHANGE IN THE FUTURE)
          */
         repeat?: any;
         /**
          *  - THREE.Color to paint the line width, or tint the texture with
          */
         color?: any;
         /**
          *  - alpha value from 0 to 1 (requires transparent set to true)
          */
         opacity?: any;
         /**
          *  - cutoff value from 0 to 1
          */
         alphaTest?: any;
         /**
          *  - the length and space between dashes. (0 - no dash)
          */
         dashArray?: any;
         /**
          *  - defines the location where the dash will begin. Ideal to animate the line.
          */
         dashOffset?: any;
         /**
          *  - defines the ratio between that is visible or not (0 - more visible, 1 - more invisible).
          */
         dashRatio?: any;
         /**
          *  - THREE.Vector2 specifying the canvas size (REQUIRED)
          */
         resolution?: any;
         /**
          *  - makes the line width constant regardless distance (1 unit is 1px on screen) (0 - attenuate, 1 - don't attenuate)
          */
         sizeAttenuation?: any;
         /**
          *  - float defining width (if sizeAttenuation is true, it's world units; else is screen pixels)
          */
         lineWidth?: any;
    }
    export class MeshLineRaycast extends THREE.Raycaster {[key: string]: any}
}