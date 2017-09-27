import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Scheduler} from 'rxjs';
import * as Victor from 'victor';

export interface BallConfig {
  directionV: Victor;
  positionV: Victor;
}

const TICKER_INTERVAL = 0;

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
    this.config$.subscribe(e => console.log(e));
    this.directionV$ = this.config$
      .map(config => config.directionV.normalize());

    let position = new Victor(0, 0);

    this.positionV$ = ticker$
      .withLatestFrom(
        this.config$.do(config => position = config.positionV),
        (ticker, config) => {
          position = config.directionV.normalize().clone().multiplyScalar( this.speedPerSecond * ticker.deltaTime).add(position);
          return position;
        });


    this.positionV$.subscribe(positionV => {
      this.el.nativeElement.style.left = `${positionV.x}px`;
      this.el.nativeElement.style.top = `${positionV.y}px`;
    });
  }

}
