import { renderHook, act, waitFor } from '@testing-library/react';
import { useGame } from './useGame';
import * as api from '../lib/api'

jest.mock('../lib/api');

describe('useGame', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should start with botAction=null and isWaiting=false', () => {
    const { result } = renderHook(() => useGame(jest.fn()));

    expect(result.current.botAction).toBeNull();
    expect(result.current.isWaiting).toBe(false);
  });

  it('should isWaiting=true if playGame has called', async () => {
    jest.spyOn(api, 'playGame').mockResolvedValue({ botAction: 'SCISSORS', result: 'WIN'});

    const { result } = renderHook(() => useGame(jest.fn()));

    act(() => {
      result.current.handlePlay('ROCK');
    });

    expect(result.current.isWaiting).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('should show botAction after handlePlay has called', async () => {
    jest.spyOn(api, 'playGame').mockResolvedValue({ botAction: 'PAPER', result: 'LOSE'});

    const { result } = renderHook(() => useGame(jest.fn()));

    act(() => {
      result.current.handlePlay('ROCK');
    });

    await waitFor(() => {
      expect(result.current.botAction).toBe('PAPER');
    })
  });

  it('should not call playGame if isWaiting=true', async () => {
    const playGameSpy = jest.spyOn(api, 'playGame').mockResolvedValue({ botAction: 'ROCK', result: 'DRAW'});

    const { result } = renderHook(() => useGame(jest.fn()));

    act(() => {
      result.current.handlePlay('ROCK');
      result.current.handlePlay('PAPER');
    });

    expect(playGameSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      await Promise.resolve();
    });
  });
});

describe('useGame - timing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should reset botAction and isWaiting after botAction has shown 2 second', async () => {
    jest.spyOn(api, 'playGame').mockResolvedValue({ botAction: 'PAPER', result: 'WIN'});
    const onRoundEnd = jest.fn();

    const { result } = renderHook(() => useGame(onRoundEnd));

    await act(async () => {
      await result.current.handlePlay('SCISSORS');
    });

    expect(result.current.botAction).toBe('PAPER');
    expect(result.current.isWaiting).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.botAction).toBeNull();
    expect(result.current.isWaiting).toBe(false);
    expect(onRoundEnd).toHaveBeenCalledTimes(1);
  });
});