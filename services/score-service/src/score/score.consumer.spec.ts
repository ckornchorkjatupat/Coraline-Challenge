import { Test, TestingModule } from '@nestjs/testing';
import { ScoreConsumer } from './score.consumer';
import { ScoreService } from './score.service';

describe('ScoreConsumer', () => {
  let scoreConsumer: ScoreConsumer;
  let scoreService: ScoreService;

  const mockScoreService = {
    incrementScore: jest.fn(),
    resetScore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreConsumer,
        { provide: ScoreService, useValue: mockScoreService },
      ],
    }).compile();

    scoreConsumer = module.get<ScoreConsumer>(ScoreConsumer);
    scoreService = module.get<ScoreService>(ScoreService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(scoreConsumer).toBeDefined();
  });

  it('should run incrementScore when handleGameWon with playerId', async () => {
    await scoreConsumer.handleGameWon({ playerId: 'abc' });

    expect(scoreService.incrementScore).toHaveBeenCalledWith('abc');
  });

  it('should run resetScore when handleGameLost with playerId', async () => {
    await scoreConsumer.handleGameLost({ playerId: 'abc' });

    expect(scoreService.resetScore).toHaveBeenCalledWith('abc');
  });
});
