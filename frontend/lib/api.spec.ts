import { fetchSession, playGame, ApiError } from './api';

function mockFetchOnec(body: unknown, init: { ok?: boolean, status?: number } ={}) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: () => Promise.resolve(body),
  });
}

describe('api', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSession', () => {
    it('should call GET /player/session with credentials: include', async () => {
      mockFetchOnec({ currentScore: 3, highScore: 5 });

      const result = await fetchSession();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/player/session'),
        expect.objectContaining({ credentials: 'include' }),
      );
      expect(result).toEqual({ currentScore: 3, highScore: 5 });
    });

    it('should throw ApiError if response not ok', async () => {
      mockFetchOnec({ message: 'Internal server error' }, { ok: false, status: 500 })

      await expect(fetchSession()).rejects.toThrow(ApiError);
    });

    it('should throw "Request failed with status xxx" if ok: false', async () => {
      mockFetchOnec({}, { ok: false, status: 500 })

      await expect(fetchSession()).rejects.toThrow("Request failed with status 500");
    });

    it('should return normal value if response ok', async () => {
      mockFetchOnec({ currentScore: 2, highScore: 3 })

      const result = await fetchSession();

      expect(result).toEqual({ currentScore: 2, highScore: 3})
    });
  });

  describe('playGame', () => {
    it('should call POST /game/play with body and credentials', async () => {
      mockFetchOnec({ botAction: 'ROCK', result: 'WIN' });

      const result = await playGame('PAPER');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/game/play'),
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ action: 'PAPER' }),
        }),
      );
      expect(result).toEqual({ botAction: 'ROCK', result: 'WIN' });
    });

    it('should throw ApiError if response not ok', async () => {
      mockFetchOnec({ message: 'bad request' }, { ok: false, status: 400 })

      await expect(fetchSession()).rejects.toThrow(ApiError);
    });

    it('should throw "Request failed with status xxx" if ok: false', async () => {
      mockFetchOnec({}, { ok: false, status: 404 })

      await expect(fetchSession()).rejects.toThrow("Request failed with status 404");
    });
  });
});