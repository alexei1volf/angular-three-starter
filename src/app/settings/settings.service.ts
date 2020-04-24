import {Injectable} from '@angular/core';
import {GUI} from 'dat.gui';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _gui: GUI;

  get gui(): GUI {
    return this._gui;
  }

  constructor() {
    this._gui = new GUI();
  }

}
