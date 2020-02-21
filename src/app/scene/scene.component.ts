import { Component, OnInit } from '@angular/core';
import { WebGLRenderer, PerspectiveCamera, Vector3, Scene} from 'three';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {
  public scene: Scene;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1100;

  private rendered: WebGLRenderer;
  private camera: PerspectiveCamera;

  constructor() { }

  ngOnInit() {
  }

}
