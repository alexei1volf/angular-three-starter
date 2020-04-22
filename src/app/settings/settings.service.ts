import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  roughnessChanged = new BehaviorSubject(0.1);

  constructor() { }

  changeRoughness(value: number) {
    this.roughnessChanged.next(value);
  }
}
