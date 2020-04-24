import {Component} from '@angular/core';
import {SceneService} from './scene/scene.service';
import {Color, Mesh, MeshStandardMaterial, SphereBufferGeometry, TextureLoader} from 'three';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'angular-three-starter';

    constructor(public sceneService: SceneService) {
    }

    onMetalnessClick() {
        const loader = new TextureLoader();
        const map = loader.load('assets/texture/Rock025_2K-JPG/Rock025_2K_Color.jpg');
        const normalMap = loader.load('assets/texture/Rock025_2K-JPG/Rock025_2K_Normal.jpg');
        const roughnessMap = loader.load('assets/texture/Rock025_2K-JPG/Rock025_2K_Roughness.jpg');

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
                        map,
                        bumpMap: map,
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
