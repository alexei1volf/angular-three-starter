import {Injectable} from '@angular/core';
import {Scene} from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  scene: Scene;

  constructor() {
    this.scene = new Scene();
  }
}
