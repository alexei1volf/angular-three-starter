import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../settings.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  constructor(public settingsService: SettingsService) { }

  ngOnInit(): void {
  }

  onValueChange($event: number) {
    this.settingsService.changeRoughness($event);
    console.log($event);
  }
}
