import { Inject, Injectable } from '@nestjs/common';
import { Action, GameResult } from './types/action.type';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GameService {
  constructor(@Inject('SCORE_SERVICE') private readonly client: ClientProxy) {}

  private beats: Record<Action, Action> = {
    ROCK: 'SCISSORS',
    PAPER: 'ROCK',
    SCISSORS: 'PAPER',
  };

  play(playerAction: Action, playerId: string) {
    const actions: Action[] = ['ROCK', 'PAPER', 'SCISSORS'];
    const botAction = actions[Math.floor(Math.random() * 3)];

    let result: GameResult = 'DRAW';
    if (botAction !== playerAction) {
      result = this.beats[playerAction] == botAction ? 'WIN' : 'LOSE';
    }
    if (result === 'WIN') {
      this.client.emit('game.won', { playerId });
    } else if (result === 'LOSE') {
      this.client.emit('game.lost', { playerId });
    }

    return { botAction, result };
  }
}
