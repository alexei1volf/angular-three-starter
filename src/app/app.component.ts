import {Component, OnInit} from '@angular/core';
import {SceneService} from './scene/scene.service';
import {Color, Mesh, MeshStandardMaterial, SphereBufferGeometry, TextureLoader} from 'three';
import {Texture} from 'three/src/textures/Texture';
import {ColorGUIHelper} from './colorGUIHelper';
import {SettingsService} from './settings/settings.service';

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
    gius: Object[] = [];

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
        const geometry = new SphereBufferGeometry(100, 32, 16);
        const material = new MeshStandardMaterial({
            color: 0x3a3030,
            metalness: 0.1,
            roughness: 1.0
        });
        const mesh = new Mesh(geometry, material);
        this.sceneService.scene.add(mesh);

        const gui = this.settingsService.gui;
        const colorGUIHelper = new ColorGUIHelper(material, 'color');
        gui.addColor(colorGUIHelper, 'value').name('color');
    }

    onMetalnessClick() {
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

                    this.sceneService.scene.add(mesh);
                }
            }
        }
    }
}
