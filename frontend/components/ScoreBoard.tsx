import styles from './ScoreBoard.module.scss'

interface ScoreBoardProps {
  currentScore: number;
  highScore: number;
}

export function ScoreBoard({ currentScore, highScore }: ScoreBoardProps) {
  return (
    <div className={styles.scoreBoard}>
      <div className={styles.row}>
        <span className={styles.label}>Your Score:</span>
        <span className={styles.value}>{currentScore}</span>
        <span className={styles.unit}>trun</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>High Score:</span>
        <span className={styles.value}>{highScore}</span>
        <span className={styles.unit}>trun</span>
      </div>
    </div>
  )
}