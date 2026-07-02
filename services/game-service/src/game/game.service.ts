import { Injectable } from '@nestjs/common';
import { Action, GameResult } from './types/action.type';

@Injectable()
export class GameService {
  private beats: Record<Action, Action> = {
    ROCK: 'SCISSORS',
    PAPER: 'ROCK',
    SCISSORS: 'PAPER',
  };

  async play(
    playerAction: Action,
  ): Promise<{ botAction: Action; result: GameResult }> {
    const actions: Action[] = ['ROCK', 'PAPER', 'SCISSORS'];
    const botAction = actions[Math.floor(Math.random() * 3)];

    let result: GameResult = 'DRAW';
    if (botAction !== playerAction) {
      result = this.beats[playerAction] == botAction ? 'WIN' : 'LOSE';
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return { botAction, result };
  }
}
