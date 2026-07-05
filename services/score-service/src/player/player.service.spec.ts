import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'node:test';
import { NotFoundException } from '@nestjs/common';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let playerRepo: Repository<Player>;

  const mockPlayerRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockPlayerRepo,
        },
      ],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
    playerRepo = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(playerService).toBeDefined();
  });

  describe('findById', () => {
    it('should return player if exist', async () => {
      const mockPlayer = {
        id: 'abc',
        currentScore: 8,
        highScore: 12,
      } as Player;
      mockPlayerRepo.findOne.mockResolvedValue(mockPlayer);

      const result = await playerService.findById('abc');

      expect(playerRepo.findOne).toHaveBeenCalledWith({ where: { id: 'abc' } });
      expect(result).toEqual(mockPlayer);
    });

    it('should return null if not exist', async () => {
      mockPlayerRepo.findOne.mockResolvedValue(null);

      const result = await playerService.findById('not-exist');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return player with 0 score', async () => {
      const newPlayer = {
        id: 'new-id',
        currentScore: 0,
        highScore: 0,
      } as Player;
      mockPlayerRepo.create.mockReturnValue(newPlayer);
      mockPlayerRepo.save.mockResolvedValue(newPlayer);

      const result = await playerService.create('new-id');

      expect(playerRepo.create).toHaveBeenCalledWith(newPlayer);
      expect(playerRepo.save).toHaveBeenCalledWith(newPlayer);
      expect(result).toEqual(newPlayer);
    });
  });

  describe('findOrCreate', () => {
    it('should return player if exist', async () => {
      const existingPlayer = {
        id: 'abc',
        currentScore: 8,
        highScore: 12,
      } as Player;
      mockPlayerRepo.findOne.mockResolvedValue(existingPlayer);

      const result = await playerService.findOrCreate('abc');

      expect(playerRepo.findOne).toHaveBeenCalledWith({ where: { id: 'abc' } });
      expect(result).toEqual(existingPlayer);
    });

    it('should create and return player if not exist', async () => {
      const newPlayer = {
        id: 'new-id',
        currentScore: 0,
        highScore: 0,
      } as Player;
      mockPlayerRepo.findOne.mockResolvedValue(null);
      mockPlayerRepo.create.mockReturnValue(newPlayer);
      mockPlayerRepo.save.mockResolvedValue(newPlayer);

      const result = await playerService.findOrCreate('new-id');

      expect(playerRepo.findOne).toHaveBeenCalledWith({ where: {id : 'new-id' } });
      expect(playerRepo.create).toHaveBeenCalledWith(newPlayer);
      expect(playerRepo.save).toHaveBeenCalledWith(newPlayer);
      expect(result).toEqual(newPlayer);
    });
  });

  describe('register', () => {
    it('should throw NotFoundException if player is not in session', async () => {
      mockPlayerRepo.findOne.mockResolvedValue(null);

      await expect(
        playerService.register('not-exist', 'test@test.com', 'hashed-password'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should binding email/password with player', async () => {
      const existingPlayer = {
        id: 'abc',
        currentScore: 8,
        highScore: 12,
      } as Player;
      mockPlayerRepo.findOne.mockResolvedValue(existingPlayer);
      mockPlayerRepo.save.mockImplementation((p) => Promise.resolve(p));

      const result = await playerService.register(
        'abc',
        'test@test.com',
        'hashed-password',
      );

      expect(result.email).toBe('test@test.com');
      expect(result.passwordHash).toBe('hashed-password');
      expect(result.currentScore).toBe(8);
      expect(result.highScore).toBe(12);
    });
  });
});
