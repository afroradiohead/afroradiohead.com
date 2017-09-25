import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementsBoardGameComponent } from './elements-board-game.component';

describe('ElementsBoardGameComponent', () => {
  let component: ElementsBoardGameComponent;
  let fixture: ComponentFixture<ElementsBoardGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementsBoardGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementsBoardGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


});
