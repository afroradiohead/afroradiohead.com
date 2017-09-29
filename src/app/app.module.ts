import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrickBallComponent } from './projects/brick-ball/brick-ball.component';
import { LauncherComponent } from './projects/brick-ball/launcher/launcher.component';
import { BallComponent } from './projects/brick-ball/ball/ball.component';
import {TickerService} from "./services/ticker.service";

@NgModule({
  declarations: [
    AppComponent,
    BrickBallComponent,
    LauncherComponent,
    BallComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [TickerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
