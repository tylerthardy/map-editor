import { Component, OnInit } from '@angular/core';
import { Color } from 'three';
import { BrushService } from '../common/services/brush/brush.service';
import { ButtonColor } from './button-color';

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss']
})
export class BrushComponent implements OnInit {
  public colorButtons: ButtonColor[] = [
    { name: 'red', color: new Color('red') },
    { name: 'blue', color: new Color('blue') },
    { name: 'green', color: new Color('green') },
    { name: 'yellow', color: new Color('yellow') },
    { name: 'orange', color: new Color('orange') },
    { name: 'white', color: new Color('white') },
    { name: 'magenta', color: new Color('magenta') }
  ];

  constructor(public brushService: BrushService) {}

  ngOnInit(): void {}

  public onButtonColorClick(buttonColor: ButtonColor) {
    this.brushService.setBrushColor(buttonColor.color);
  }
}
