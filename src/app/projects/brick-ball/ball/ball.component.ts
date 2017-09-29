import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Scheduler} from 'rxjs';
import * as Victor from 'victor';
import {TickerService} from "../../../services/ticker.service";

export interface BallConfig {
  directionV: Victor;
  positionV: Victor;
  containerSizeV: Victor;
}

enum X_DIRECTION {LEFT, RIGHT}

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit, OnDestroy {
  config$: BehaviorSubject<BallConfig> = new BehaviorSubject(null);
  destroyed$: Subject<boolean> = new Subject();
  @Input() set config(v: BallConfig) {
    this.config$.next(v);
  }
  xWallHitCount$: BehaviorSubject<number> = new BehaviorSubject(0);
  positionV$: Observable<Victor>;
  directionV$: Observable<Victor>;
  speedPerSecond = 300;
  constructor(private el: ElementRef, private tickerService: TickerService) { }

  ngOnInit() {
    this.directionV$ = this.config$
      .combineLatest(this.xWallHitCount$)
      .map(data => {
        const config = data[0];
        const wallHitCount = data[1];
        if (Math.abs(wallHitCount % 2) === 1) { // is an odd number
          return config.directionV.normalize().clone().invertX();
        }
        return config.directionV.clone().normalize();
      })
      .takeUntil(this.destroyed$);


    let position = new Victor(0, 0);

    this.positionV$ = this.tickerService.get()
      .withLatestFrom(this.directionV$, this.config$.do(config => position = config.positionV))
      .map(data => {
        const ticker = data[0];
        const directionV = data[1];

        position = directionV.clone() //@todo eww
          .multiplyScalar( this.speedPerSecond * ticker.deltaTime)
          .add(position);
        return position;
      })
      .takeUntil(this.destroyed$);


    this.positionV$
      .takeUntil(this.destroyed$)
      .subscribe(positionV => {
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
      .skip(1)
      .filter(v => v !== null)
      .scan(function(acc) { return acc + 1; }, 0)
      .takeUntil(this.destroyed$)
      .subscribe(v => this.xWallHitCount$.next(v));
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
