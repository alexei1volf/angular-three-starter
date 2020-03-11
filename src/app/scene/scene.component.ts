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
  SpotLight, HemisphereLight, AmbientLight, SpotLightHelper, BoxGeometry, MeshStandardMaterial, Mesh, Color, Euler
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

    const ambientLight = new AmbientLight(0xa0a0a0, 0.5);
    this.scene.add(ambientLight);

    const spotLight = new SpotLight( 0xffffff, 0.5);
    spotLight.position.set( -50, 50, 50 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    this.scene.add(spotLight);

    const aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView, aspectRatio, this.nearClippingPane, this.farClippingPane);
    this.camera.position.x = 50;
    this.camera.position.y = 50;
    this.camera.position.z = 100;

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setClearColor(0x3a3030, 1);
    this.renderer.autoClear = true;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;

    const geo = new BoxGeometry(10, 5, 5);
    const mat = new MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 1,
      metalness: 0.1
    });
    const mesh = new Mesh(geo, mat);
    this.scene.add(mesh);

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
