import { render, screen, fireEvent } from '@testing-library/react';
import { ActionButtons } from './ActionButtons';

describe('ActionButtons', () => {
  it('should show 3 action buttons', () => {
    render(<ActionButtons disabled={false} onSelect={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'ROCK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'PAPER' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SCISSORS' })).toBeInTheDocument();
  });

  it('should disable all button if disabled=true', () => {
    render(<ActionButtons disabled={true} onSelect={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'ROCK' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'PAPER' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'SCISSORS' })).toBeDisabled();
  });

  it('should not disabled if disabled=false', () => {
    const onSelect = jest.fn();
    render(<ActionButtons disabled={false} onSelect={onSelect} />);

    expect(screen.getByRole('button', { name: 'ROCK' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'PAPER' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'SCISSORS' })).not.toBeDisabled();
  });

  it('should call onSelect with action when clicked', () => {
    const onSelect = jest.fn();
    render(<ActionButtons disabled={false} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: 'ROCK' }));

    expect(onSelect).toHaveBeenCalledWith('ROCK');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('should not call onSelect if disabled=true', () => {
    const onSelect = jest.fn();
    render(<ActionButtons disabled={true} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: 'ROCK' }));

    expect(onSelect).not.toHaveBeenCalled();
  });
});