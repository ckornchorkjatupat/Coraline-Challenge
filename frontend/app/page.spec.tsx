import { render, screen } from '@testing-library/react';
import Home from './page';
import * as api from '../lib/api';

jest.mock('../lib/api');
jest.mock('socket.io-client', () => ({
  io: () => ({ on: jest.fn(), disconnect: jest.fn() }),
}));

describe('Home page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  })
  it('should show "Loading ..." before session loaded', () => {
    jest.spyOn(api, 'fetchSession').mockReturnValue(new Promise(() => {})); // ค้างไม่ resolve

    render(<Home />);

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('should show the score', async () => {
    jest.spyOn(api, 'fetchSession').mockResolvedValue({ currentScore: 2, highScore: 5 });

    render(<Home />);

    expect(await screen.findByText('2')).toBeInTheDocument();
    expect(await screen.findByText('5')).toBeInTheDocument();
  });
});