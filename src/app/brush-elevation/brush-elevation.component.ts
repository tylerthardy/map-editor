import { Component, OnInit } from '@angular/core';
import { BrushService } from '../common/services/brush/brush.service';

@Component({
  selector: 'app-brush-elevation',
  templateUrl: './brush-elevation.component.html',
  styleUrls: ['./brush-elevation.component.scss']
})
export class BrushElevationComponent implements OnInit {
  constructor(public brushService: BrushService) {}

  ngOnInit(): void {}

  public onPlusClick(): void {
    this.brushService.setBrushElevation(this.brushService.brushElevation + 1);
  }

  public onMinusClick(): void {
    this.brushService.setBrushElevation(this.brushService.brushElevation - 1);
  }
}
