import { render, screen } from '@testing-library/react';
import { ScoreBoard } from './ScoreBoard';

describe('ScoreBoard', () => {
  it('should show currentScore and highScore', () => {
    render(<ScoreBoard currentScore={8} highScore={12} />)

    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should show 0 if have no score', () => {
    render(<ScoreBoard currentScore={0} highScore={0} />)

    const zeros = screen.getAllByText('0');

    expect(zeros).toHaveLength(2);
  });

  it('should show label "Your Score:" and "High Score"', () => {
    render(<ScoreBoard currentScore={0} highScore={0} />)

    expect(screen.getByText('Your Score:')).toBeInTheDocument();
    expect(screen.getByText('High Score:')).toBeInTheDocument();
  });

  it('should show unit "turn"', () => {
    render(<ScoreBoard currentScore={0} highScore={0} />)

    const turns = screen.getAllByText('turn');

    expect(turns).toHaveLength(2);
  });
});