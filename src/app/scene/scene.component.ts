import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  WebGLRenderer,
  PerspectiveCamera,
  Vector3,
  Scene,
  AxesHelper,
  PointLight,
  PCFSoftShadowMap,
  DirectionalLight,
  SpotLight, HemisphereLight, AmbientLight, SpotLightHelper
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas')
  public canvasRef: ElementRef;
  public scene: Scene;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1100;

  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private resizeSubscription: Subscription;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor() { }

  ngOnInit(): void {
    this.resizeSubscription = fromEvent(window, 'resize').subscribe(event => this.onResize(event));
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.scene = new Scene();

    const ambientLight = new AmbientLight(0xa0a0a0, 2);
    this.scene.add(ambientLight);

    const spotLight = new SpotLight( 0xffffff);
    spotLight.position.set( 100, 1000, 100 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.scene.add(spotLight);
    this.scene.add(new SpotLightHelper(spotLight));

    const spotLight2 = new SpotLight( 0xffebda, 1, 1000, 0.9);
    spotLight2.position.set( 100, 100, 100 );
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 1024;
    spotLight2.shadow.mapSize.height = 1024;
    this.scene.add(spotLight2);
    this.scene.add(new SpotLightHelper(spotLight2));

    const aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView, aspectRatio, this.nearClippingPane, this.farClippingPane);
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 100;

    this.renderer = new WebGLRenderer({
      canvas: this.canvas
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;

    const loader = new GLTFLoader();
    loader.load('assets/gltf/damaged-helmet//DamagedHelmet.gltf', (gltf) => {
      const scene = gltf.scene;
      const helmet3dModel = scene.children[0];
      helmet3dModel.scale.copy(new Vector3(30, 30, 30));
      this.scene.add(helmet3dModel);
    });
    this.startRendering();
  }

  private startRendering() {
    requestAnimationFrame(() => this.startRendering());
    this.render();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private getAspectRatio(): number {
    const height = this.canvas.clientHeight;
    if (height === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private onResize(event: Event) {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.render();
  }

}
