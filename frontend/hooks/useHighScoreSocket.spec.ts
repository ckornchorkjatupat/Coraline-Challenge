import { renderHook } from '@testing-library/react';
import { useHighScoreSocket } from './useHighScoreSocket';
import { io } from 'socket.io-client';

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

describe('useHighScoreSocket', () => {
  const mockSocket = {
    on: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(() => {
    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call io() if useHighScoreSocket has called', () => {
    renderHook(() => useHighScoreSocket(jest.fn()));

    expect(io).toHaveBeenCalledTimes(1);
  });

  it('should call io() withCredentials: true', () => {
    renderHook(() => useHighScoreSocket(jest.fn()));

    expect(io).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ withCredentials: true }),
    );
  });

  it('should subscribe event "highScoreUpdated"', () => {
    renderHook(() => useHighScoreSocket(jest.fn()));

    expect(mockSocket.on).toHaveBeenCalledWith('highScoreUpdated', expect.any(Function));
  });

  it('should callback when socket fire event "highScoreUpdated"', () => {
    const onUpdate = jest.fn();
    renderHook(() => useHighScoreSocket(onUpdate));

    const registeredHandler = mockSocket.on.mock.calls.find(
      (call) => call[0] === 'highScoreUpdated',
    )?.[1];

    registeredHandler?.(15);

    expect(onUpdate).toHaveBeenCalledWith(15);
  });

  it('should disconnect socket after unmount', () => {
    const { unmount } = renderHook(() => useHighScoreSocket(jest.fn()));

    unmount();

    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});