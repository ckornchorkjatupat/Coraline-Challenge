import { Module } from '@nestjs/common';
import { ScoreModule } from './score/score.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './player/entities/player.entity';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'rps_game',
      entities: [Player],
      synchronize: false,
      migrations: ['dist/migrations/*.js'],
    }),
    ScoreModule,
    PlayerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
