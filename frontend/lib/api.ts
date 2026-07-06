import { Action, GameResult } from './../types/action.type';
// import Response from 'express';

const API_GAME = process.env.NEXT_PUBLIC_API_GAME_URL ?? '/api/game';
const API_SCORE = process.env.NEXT_PUBLIC_API_SCORE_URL ?? '/api/score';

export interface FetchSessionResponse {
  currentScore: number;
  highScore: number;
}

export interface PlayGameResponse {
  botAction: Action;
  result: GameResult;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const errorBody = await res.json();
      message = errorBody.message ?? message;
    } catch {}
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}

export async function fetchSession() {
  const res = await fetch(`${API_SCORE}/player/session`, {
    credentials: 'include',
  });
  return handleResponse<FetchSessionResponse>(res);
}

export async function playGame(action: 'ROCK' | 'PAPER' | 'SCISSORS') {
  const res = await fetch(`${API_GAME}/game/play`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action }),
  });
  return handleResponse<PlayGameResponse>(res);
}
