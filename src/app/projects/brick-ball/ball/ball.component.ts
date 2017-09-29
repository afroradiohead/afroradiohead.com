import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Scheduler} from 'rxjs';
import * as Victor from 'victor';

export interface BallConfig {
  directionV: Victor;
  positionV: Victor;
  containerSizeV: Victor;
}

const TICKER_INTERVAL = 0;
const ticker$ = Observable
  .interval(TICKER_INTERVAL, Scheduler.animationFrame)
  .map(() => ({
    time: Date.now(),
    deltaTime: null
  }))
  .scan(
    (previous, current) => ({
      time: current.time,
      deltaTime: (current.time - previous.time) / 1000
    })
  );

enum X_DIRECTION {LEFT, RIGHT, CENTER}

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {
  config$: BehaviorSubject<BallConfig> = new BehaviorSubject(null);
  @Input() set config(v: BallConfig) {
    this.config$.next(v);
  }
  xDirection$: BehaviorSubject<X_DIRECTION> = new BehaviorSubject(X_DIRECTION.CENTER);
  positionV$: Observable<Victor>;
  directionV$: Observable<Victor>;
  speedPerSecond = 300;
  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.directionV$ = this.config$
      .combineLatest(this.xDirection$)
      .map(data => {
        const config = data[0];
        const xDirection = data[1];

        // console.log(xDirection);

        return config.directionV.normalize();
      })

    let position = new Victor(0, 0);

    this.positionV$ = ticker$
      .withLatestFrom(this.directionV$, this.config$.do(config => position = config.positionV))
      .map(data => {
        const ticker = data[0];
        const directionV = data[1];

        position = directionV.clone() //@todo eww
          .multiplyScalar( this.speedPerSecond * ticker.deltaTime)
          .add(position);
        return position;
      });


    this.positionV$.subscribe(positionV => {
      this.el.nativeElement.style.left = `${positionV.x}px`;
      this.el.nativeElement.style.top = `${positionV.y}px`;
    });

    this.positionV$
      .combineLatest(this.config$)
      .map(data => {
        const positionV = data[0];
        const config = data[1];

        if (positionV.x <= 0) {
          return X_DIRECTION.LEFT;
        }
        if (positionV.x >= config.containerSizeV.x) {
          return X_DIRECTION.RIGHT;
        }
        return null;
      })
      .distinctUntilChanged()
      .scan(function(acc) { return acc + 1; }, 0)
      .subscribe(console.log);
  }

}
