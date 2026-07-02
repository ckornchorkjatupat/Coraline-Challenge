import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SCORE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'score_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
