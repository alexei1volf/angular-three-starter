import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { WebGLRenderer, PerspectiveCamera, Vector3, Scene, AxesHelper, PointLight, PCFSoftShadowMap} from 'three';
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
    this.scene.add(new AxesHelper(200));

    const light1 = new PointLight(0xffffff, 1, 1000);
    light1.position.set(0, 0, 100);
    this.scene.add(light1);

    const light2 = new PointLight(0xffffff, 1, 1000);
    light2.position.set(0, 0, -100);
    this.scene.add(light2);

    const aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView, aspectRatio, this.nearClippingPane, this.farClippingPane);
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 100;

    this.renderer = new WebGLRenderer({canvas: this.canvas, antialias: true});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.autoClear = true;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;

    const loader = new GLTFLoader();
    loader.load('assets/gltf/damaged-helmet//DamagedHelmet.gltf', (gltf) => {
      this.scene.add(gltf.scene);
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
