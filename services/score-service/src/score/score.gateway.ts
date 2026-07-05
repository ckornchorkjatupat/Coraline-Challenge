import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ScoreGateway {
  @WebSocketServer() server: Server;

  broadcastHighScore(newHighScore: number) {
    this.server.emit('highScoreUpdated', newHighScore);
  }
}
