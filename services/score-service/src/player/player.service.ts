import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
  ) {}

  async findById(id: string): Promise<Player | null> {
    return this.playerRepo.findOne({ where: { id } });
  }

  async create(id: string): Promise<Player> {
    const player = this.playerRepo.create({
      id,
      currentScore: 0,
      highScore: 0,
    });
    return this.playerRepo.save(player);
  }

  async findOrCreate(id: string): Promise<Player> {
    const existing = await this.findById(id);
    if (existing) return existing;
    return this.create(id);
  }

  async save(player: Player): Promise<Player> {
    return this.playerRepo.save(player);
  }

  async register(
    playerId: string,
    email: string,
    passwordHash: string,
  ): Promise<Player> {
    const player = await this.findById(playerId);
    if (!player) {
      throw new NotFoundException('Player session not found');
    }
    player.email = email;
    player.passwordHash = passwordHash;
    return this.save(player);
  }

  async findByEmail(email: string): Promise<Player | null> {
    return this.playerRepo.findOne({ where: { email } });
  }
}
