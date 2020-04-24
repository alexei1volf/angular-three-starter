import {Injectable} from '@angular/core';
import {Object3D, Scene} from 'three';

@Injectable({
    providedIn: 'root'
})
export class SceneService {

    scene: Scene;
    objects: Object3D[] = [];

    constructor() {
        this.scene = new Scene();
    }

    add(object: Object3D) {
        this.scene.add(object);
        this.objects.push(object);
    }

    clean() {
        this.objects.forEach(o => {
            this.scene.remove(o);
        });
        this.objects.length = 0;

    }
}
