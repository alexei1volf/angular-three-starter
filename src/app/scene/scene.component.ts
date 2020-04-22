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
    SpotLight, HemisphereLight, AmbientLight, SpotLightHelper, BoxGeometry, MeshStandardMaterial, Mesh, Color, Euler, Geometry, Object3D
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {SettingsService} from '../settings/settings.service';

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
    private subs: Subscription[] = [];
    private mesh: Mesh;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    constructor(public settingsService: SettingsService) {
    }

    ngOnInit(): void {
        this.subs.push(
            fromEvent(window, 'resize').subscribe(event => this.onResize(event)),
            this.settingsService.roughnessChanged.subscribe(roughness => {
                if (this.mesh) {
                    this.mesh.material.roughness = roughness;
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    ngAfterViewInit() {
        this.scene = new Scene();

        const ambientLight = new AmbientLight(0xa0a0a0, 5);
        this.scene.add(ambientLight);

        const spotLight = new SpotLight(0xffffff, 5);
        spotLight.position.set(50, 50, 50);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;
        this.scene.add(spotLight);

        const aspectRatio = this.getAspectRatio();
        this.camera = new PerspectiveCamera(this.fieldOfView, aspectRatio, this.nearClippingPane, this.farClippingPane);
        this.camera.position.x = 10;
        this.camera.position.y = 10;
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

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;

        const loader = new GLTFLoader();
        loader.load('assets/gltf/damaged-helmet/DamagedHelmet.gltf', (gltf) => {
            const scene = gltf.scene;
            const helmet3dModel = scene.children[0];
            helmet3dModel.scale.copy(new Vector3(30, 30, 30));
            this.scene.add(helmet3dModel);
            this.mesh = helmet3dModel;
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
