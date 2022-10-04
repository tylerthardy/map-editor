import { Injectable } from '@angular/core';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OrbitControlCamera } from './orbit-control-camera';

export interface ICameraSettingsPaneConfig {
  cameraLabel: string;
  container: HTMLElement;
}

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private orbitControlCameras: { [key: string]: OrbitControlCamera } = {};

  constructor() {}

  getOrbitControlCamera(label: string): OrbitControlCamera | undefined {
    if (!this.orbitControlCameras[label]) {
      return undefined;
    }
    return this.orbitControlCameras[label];
  }

  getCamera(label: string): PerspectiveCamera | undefined {
    if (!this.orbitControlCameras[label]) {
      return undefined;
    }
    return this.orbitControlCameras[label].camera;
  }

  getOrbitControls(label: string): OrbitControls | undefined {
    if (!this.orbitControlCameras[label]) {
      return undefined;
    }
    return this.orbitControlCameras[label].orbitControls;
  }

  createOrbitControlCamera(label: string, domElement: HTMLCanvasElement, aspectRatio: number): OrbitControlCamera {
    const camera: OrbitControlCamera = new OrbitControlCamera(label, domElement, aspectRatio);
    this.orbitControlCameras[label] = camera;
    return camera;
  }
}

export const MAIN_CAMERA_NAME = 'mainCamera';
