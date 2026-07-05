import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let gameController: GameController;
  let gameService: GameService;

  const mockPlayerId = 'test-player-id';
  const mockGameService = {
    play: jest.fn(),
  };
  const mockRequestWithPlayerId = {
    cookies: { playerId: mockPlayerId },
  } as any;
  const mockRequestWithOutPlayerId = {
    cookies: {},
  } as any;
  const mockResponse = {
    cookie: jest.fn(),
  } as any;

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

  it('should create playerId and set cookie if have no playerId', async () => {
    mockGameService.play.mockResolvedValue({
      botAction: 'SCISSORS',
      result: 'WIN',
    });

    const result = await gameController.play(
      { action: 'ROCK' },
      mockRequestWithOutPlayerId,
      mockResponse,
    );

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'playerId',
      expect.any(String),
      expect.any(Object),
    );
    expect(gameService.play).toHaveBeenCalledWith('ROCK', expect.any(String));
  });

  it('should use playerId in cookie', async () => {
    mockGameService.play.mockResolvedValue({
      botAction: 'SCISSORS',
      result: 'WIN',
    });

    const result = await gameController.play(
      { action: 'ROCK' },
      mockRequestWithPlayerId,
      mockResponse,
    );

    expect(mockResponse.cookie).not.toHaveBeenCalled();
    expect(gameService.play).toHaveBeenCalledWith('ROCK', mockPlayerId);
  });
});
