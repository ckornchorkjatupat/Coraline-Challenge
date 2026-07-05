import { useEffect, useState, useCallback } from 'react';
import { fetchSession } from '../lib/api';

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

  return { currentScore, highScore, setHighScore, loading, refetch };
}
