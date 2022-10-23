import { Injectable } from '@angular/core';
import GeoTIFF, { fromArrayBuffer, GeoTIFFImage } from 'geotiff';
import { IpcRendererService } from '../electron';
const fs = window.require('fs');

@Injectable({
  providedIn: 'root'
})
export class GeotiffService {
  constructor(ipcRendererService: IpcRendererService) {
    ipcRendererService.register('file-loading', (file) => this.fileLoading(file));
  }

  public async loadGeotiff(filePath: string): Promise<GeoTIFF> {
    const fileBuffer: ArrayBuffer = fs.readFileSync(filePath);
    const geotiff: GeoTIFF = await fromArrayBuffer(fileBuffer);
    return geotiff;
  }

  public async printInformation(geotiff: GeoTIFF): Promise<void> {
    console.log(geotiff.getImageCount());
    const image: GeoTIFFImage = await geotiff.getImage();
    console.log({
      width: image.getWidth(),
      height: image.getHeight(),
      tileWidth: image.getTileWidth(),
      tileHeight: image.getTileHeight()
    });
    const data = await image.readRasters();
    console.log(data);
  }

  private fileLoading(fileBuffer: ArrayBuffer): void {
    console.log('geotiffService.fileLoading');
    fromArrayBuffer(fileBuffer).then((geotiff: GeoTIFF) => {
      this.printInformation(geotiff);
    });
  }

  // geotiffToChunk(geotiff: GeoTIFF): Chunk {
  //   geotiff.getSlice()
  //   return new Chunk(tiles);
  // }
}
