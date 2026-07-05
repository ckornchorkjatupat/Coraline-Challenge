import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { ScoreGateway } from './score.gateway';

@Injectable()
export class ScoreService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly scoreGateway: ScoreGateway,
  ) {}

  async getScores(playerId: string): Promise<{
    currentScore: number;
    highScore: number;
  }> {
    const player = await this.playerService.findOrCreate(playerId);
    return { currentScore: player.currentScore, highScore: player.highScore };
  }

  async resetScore(playerId: string): Promise<void> {
    const player = await this.playerService.findOrCreate(playerId);
    player.currentScore = 0;

    await this.playerService.save(player);
  }

  async incrementScore(playerId: string): Promise<void> {
    const player = await this.playerService.findOrCreate(playerId);
    player.currentScore += 1;

    if (player.currentScore > player.highScore) {
      player.highScore = player.currentScore;
      this.scoreGateway.broadcastHighScore(player.highScore);
    }

    await this.playerService.save(player);
  }
}
