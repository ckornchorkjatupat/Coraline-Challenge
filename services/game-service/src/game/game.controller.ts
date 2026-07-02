import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { PlayActionDto } from './dto/play-action.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('play')
  async play(@Body() body: PlayActionDto) {
    return this.gameService.play(body.action);
  }
}
