import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
    AmbientLight,
    BoxGeometry,
    DirectionalLight,
    HemisphereLight,
    Mesh,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    SpotLight,
    TextureLoader,
    WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {fromEvent, Subscription} from 'rxjs';
import {SettingsService} from '../settings/settings.service';
import {ColorGUIHelper} from '../colorGUIHelper';
import {GUI} from 'dat.gui';

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

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    constructor(public settingsService: SettingsService) {
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
        this.scene = new Scene();
        const gui = new GUI();

        const ambientLight = new AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);

        gui.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
        gui.add(ambientLight, 'intensity', 0, 1);

        const hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 0.1 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 100, 0 );
        this.scene.add(hemiLight);

        gui.addColor(new ColorGUIHelper(hemiLight, 'color'), 'value').name('color');
        gui.add(hemiLight, 'intensity', 0, 1);

        const dirLight = new DirectionalLight( 0xffffff, 0.1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( - 1, 2, 1 );
        dirLight.position.multiplyScalar( 30 );
        this.scene.add(dirLight);

        gui.addColor(new ColorGUIHelper(dirLight, 'color'), 'value').name('color');
        gui.add(dirLight, 'intensity', 0, 1);

        const spotLight = new SpotLight(0xffffff, 1);
        spotLight.position.set(-50, 50, 50);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;
        this.scene.add(spotLight);

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

        const loader = new TextureLoader();
        const map = loader.load('assets/texture/Rock025_2K-JPG/Rock025_2K_Color.jpg');
        const normalMap = loader.load('assets/texture/Rock025_2K-JPG/Rock025_2K_Normal.jpg');
        const roughnessMap = loader.load('assets/texture/Rock025_2K-JPG/Rock025_2K_Roughness.jpg');

        const geo = new BoxGeometry(10, 10, 10);

        const mat0 = new MeshStandardMaterial({
            color: 0xdddddd,
            roughness: 0.5,
            metalness: 0.5,
        });
        const mesh0 = new Mesh(geo, mat0);
        mesh0.castShadow = true;
        mesh0.receiveShadow = true;
        mesh0.position.set(-20, 0, 0);
        this.scene.add(mesh0);

        gui.addColor(new ColorGUIHelper(mat0, 'color'), 'value').name('color');
        gui.add(mat0, 'roughness', 0, 1);
        gui.add(mat0, 'metalness', 0, 1);

        const mat1 = new MeshStandardMaterial({
            map
        });
        const mesh1 = new Mesh(geo, mat1);
        mesh1.castShadow = true;
        mesh1.receiveShadow = true;
        mesh1.position.set(-10, 0, 0);
        this.scene.add(mesh1);

        const mat2 = new MeshStandardMaterial({
            map,
            normalMap
        });
        const mesh2 = new Mesh(geo, mat2);
        mesh2.castShadow = true;
        mesh2.receiveShadow = true;
        mesh2.position.set(0, 0, 0);
        this.scene.add(mesh2);

        const mat3 = new MeshStandardMaterial({
            map,
            normalMap,
            roughnessMap
        });
        const mesh3 = new Mesh(geo, mat3);
        mesh3.castShadow = true;
        mesh3.receiveShadow = true;
        mesh3.position.set(10, 0, 0);
        this.scene.add(mesh3);


        const mat4 = new MeshPhysicalMaterial( {
            clearcoat: 1.0,
            clearcoatRoughness: 0.5,
            map,
            normalMap
        } );

        gui.add(mat4, 'clearcoat', 0, 1);
        gui.add(mat4, 'clearcoatRoughness', 0, 1);

        const mesh4 = new Mesh(geo, mat4);
        mesh4.position.set(-30, 0, 0);
        this.scene.add(mesh4);

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
