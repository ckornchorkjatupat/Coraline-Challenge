const API_GAME = process.env.NEXT_PUBLIC_API_GAME_URL ?? '/api/game';
const API_SCORE = process.env.NEXT_PUBLIC_API_SCORE_URL ?? '/api/score';

export async function fetchSession() {
  const res = await fetch(`${API_SCORE}/player/session`, {
    credentials: 'include',
  });
  return res.json();
}

export async function playGame(action: 'ROCK' | 'PAPER' | 'SCISSORS') {
  const res = await fetch(`${API_GAME}/game/play`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action }),
  });
  return res.json();
}
