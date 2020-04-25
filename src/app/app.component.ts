import {Component, OnInit} from '@angular/core';
import {SceneService} from './scene/scene.service';
import {Color, Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereBufferGeometry, TextureLoader, Vector3} from 'three';
import {Texture} from 'three/src/textures/Texture';
import {ColorGUIHelper} from './colorGUIHelper';
import {SettingsService} from './settings/settings.service';
import {GUI} from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'angular-three-starter';

    map: Texture;
    normalMap: Texture;
    roughnessMap: Texture;
    tempGui: GUI;

    constructor(public sceneService: SceneService,
                public settingsService: SettingsService) {
    }

    ngOnInit(): void {
        const loader = new TextureLoader();
        this.map = loader.load('assets/texture/Rock025_2K-JPG/Rock025_2K_Color.jpg');
        this.normalMap = loader.load('assets/texture/Rock025_2K-JPG/Rock025_2K_Normal.jpg');
        this.roughnessMap = loader.load('assets/texture/Rock025_2K-JPG/Rock025_2K_Roughness.jpg');
    }

    onColourClick() {
        this.clean();

        const geometry = new SphereBufferGeometry(100, 32, 16);
        const material1 = new MeshBasicMaterial({
            color: 0x3a3030
        });
        const material2 = new MeshStandardMaterial({
            color: 0x3a3030,
            metalness: 0.1,
            roughness: 1.0
        });

        const mesh1 = new Mesh(geometry, material1);
        mesh1.position.set(-100, 0, 0);
        this.sceneService.add(mesh1);
        const mesh2 = new Mesh(geometry, material2);
        mesh2.position.set(100, 0, 0);
        this.sceneService.add(mesh2);

        this.tempGui = new GUI();
        const colorGUIHelper1 = new ColorGUIHelper(material1, 'color');
        this.tempGui.addColor(colorGUIHelper1, 'value').name('color');
        const colorGUIHelper2 = new ColorGUIHelper(material1, 'color');
        this.tempGui.addColor(colorGUIHelper2, 'value').name('color');
        this.tempGui.add(material2, 'metalness', 0, 1);
        this.tempGui.add(material2, 'roughness', 0, 1);
    }

    onNormalMapVolumeClick() {
        this.clean();

        const loader = new GLTFLoader();
        loader.load('assets/gltf/normal-tangent-test/NormalTangentTest.gltf', (gltf) => {
            const scene = gltf.scene;
            const mesh = scene.children[0];
            mesh.scale.copy(new Vector3(150, 150, 150));
            this.sceneService.add(mesh);
        });
    }


    onNormalMapTextureClick() {
        this.clean();

        const geometry = new SphereBufferGeometry(100, 32, 16);
        const material = new MeshStandardMaterial({
            map: this.map
        });
        const materialNorm = new MeshStandardMaterial({
            map: this.map,
            normalMap: this.normalMap
        });
        const mesh1 = new Mesh(geometry, material);
        mesh1.position.set(-100, 0, 0);
        this.sceneService.add(mesh1);
        const mesh2 = new Mesh(geometry, materialNorm);
        mesh2.position.set(100, 0, 0);
        this.sceneService.add(mesh2);
    }

    onMetalnessClick() {
        this.clean();

        const bumpScale = 1;
        const cubeWidth = 400;
        const numberOfSphersPerSide = 5;
        const sphereRadius = (cubeWidth / numberOfSphersPerSide) * 0.8 * 0.5;
        const stepSize = 1.0 / numberOfSphersPerSide;

        const geometry = new SphereBufferGeometry(sphereRadius, 32, 16);

        for (let alpha = 0; alpha <= 1.0; alpha += stepSize) {
            for (let beta = 0; beta <= 1.0; beta += stepSize) {
                for (let gamma = 0; gamma <= 1.0; gamma += stepSize) {

                    // basic monochromatic energy preservation
                    const diffuseColor = new Color().setHSL(alpha, 0.5, gamma * 0.5 + 0.1);

                    const material = new MeshStandardMaterial({
                        map: this.map,
                        bumpMap: this.map,
                        bumpScale,
                        color: diffuseColor,
                        metalness: beta,
                        roughness: 1.0 - alpha
                    });

                    const mesh = new Mesh(geometry, material);

                    mesh.position.x = alpha * 400 - 200;
                    mesh.position.y = beta * 400 - 200;
                    mesh.position.z = gamma * 400 - 200;

                    this.sceneService.add(mesh);
                }
            }
        }
    }

    private clean() {
        if (this.tempGui) {
            this.tempGui.destroy();
            this.tempGui = undefined;
        }
        this.sceneService.clean();
    }
}
