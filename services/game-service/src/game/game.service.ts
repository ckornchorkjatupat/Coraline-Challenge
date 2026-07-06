import { Inject, Injectable } from '@nestjs/common';
import { Action, GameResult } from './types/action.type';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GameService {
  constructor(@Inject('SCORE_SERVICE') private readonly client: ClientProxy) {}

  private beats: Record<Action, Action> = {
    ROCK: 'SCISSORS',
    PAPER: 'ROCK',
    SCISSORS: 'PAPER',
  };

  async play(playerAction: Action, playerId: string) {
    const actions: Action[] = ['ROCK', 'PAPER', 'SCISSORS'];
    const botAction = actions[Math.floor(Math.random() * 3)];

    let result: GameResult = 'DRAW';
    if (botAction !== playerAction) {
      result = this.beats[playerAction] == botAction ? 'WIN' : 'LOSE';
    }

    if (result === 'WIN' || result === 'LOSE') {
      const event = result === 'WIN' ? 'game.won' : 'game.lost';
      try {
        await firstValueFrom(this.client.emit(event, { playerId }));
      } catch (err) {
        console.error(`Failed to publish ${event}:`, err);
      }
    }

    return { botAction, result };
  }
}
