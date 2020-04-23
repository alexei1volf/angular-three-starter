import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../settings.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  roughness: number;
  metalness: number;

  private subs: Subscription[] = [];

  constructor(public settingsService: SettingsService) { }

  ngOnInit(): void {
    this.subs.push(
        this.settingsService.roughnessChanged.subscribe(roughness => this.roughness = roughness),
        this.settingsService.metalnessChanged.subscribe(metalness => this.metalness = metalness)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onRoughnessChanged(value: number) {
    this.settingsService.changeRoughness(value);
  }

  onMetalnessChanged(value: number) {
    this.settingsService.changeMetalness(value);
  }
}
