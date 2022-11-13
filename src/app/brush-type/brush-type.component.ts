import { Component, OnInit } from '@angular/core';
import { BrushService } from '../common/services/brush/brush.service';

@Component({
  selector: 'app-brush-type',
  templateUrl: './brush-type.component.html',
  styleUrls: ['./brush-type.component.scss']
})
export class BrushTypeComponent implements OnInit {
  constructor(public brushService: BrushService) {}

  ngOnInit(): void {}

  public onPaintModeClick(): void {
    this.brushService.setPaintMode(true);
  }

  public onElevationModeClick(): void {
    this.brushService.setPaintMode(false);
  }
}
