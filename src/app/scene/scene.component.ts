import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AmbientLight, DirectionalLight, HemisphereLight, PCFSoftShadowMap, PerspectiveCamera, SpotLight, WebGLRenderer} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {fromEvent, Subscription} from 'rxjs';
import {SettingsService} from '../settings/settings.service';
import {ColorGUIHelper} from '../colorGUIHelper';
import {SceneService} from './scene.service';

@Component({
    selector: 'app-scene',
    templateUrl: './scene.component.html',
    styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('canvas')
    public canvasRef: ElementRef;
    public fieldOfView = 60;
    public nearClippingPane = 1;
    public farClippingPane = 1100;

    private renderer: WebGLRenderer;
    private camera: PerspectiveCamera;
    private controls: OrbitControls;
    private subs: Subscription[] = [];

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    constructor(public settingsService: SettingsService,
                public sceneService: SceneService) {
    }

    ngOnInit(): void {
        this.subs.push(
            fromEvent(window, 'resize').subscribe(event => this.onResize(event)),
            // this.settingsService.roughnessChanged.subscribe(roughness => this.mat.roughness = roughness),
            // this.settingsService.metalnessChanged.subscribe(metalness => this.mat.metalness = metalness)
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    ngAfterViewInit() {
        const scene = this.sceneService.scene;
        const gui = this.settingsService.gui;

        const ambientLight = new AmbientLight(0x222222, 0.1);
        scene.add(ambientLight);
        gui.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
        gui.add(ambientLight, 'intensity', 0, 1);

        const hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 0.1 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 100, 0 );
        scene.add(hemiLight);
        gui.addColor(new ColorGUIHelper(hemiLight, 'color'), 'value').name('color');
        gui.add(hemiLight, 'intensity', 0, 1);

        const dirLight = new DirectionalLight( 0xffffff, 0.5 );
        dirLight.position.set( 1, 1, 1 ).normalize();
        scene.add(dirLight);
        gui.addColor(new ColorGUIHelper(dirLight, 'color'), 'value').name('color');
        gui.add(dirLight, 'intensity', 0, 1);

        const spotLight = new SpotLight(0xffffff, 1);
        spotLight.position.set(-200, 500, 100);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;
        scene.add(spotLight);
        gui.addColor(new ColorGUIHelper(spotLight, 'color'), 'value').name('color');
        gui.add(spotLight, 'intensity', 0, 2);

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
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.autoClear = true;

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;

        this.startRendering();
    }

    private startRendering() {
        requestAnimationFrame(() => this.startRendering());
        this.render();
    }

    private render() {
        this.renderer.render(this.sceneService.scene, this.camera);
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
