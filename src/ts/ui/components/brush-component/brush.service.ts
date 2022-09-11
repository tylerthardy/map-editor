import { injectable } from 'inversify';
import { BehaviorSubject } from 'rxjs';

@injectable()
export class BrushService {
  brushSize: number = 1;
  brushSizeChanged: BehaviorSubject<number> = new BehaviorSubject<number>(this.brushSize);

  constructor() {}

  public setBrushSize(size: number): void {
    this.brushSize = size;
    this.brushSizeChanged.next(size);
  }

  public incrementBrushSize(): void {
    this.setBrushSize(this.brushSize + 1);
  }

  public decrementBrushSize(): void {
    this.setBrushSize(this.brushSize - 1);
  }
}
