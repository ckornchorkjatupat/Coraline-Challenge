import { useEffect } from 'react';
import { io } from 'socket.io-client';

export function useHighScoreSocket(onUpdate: (score: number) => void) {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL ?? '/', {
      withCredentials: true,
    });

    socket.on('highScoreUpdated', onUpdate);

    return () => {
      socket.disconnect();
    };
  }, [onUpdate]);
}
