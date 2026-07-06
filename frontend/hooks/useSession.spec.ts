import { renderHook, waitFor, act } from '@testing-library/react';
import { useSession } from './useSession';
import * as api from '../lib/api'

jest.mock('../lib/api');

describe('useSession', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should start with loading=true', async () => {
    jest.spyOn(api, 'fetchSession').mockResolvedValue({ currentScore: 0, highScore: 0 });

    const { result } = renderHook(() => useSession());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should got currentScore and highScore from API', async () => {
    jest.spyOn(api, 'fetchSession').mockResolvedValue({ currentScore: 3, highScore: 7 });

    const { result } = renderHook(() => useSession());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currentScore).toBe(3);
    expect(result.current.highScore).toBe(7);
  });

  it('should refetch() update new value', async () => {
    jest.spyOn(api, 'fetchSession')
      .mockResolvedValueOnce({ currentScore: 0, highScore: 0})
      .mockResolvedValueOnce({ currentScore: 1, highScore: 1});

    const { result } = renderHook(() => useSession());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.currentScore).toBe(1);
      expect(result.current.highScore).toBe(1);
    });
  });
});