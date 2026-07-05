import { Test, TestingModule } from '@nestjs/testing';
import { ScoreGateway } from './score.gateway';

describe('ScoreGateway', () => {
  let scoreGateway: ScoreGateway;

  const mockServer = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoreGateway],
    }).compile();

    scoreGateway = module.get<ScoreGateway>(ScoreGateway);
    scoreGateway.server = mockServer as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(scoreGateway).toBeDefined();
  });

  it('should emit event "highScoreUpdated" when broadcastHighScore', () => {
    scoreGateway.broadcastHighScore(12);

    expect(mockServer.emit).toHaveBeenCalledWith('highScoreUpdated', 12);
  });
});
