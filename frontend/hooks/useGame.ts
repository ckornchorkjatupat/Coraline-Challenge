import { useState, useRef } from 'react';
import { playGame, ApiError } from '../lib/api';
import type { Action } from '../types/action.type';


export function useGame(onRoundEnd: () => void) {
  const [botAction, setBotAction] = useState<Action | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const isWaitingRef = useRef(false);

  async function handlePlay(action: Action) {
    if (isWaiting || isWaitingRef.current) return;

    isWaitingRef.current = true;
    setIsWaiting(true);

    try {
      const { botAction } = await playGame(action);
      setBotAction(botAction);
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('Failed to play:', err.message);
      }
      isWaitingRef.current = false;
      setIsWaiting(false);
      return;
    }

    setTimeout(() => {
      onRoundEnd();
      setBotAction(null);
      setIsWaiting(false);
      isWaitingRef.current = false;
    }, 2000);
  }

  return { botAction, isWaiting, handlePlay };
}
