import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { GameService } from './game.service';
import { randomUUID } from 'crypto'; // built-in ไม่ต้องลง uuid package เพิ่ม
import { PlayActionDto } from './dto/play-action.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('play')
  async play(
    @Body() body: PlayActionDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    let playerId = req.cookies?.['playerId'];
    if (!playerId) {
      playerId = randomUUID();
      res.cookie('playerId', playerId, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        path: '/',
      });
    }

    return this.gameService.play(body.action, playerId);
  }
}
