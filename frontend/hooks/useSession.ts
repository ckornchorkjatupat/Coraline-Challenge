import { useEffect, useState, useCallback } from 'react';
import { fetchSession } from '../lib/api';
import { useHighScoreSocket } from './useHighScoreSocket';

export function useSession() {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const data = await fetchSession();
    setCurrentScore(data.currentScore);
    setHighScore(data.highScore);
  }, []);

  useEffect(() => {
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  useHighScoreSocket(
    useCallback((newHighScore: number) => setHighScore(newHighScore), []),
  )

  return { currentScore, highScore, loading, refetch };
}
