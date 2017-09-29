import { Injectable } from '@angular/core';
import {Observable, Scheduler} from "rxjs";

interface Ticker {
  time: number;
  deltaTime: number;
}

@Injectable()
export class TickerService {
  private ticker$: Observable<Ticker>;

  constructor() {
    const TICKER_INTERVAL = 0;
    this.ticker$ = Observable
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
  }

  get() {
    return this.ticker$;
  }
}
