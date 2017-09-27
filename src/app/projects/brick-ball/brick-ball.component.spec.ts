import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickBallComponent } from './brick-ball.component';

describe('BrickBallComponent', () => {
  let component: BrickBallComponent;
  let fixture: ComponentFixture<BrickBallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrickBallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrickBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
