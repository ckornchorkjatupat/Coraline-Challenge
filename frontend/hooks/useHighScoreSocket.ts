import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useHighScoreSocket(onUpdate: (score: number) => void) {
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL ?? '/', {
      withCredentials: true,
    });

    socket.on('highScoreUpdated', (score: number) => onUpdateRef.current(score));

    return () => {
      socket.disconnect();
    };
  }, []);
}
