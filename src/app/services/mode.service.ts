import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ModeService {

// tslint:disable-next-line: variable-name
  private _mode: string;

  constructor(private api: ApiService) {
    this.api.getMode().subscribe(mode => this._mode = mode.mode);
  }

  public set mode(mode: string) {
    this._mode = mode;
    this.api.setMode(mode).subscribe();
  }

  public get mode(): string {
    return this._mode;
  }

}
