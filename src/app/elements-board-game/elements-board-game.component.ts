import { Component, OnInit } from '@angular/core';
import * as Rx from 'rxjs';

class Card {
  element = 'water';
}

class Deck {
  cardList = [new Card()];

  constructor(game: Game) {

  }
}

class Player {
  static GIVECARD = new Rx.Subject();
  hp = 10;
  cardList = [];

  constructor(game: Game) {


  }
}


class Game {
  playerList: Array<Player> = [new Player(this), new Player(this)];
  deck = new Deck(this);

  constructor() {

    //Game.prepping
    this.deck.giveCard(this.playerList[0]); //all players

    //game.playing
    this.playerList.onPlay.subscribe();
  }


  onKeyup(){

    //game.playing
    if (space) {
      this.currentPlayer.playCard();
    }else if(left){
      this.currentPlayer.selectLeftCard();
    }else if(right){
      this.currentPlayer.selectRightCard();
    }


  }
}

@Component({
  selector: 'app-elements-board-game',
  templateUrl: './elements-board-game.component.html',
  styleUrls: ['./elements-board-game.component.scss']
})
export class ElementsBoardGameComponent implements OnInit {



  constructor() { }

  ngOnInit() {
    const game = new Game();
  }

}
