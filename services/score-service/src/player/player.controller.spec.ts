import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

const mockPlayerService = {
  findOrCreate: jest.fn(),
};

const mockResponse = {
  cookie: jest.fn(),
} as any;

describe('PlayerController', () => {
  let playerController: PlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    }).compile();

    playerController = module.get<PlayerController>(PlayerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(playerController).toBeDefined();
  });

  it('should create playerId and set cookie if not exist', async () => {
    const mockRequset = { cookies: {} } as any;
    mockPlayerService.findOrCreate.mockResolvedValue({
      id: 'new-id',
      currentScore: 0,
      highScore: 0,
    });

    const result = await playerController.getSession(mockRequset, mockResponse);

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'playerId',
      expect.any(String),
      expect.any(Object),
    );
    expect(result).toEqual({ currentScore: 0, highScore: 0 });
  });

  it('should use playerId in cookie if exist', async () => {
    const mockRequset = { cookies: { playerId: 'existing-id' } } as any;
    mockPlayerService.findOrCreate.mockResolvedValue({
      id: 'existing-id',
      currentScore: 8,
      highScore: 12,
    });

    const result = await playerController.getSession(mockRequset, mockResponse);

    expect(mockResponse.cookie).not.toHaveBeenCalled();
    expect(mockPlayerService.findOrCreate).toHaveBeenCalledWith('existing-id');
    expect(result).toEqual({ currentScore: 8, highScore: 12 });
  });
});
