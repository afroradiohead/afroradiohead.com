import {Component, ElementRef, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as Victor from 'victor';
import {LauncherConfig} from './launcher/launcher.component';
import {BallConfig} from './ball/ball.component';

@Component({
  selector: 'app-brick-ball',
  templateUrl: './brick-ball.component.html',
  styleUrls: ['./brick-ball.component.scss']
})
export class BrickBallComponent implements OnInit {
  ballConfigList$: Observable<BallConfig[]>;
  launcherConfig$: Observable<LauncherConfig>;
  sizeV$: BehaviorSubject<Victor> = new BehaviorSubject(new Victor(900, 500));

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.launcherConfig$ = Observable.fromEvent(this.el.nativeElement, 'mousemove')
      .combineLatest(this.sizeV$)
      .map(data => {
        const event = <MouseEvent>data[0];
        const sizeV = data[1];
        const launcherPositionV = new Victor(sizeV.x / 2, sizeV.y);
        return {
          positionV: launcherPositionV,
          directionV: Victor.fromArray([event.offsetX, event.offsetY]).subtract(launcherPositionV)
        };
      });
    this.ballConfigList$ = Observable.fromEvent(this.el.nativeElement, 'click')
      .withLatestFrom(this.launcherConfig$, this.sizeV$)
      .map(data => {
        const launcherConfig = data[1];
        const sizeV = data[2];
        return [{
          containerSizeV: sizeV,
          positionV: launcherConfig.positionV,
          directionV: launcherConfig.directionV
        }];
      });

    this.sizeV$
      .subscribe(sizeV => {
        this.el.nativeElement.style.width = `${sizeV.x}px`;
        this.el.nativeElement.style.height = `${sizeV.y}px`;
      });
  }

}
