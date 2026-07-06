import { Module } from '@nestjs/common';
import { ScoreConsumer } from './score.consumer';
import { ScoreService } from './score.service';
import { ScoreGateway } from './score.gateway';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [PlayerModule],
  controllers: [ScoreConsumer],
  providers: [ScoreService, ScoreGateway],
})
export class ScoreModule {}
