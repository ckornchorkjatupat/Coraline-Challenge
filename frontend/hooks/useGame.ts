import { useState } from 'react';
import { playGame } from '../lib/api';
import type { Action } from '../types/action.type';


export function useGame(onRoundEnd: () => void) {
  const [botAction, setBotAction] = useState<Action | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  async function handlePlay(action: Action) {
    if (isWaiting) return;

    setIsWaiting(true);

    const { botAction } = await playGame(action);
    setBotAction(botAction);

    setTimeout(() => {
      onRoundEnd();
      setBotAction(null);
      setIsWaiting(false);
    }, 2000);
  }

  return { botAction, isWaiting, handlePlay };
}
