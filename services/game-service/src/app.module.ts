import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
