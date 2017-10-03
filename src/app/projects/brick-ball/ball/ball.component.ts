import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Scheduler} from 'rxjs';
import * as Victor from 'victor';
import {TickerService} from "../../../services/ticker.service";

export interface BallConfig {
  directionV: Victor;
  positionV: Victor;
  containerSizeV: Victor;
  index: number;
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
  speed = 300;
  constructor(private el: ElementRef, private tickerService: TickerService) { }

  ngOnInit() {
    this.directionV$ = this.config$
      .combineLatest(this.xWallHitCount$)
      .map(data => {
        const config = data[0];
        const wallHitCount = data[1];
        if (Math.abs(wallHitCount % 2) === 1) { // is an odd number
          return config.directionV.clone().normalize().invertX();
        }
        return config.directionV.clone().normalize();
      });

    this.positionV$ = this.tickerService.get()
      .withLatestFrom(this.directionV$)
      .map(data => {
        const ticker = data[0];
        const directionV = data[1];

        return directionV.clone().multiplyScalar( this.speed * ticker.deltaTime); // deltaPosition
      })
      .scan((a, c) => a.add(c), new Victor(0, 0))
      .withLatestFrom(this.config$)
      .map(data => {
        const deltaPositionV = data[0];
        const config = data[1];
        const indexicalPositionV = config.directionV.clone().normalize().multiplyScalar(config.index * 50);

        return config.positionV.clone()
          .add(deltaPositionV)
          .subtract(indexicalPositionV);
      });

    this.positionV$
      .takeUntil(this.destroyed$)
      .subscribe(positionV => {
        this.el.nativeElement.style.transform = `translate3d(${positionV.x}px, ${positionV.y}px, 0)`;
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
