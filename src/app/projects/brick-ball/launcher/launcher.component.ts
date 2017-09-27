import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import * as Victor from 'victor';

export interface LauncherConfig {
  positionV: Victor;
  directionV: Victor;
}

const height = 500;

@Component({
  selector: 'app-launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.scss']
})
export class LauncherComponent implements OnInit {
  config$: Subject<LauncherConfig> = new Subject();
  @Input() set config(v: LauncherConfig) {
    this.config$.next(v);
  }
  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.config$
      .subscribe((config: LauncherConfig) => {
        this.el.nativeElement.style.left = `${config.positionV.x}px`;
        this.el.nativeElement.style.top = `${config.positionV.y}px`;
        this.el.nativeElement.style.width = `${config.directionV.length()}px`;
        this.el.nativeElement.style.transform = `rotateZ(${config.directionV.angleDeg()}deg)`;
    });
  }

}
