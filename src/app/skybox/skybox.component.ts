import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
    AmbientLight,
    BackSide,
    BoxBufferGeometry,
    CubeTextureLoader,
    Mesh,
    MeshLambertMaterial,
    PerspectiveCamera,
    Scene,
    ShaderLib,
    ShaderMaterial,
    SphereBufferGeometry,
    SphericalReflectionMapping,
    sRGBEncoding,
    TextureLoader,
    WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {fromEvent, Subscription} from 'rxjs';
import {ColorGUIHelper} from '../colorGUIHelper';
import {GUI} from 'dat.gui';

@Component({
    selector: 'app-skybox',
    templateUrl: './skybox.component.html',
    styleUrls: ['./skybox.component.scss']
})
export class SkyboxComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('canvas')
    public canvasRef: ElementRef;
    private renderer: WebGLRenderer;
    private camera: PerspectiveCamera;
    private controls: OrbitControls;
    private scene: Scene;
    private cubeScene: Scene;
    private cubeCamera: PerspectiveCamera;
    private subs: Subscription[] = [];

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    constructor() {
    }

    ngOnInit(): void {
        this.subs.push(
            fromEvent(window, 'resize').subscribe(event => this.onResize(event)),
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    ngAfterViewInit() {
        this.scene = new Scene();
        this.cubeScene = new Scene();
        const gui = new GUI();

        const ambientLight = new AmbientLight(0xffffff);
        this.scene.add(ambientLight);
        gui.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
        gui.add(ambientLight, 'intensity', 0, 1);

        const aspectRatio = this.getAspectRatio();
        this.camera = new PerspectiveCamera(70, aspectRatio, 1, 100000);
        this.camera.position.set(0, 0, 1000);
        this.cubeCamera = new PerspectiveCamera(70, aspectRatio, 1, 100000);

        this.renderer = new WebGLRenderer({
            canvas: this.canvas
        });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.autoClear = false;
        this.renderer.outputEncoding = sRGBEncoding;

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;


        const r = 'assets/texture/cube/Bridge2/';
        const urls = [r + 'posx.jpg', r + 'negx.jpg',
            r + 'posy.jpg', r + 'negy.jpg',
            r + 'posz.jpg', r + 'negz.jpg'];

        const textureCube = new CubeTextureLoader().load(urls);
        textureCube.encoding = sRGBEncoding;

        const textureLoader = new TextureLoader();
        const textureSphere = textureLoader.load('assets/texture/metal.jpg');
        textureSphere.mapping = SphericalReflectionMapping;
        textureSphere.encoding = sRGBEncoding;

        // material
        const cubeShader = ShaderLib.cube;
        const cubeMaterial = new ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: BackSide
        });

        (cubeMaterial as any).envMap = textureCube;

        // skybox
        const cubeMesh = new Mesh(new BoxBufferGeometry(100, 100, 100), cubeMaterial);
        this.cubeScene.add(cubeMesh);

        const geometry = new SphereBufferGeometry(400.0, 48, 24);
        const sphereMaterial = new MeshLambertMaterial({envMap: textureCube});
        const sphereMesh = new Mesh(geometry, sphereMaterial);
        this.scene.add(sphereMesh);

        this.startRendering();
    }

    private startRendering() {
        requestAnimationFrame(() => this.startRendering());
        this.render();
    }

    private render() {
        this.camera.lookAt(this.scene.position);
        this.cubeCamera.rotation.copy(this.camera.rotation);

        this.renderer.render(this.scene, this.camera);
        this.renderer.render(this.cubeScene, this.cubeCamera);
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
