import { Component, OnInit } from '@angular/core';
import { BrushService } from '../common/services/brush/brush.service';

@Component({
  selector: 'app-brush-type',
  templateUrl: './brush-type.component.html',
  styleUrls: ['./brush-type.component.scss']
})
export class BrushTypeComponent implements OnInit {
  constructor(protected brushService: BrushService) {}

  ngOnInit(): void {}

  protected onPaintModeClick(): void {
    this.brushService.paintMode = true;
  }

  protected onElevationModeClick(): void {
    this.brushService.paintMode = false;
  }
}
