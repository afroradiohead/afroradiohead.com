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

enum X_DIRECTION {LEFT, RIGHT};

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {
  positionV$: Observable<Victor>;
  config$: BehaviorSubject<BallConfig> = new BehaviorSubject(null);
  @Input() set config(v: BallConfig) {
    this.config$.next(v);
  }
  directionV$: Observable<Victor>;
  speedPerSecond = 500;
  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.directionV$ = this.config$
      .map(config => config.directionV.normalize())
      .withLatestFrom()

    let position = new Victor(0, 0);

    this.positionV$ = ticker$
      .withLatestFrom(
        this.config$.do(config => position = config.positionV),
        (ticker, config) => {
          let directionV = config.directionV.normalize().clone();

          // if(invertX){
          //   directionV = directionV.invertX();
          // }
          position = config.directionV.normalize().clone()
            .invertX()
            // .invertY()
            .multiplyScalar( this.speedPerSecond * ticker.deltaTime)
            .add(position); //@todo eww
          return position;
        });

    // this.XDirection$ =
    //   Observable.of(X_DIRECTION.RIGHT)
    //     .combineLatest(
    //       this.positionV$,
    //       this.config$,
    //       (xDirection, positionV, configV) => {
    //         if(positionV >= configV.containerSizeV.x) {
    //           return X_DIRECTION.LEFT;
    //         }
    //       }
    //     );
    // Observable.of(new Victor(1, 1))
    //   .withLatestFrom(poition)
    // this.positionV$.withLatestFrom(
    //   this.config$,
    //   (positionV, configV) => {
    //     if(positionV.x )
    //     if(positionV.X, configV.containerSizeV.x)
    //   }
    // )


    this.positionV$.subscribe(positionV => {
      this.el.nativeElement.style.left = `${positionV.x}px`;
      this.el.nativeElement.style.top = `${positionV.y}px`;
    });
  }

}
