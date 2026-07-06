import { Test, TestingModule } from '@nestjs/testing';
import { ScoreService } from './score.service';
import { PlayerService } from '../player/player.service';
import { ScoreGateway } from './score.gateway';
import { Player } from 'src/player/entities/player.entity';

describe('ScoreService', () => {
  let scoreService: ScoreService;
  let playerService: PlayerService;
  let scoreGateway: ScoreGateway;

  const mockPlayerService = {
    findOrCreate: jest.fn(),
    save: jest.fn(),
  };

  const mockScoreGateway = {
    broadcastHighScore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        { provide: PlayerService, useValue: mockPlayerService },
        { provide: ScoreGateway, useValue: mockScoreGateway },
      ],
    }).compile();

    scoreService = module.get<ScoreService>(ScoreService);
    playerService = module.get<PlayerService>(PlayerService);
    scoreGateway = module.get<ScoreGateway>(ScoreGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(scoreService).toBeDefined();
  });

  describe('resetScore', () => {
    it('should reset currentScore and not reset highScore', async () => {
      const player = { id: 'abc', currentScore: 2, highScore: 5 } as Player;
      mockPlayerService.findOrCreate.mockResolvedValue(player);
      mockPlayerService.save.mockImplementation((p) => Promise.resolve(p));

      await scoreService.resetScore('abc');

      expect(player.currentScore).toBe(0);
      expect(player.highScore).toBe(5);
      expect(playerService.save).toHaveBeenCalledWith(player);
    });
  });

  describe('incrementScore', () => {
    it('should currentScore increase by 1', async () => {
      const player = { id: 'abc', currentScore: 2, highScore: 5 } as Player;
      mockPlayerService.findOrCreate.mockResolvedValue(player);
      mockPlayerService.save.mockImplementation((p) => Promise.resolve(p));

      await scoreService.incrementScore('abc');

      expect(player.currentScore).toBe(3);
      expect(playerService.save).toHaveBeenCalledWith(player);
    });

    it('should update and boardcast highScore when currentScore > highScore ', async () => {
      const player = { id: 'abc', currentScore: 5, highScore: 5 } as Player;
      mockPlayerService.findOrCreate.mockResolvedValue(player);
      mockPlayerService.save.mockImplementation((p) => Promise.resolve(p));

      await scoreService.incrementScore('abc');

      expect(player.currentScore).toBe(6);
      expect(player.highScore).toBe(6);
      expect(scoreGateway.broadcastHighScore).toHaveBeenCalledWith(6);
    });

    it('should not boardcast highScore when currentScore <= highScore ', async () => {
      const player = { id: 'abc', currentScore: 4, highScore: 5 } as Player;
      mockPlayerService.findOrCreate.mockResolvedValue(player);
      mockPlayerService.save.mockImplementation((p) => Promise.resolve(p));

      await scoreService.incrementScore('abc');

      expect(player.currentScore).toBe(5);
      expect(player.highScore).toBe(5);
      expect(scoreGateway.broadcastHighScore).not.toHaveBeenCalled();
    });
  });
});
