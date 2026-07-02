import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Action } from './types/action.type';

describe('GameService', () => {
  let gameService: GameService;
  const randomValueFor: Record<Action, number> = {
    ROCK: 0.1,
    PAPER: 0.4,
    SCISSORS: 0.9,
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    gameService = moduleRef.get<GameService>(GameService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(gameService).toBeDefined();
  });

  // ROCK
  it('ROCK should win SCISSORS', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.SCISSORS);

    const promise = gameService.play('ROCK');
    jest.advanceTimersByTime(2000);

    const { botAction, result } = await promise;
    expect(botAction).toBe('SCISSORS');
    expect(result).toBe('WIN');
  });

  it('ROCK should lose PAPER', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.PAPER);

    const promise = gameService.play('ROCK');
    jest.advanceTimersByTime(2000);

    const { botAction, result } = await promise;
    expect(botAction).toBe('PAPER');
    expect(result).toBe('LOSE');
  });

  it('ROCK vs ROCK should draw', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.ROCK);

    const promise = gameService.play('ROCK');
    jest.advanceTimersByTime(2000);

    const { botAction, result } = await promise;
    expect(botAction).toBe('ROCK');
    expect(result).toBe('DRAW');
  });

  // PAPER
  it('PAPER should win ROCK', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.ROCK);

    const promise = gameService.play('PAPER');
    jest.advanceTimersByTime(2000);

    const { botAction, result } = await promise;
    expect(botAction).toBe('ROCK');
    expect(result).toBe('WIN');
  });

  it('PAPER should lose SCISSORS', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.SCISSORS);

    const promise = gameService.play('PAPER');
    jest.advanceTimersByTime(2000);

    const { botAction, result } = await promise;
    expect(botAction).toBe('SCISSORS');
    expect(result).toBe('LOSE');
  });

  it('PAPER vs PAPER should draw', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.PAPER);

    const promise = gameService.play('PAPER');
    jest.advanceTimersByTime(2000);

    const { botAction, result } = await promise;
    expect(botAction).toBe('PAPER');
    expect(result).toBe('DRAW');
  });

  // SCISSORS
  it('SCISSORS should win PAPER', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.PAPER);

    const promise = gameService.play('SCISSORS');
    jest.advanceTimersByTime(2000);

    const { botAction, result } = await promise;
    expect(botAction).toBe('PAPER');
    expect(result).toBe('WIN');
  });

  it('SCISSORS should lose ROCK', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.ROCK);

    const promise = gameService.play('SCISSORS');
    jest.advanceTimersByTime(2000);

    const { botAction, result } = await promise;
    expect(botAction).toBe('ROCK');
    expect(result).toBe('LOSE');
  });

  it('SCISSORS vs SCISSORS should draw', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValueFor.SCISSORS);

    const promise = gameService.play('SCISSORS');
    jest.advanceTimersByTime(2000);

    const { botAction, result } = await promise;
    expect(botAction).toBe('SCISSORS');
    expect(result).toBe('DRAW');
  });
});
