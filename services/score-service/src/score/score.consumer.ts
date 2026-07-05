import { Controller } from '@nestjs/common';
import { ScoreService } from './score.service';
import { EventPattern, Payload } from '@nestjs/microservices';

// Microservice Listener
@Controller()
export class ScoreConsumer {
  constructor(private readonly scoreService: ScoreService) {}

  @EventPattern('game.won')
  async handleGameWon(@Payload() data: { playerId: string }) {
    await this.scoreService.incrementScore(data.playerId);
  }

  @EventPattern('game.lost')
  async handleGameLost(@Payload() data: { playerId: string }) {
    await this.scoreService.resetScore(data.playerId);
  }
}
