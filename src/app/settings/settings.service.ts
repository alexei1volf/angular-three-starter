import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  roughnessChanged = new BehaviorSubject(0.1);
  metalnessChanged = new BehaviorSubject(0.5);

  constructor() { }

  changeRoughness(value: number) {
    this.roughnessChanged.next(value);
  }

  changeMetalness(value: number) {
    this.metalnessChanged.next(value);
  }
}
