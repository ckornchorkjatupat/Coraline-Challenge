import styles from './ActionButtons.module.scss';
import type { Action } from '../types/action.type';

interface ActionButtonProps {
  disabled: boolean;
  onSelect: (action: Action) => void;
}

export function ActionButtons({ disabled, onSelect }: ActionButtonProps) {
  const actions: Action[] = ['ROCK', 'PAPER', 'SCISSORS'];

  return (
    <div className={styles.row}>
      <span className={styles.label}>Your action:</span>
      {actions.map((action) => (
        <button
          key={action}
          className={styles.card}
          disabled={disabled}
          onClick={() => onSelect(action)}
        >
          {action}
        </button>
      ))}
    </div>
  )
}