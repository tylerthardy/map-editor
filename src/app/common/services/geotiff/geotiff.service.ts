import { Injectable } from '@angular/core';
import GeoTIFF, { fromArrayBuffer, GeoTIFFImage } from 'geotiff';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'three';
import { Chunk, Tile } from '../chunk';
const fs = window.require('fs');

@Injectable({
  providedIn: 'root'
})
export class GeotiffService {
  constructor(private toastrService: ToastrService) {}

  public async loadGeotiff(filePath: string): Promise<GeoTIFF> {
    const fileBuffer: ArrayBuffer = fs.readFileSync(filePath);
    const geotiff: GeoTIFF = await fromArrayBuffer(fileBuffer);
    return geotiff;
  }

  public async toastInformation(geotiff: GeoTIFF): Promise<void> {
    const image: GeoTIFFImage = await geotiff.getImage();
    this.toastrService.info(
      JSON.stringify({
        imageCount: geotiff.getImageCount(),
        width: image.getWidth(),
        height: image.getHeight(),
        tileWidth: image.getTileWidth(),
        tileHeight: image.getTileHeight()
      })
    );
  }

  public async geotiffToChunk(
    geotiff: GeoTIFF,
    maxSize: number,
    offsetX: number = 0,
    offsetY: number = 0
  ): Promise<Chunk> {
    const tiles: Tile[] = [];
    const image: GeoTIFFImage = await geotiff.getImage();
    const width: number = image.getWidth() <= Chunk.size ? Chunk.size : maxSize;
    const height: number = image.getHeight() <= Chunk.size ? Chunk.size : maxSize;
    const rasters = await image.readRasters({ window: this.getWindow(offsetX, offsetY, width, height) });
    const raster = rasters[0];

    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        const tile: Tile = new Tile();
        const value = raster[y * width + x];
        tile.topLeftCornerColor = new Color('gray');
        tile.topLeftCornerElevation = (value - 400) * 0.05;
        tiles.push(tile);
      }
    }

    return new Chunk(tiles, width);
  }

  private getWindow(x: number, y: number, width: number, height: number): number[] {
    return [x, y, x + width, y + height];
  }
}
