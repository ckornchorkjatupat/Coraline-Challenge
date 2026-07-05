import styles from './BotDisplay.module.scss';
import type { Action } from '../types/action.type';

interface BotDisplayProps {
  botAction: Action | null;
}

export function BotDisplay({ botAction }: BotDisplayProps) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>Bot action:</span>
      <div className={styles.card}>{botAction ?? '???'}</div>
    </div>
  )
}