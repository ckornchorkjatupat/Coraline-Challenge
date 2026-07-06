import { render, screen } from '@testing-library/react';
import { BotDisplay } from './BotDisplay';

describe('BotDisplay', () => {
  it('should show "???" if botAction = null' , () => {
    render(<BotDisplay botAction={null} />);

    expect(screen.getByText('???')).toBeInTheDocument();
  });

  it('should show the action if botAction have value', () => {
    render(<BotDisplay botAction="PAPER" />);

    expect(screen.getByText('PAPER')).toBeInTheDocument();
    expect(screen.queryByText('???')).not.toBeInTheDocument();
  });

  it('should show label "Bot action:"', () => {
    render(<BotDisplay botAction={null} />);

    expect(screen.getByText('Bot action:')).toBeInTheDocument();
  });
});