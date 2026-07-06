import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Action } from './types/action.type';
import { of } from 'rxjs';
describe('GameService', () => {
  let gameService: GameService;
  const randomValueFor: Record<Action, number> = {
    ROCK: 0.1,
    PAPER: 0.4,
    SCISSORS: 0.9,
  };
  const mockPlayerId = 'test-player-id';
  const mockClientProxy = {
    emit: jest.fn().mockReturnValue(of(undefined)),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: 'SCORE_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    gameService = moduleRef.get<GameService>(GameService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gameService).toBeDefined();
  });

  // ROCK
  it('ROCK should win SCISSORS', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.SCISSORS);

    const promise = gameService.play('ROCK', mockPlayerId);

    const { botAction, result } = await promise;

    expect(botAction).toBe('SCISSORS');
    expect(result).toBe('WIN');
    expect(mockClientProxy.emit).toHaveBeenCalledWith('game.won', {
      playerId: mockPlayerId,
    });
  });

  it('ROCK should lose PAPER', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.PAPER);

    const promise = gameService.play('ROCK', mockPlayerId);

    const { botAction, result } = await promise;
    expect(botAction).toBe('PAPER');
    expect(result).toBe('LOSE');
    expect(mockClientProxy.emit).toHaveBeenCalledWith('game.lost', {
      playerId: mockPlayerId,
    });
  });

  it('ROCK vs ROCK should draw', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.ROCK);

    const promise = gameService.play('ROCK', mockPlayerId);

    const { botAction, result } = await promise;
    expect(botAction).toBe('ROCK');
    expect(result).toBe('DRAW');
  });

  // PAPER
  it('PAPER should win ROCK', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.ROCK);

    const promise = gameService.play('PAPER', mockPlayerId);

    const { botAction, result } = await promise;
    expect(botAction).toBe('ROCK');
    expect(result).toBe('WIN');
  });

  it('PAPER should lose SCISSORS', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.SCISSORS);

    const promise = gameService.play('PAPER', mockPlayerId);

    const { botAction, result } = await promise;
    expect(botAction).toBe('SCISSORS');
    expect(result).toBe('LOSE');
    expect(mockClientProxy.emit).toHaveBeenCalledWith('game.lost', {
      playerId: mockPlayerId,
    });
  });

  it('PAPER vs PAPER should draw', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.PAPER);

    const promise = gameService.play('PAPER', mockPlayerId);

    const { botAction, result } = await promise;
    expect(botAction).toBe('PAPER');
    expect(result).toBe('DRAW');
  });

  // SCISSORS
  it('SCISSORS should win PAPER', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.PAPER);

    const promise = gameService.play('SCISSORS', mockPlayerId);

    const { botAction, result } = await promise;
    expect(botAction).toBe('PAPER');
    expect(result).toBe('WIN');
  });

  it('SCISSORS should lose ROCK', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.ROCK);

    const promise = gameService.play('SCISSORS', mockPlayerId);

    const { botAction, result } = await promise;
    expect(botAction).toBe('ROCK');
    expect(result).toBe('LOSE');
    expect(mockClientProxy.emit).toHaveBeenCalledWith('game.lost', {
      playerId: mockPlayerId,
    });
  });

  it('SCISSORS vs SCISSORS should draw', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.SCISSORS);

    const promise = gameService.play('SCISSORS', mockPlayerId);

    const { botAction, result } = await promise;
    expect(botAction).toBe('SCISSORS');
    expect(result).toBe('DRAW');
  });
});
