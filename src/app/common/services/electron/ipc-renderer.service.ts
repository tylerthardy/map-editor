import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class IpcRendererService {
  public ipcRenderer: IpcRenderer = window.require('electron').ipcRenderer as IpcRenderer;

  constructor() {}

  public register(eventName: string, callback: (arg: any) => void) {
    this.ipcRenderer.on(eventName, (event, arg) => {
      callback(arg);
    });
  }
}
