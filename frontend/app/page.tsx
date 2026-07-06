'use client'

import { useSession } from '../hooks/useSession';
import { useGame } from "../hooks/useGame";
import { ScoreBoard } from '../components/ScoreBoard';
import { BotDisplay } from '../components/BotDisplay';
import { ActionButtons } from '../components/ActionButtons';
import styles from './page.module.scss'

export default function Home() {
  const { currentScore, highScore, loading, refetch } = useSession();
  const { botAction, isWaiting, handlePlay } = useGame(() => {
    refetch();
  })

  if (loading) return <div>Loading ...</div>;
  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <ScoreBoard  currentScore={currentScore} highScore={highScore} />
        <BotDisplay botAction={botAction} />
        <ActionButtons disabled={isWaiting} onSelect={handlePlay} />
      </div>
    </main>
  );
}
