import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let gameController: GameController;
  let gameService: GameService;

  const mockGameService = {
    play: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: mockGameService,
        },
      ],
    }).compile();

    gameController = moduleRef.get<GameController>(GameController);
    gameService = moduleRef.get<GameService>(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gameController).toBeDefined();
  });

  it('should call gameService.play with the correct action', async () => {
    mockGameService.play.mockResolvedValue({
      botAction: 'SCISSORS',
      result: 'WIN',
    });

    const result = await gameController.play({ action: 'ROCK' });

    expect(gameService.play).toHaveBeenCalledWith('ROCK');
    expect(result).toEqual({ botAction: 'SCISSORS', result: 'WIN' });
  });
});
