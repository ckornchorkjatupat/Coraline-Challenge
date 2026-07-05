import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('session')
  async getSession(
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

    const player = await this.playerService.findOrCreate(playerId);

    return {
      currentScore: player.currentScore,
      highScore: player.highScore,
    };
  }
}
