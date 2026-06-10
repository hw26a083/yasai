/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import TitleScreen from "./components/TitleScreen";
import GameScreen from "./components/GameScreen";
import TransitionScreen from "./components/TransitionScreen";
import GameOverScreen from "./components/GameOverScreen";
import RankingList from "./components/RankingList";
import { GameState, PlayerStats, RankingEntry } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.TITLE);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [currentStage, setCurrentStage] = useState(1);
  const [gameStats, setGameStats] = useState<PlayerStats | null>(null);
  const [isVictory, setIsVictory] = useState(false);

  // 初回起動時にローカルストレージからランキングを読み込む
  useEffect(() => {
    const stored = localStorage.getItem("veggie_shooter_ranking");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRanking(parsed);
        }
      } catch (e) {
        console.error("Failed to parse ranking", e);
      }
    }
  }, []);

  // 新規ゲーム開始
  const handleStartGame = () => {
    setCurrentStage(1);
    setGameStats(null); // GameScreen側で初期パラメータにリセットされます
    setIsVictory(false);
    setGameState(GameState.PLAYING);
  };

  // ステージクリア（トランジション画面へ）
  const handleStageClear = (nextStage: number, currentStats: PlayerStats) => {
    setGameStats(currentStats);
    setCurrentStage(nextStage);
    setGameState(GameState.STAGE_CLEAR);
  };

  // トランジション画面から次のステージ進出
  const handleNextStage = () => {
    setGameState(GameState.PLAYING);
  };

  // ゲームオーバー
  const handleGameOver = (finalStats: PlayerStats, stageReached: number) => {
    setGameStats(finalStats);
    setCurrentStage(stageReached);
    setIsVictory(false);
    setGameState(GameState.GAME_OVER);
  };

  // ゲーム完全クリア！
  const handleVictory = (finalStats: PlayerStats) => {
    setGameStats(finalStats);
    setCurrentStage(4);
    setIsVictory(true);
    setGameState(GameState.GAME_CLEAR);
  };

  // ランキング保存＆表示
  const handleSaveScore = (newEntry: RankingEntry) => {
    const updated = [...ranking, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // 上位10名

    setRanking(updated);
    localStorage.setItem("veggie_shooter_ranking", JSON.stringify(updated));
    
    // スコアボード一覧へ自動遷移
    setTimeout(() => {
      setGameState(GameState.RANKING);
    }, 1000);
  };

  // ランキング初期化
  const handleClearRanking = () => {
    setRanking([]);
    localStorage.removeItem("veggie_shooter_ranking");
  };

  // 全体画面出し分け
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white select-none overflow-x-hidden">
      <AnimatePresence mode="wait">
        {gameState === GameState.TITLE && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <TitleScreen
              onStartGame={handleStartGame}
              onShowRanking={() => setGameState(GameState.RANKING)}
            />
          </motion.div>
        )}

        {gameState === GameState.PLAYING && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <GameScreen
              key={currentStage} // ステージが変わるごとに完全にコンポーネントを再マウントしてスッキリ初期化
              currentStage={currentStage}
              initialStats={gameStats || undefined}
              onStageClear={handleStageClear}
              onGameOver={handleGameOver}
              onVictory={handleVictory}
            />
          </motion.div>
        )}

        {gameState === GameState.STAGE_CLEAR && (
          <motion.div
            key="stage_clear"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            {gameStats && (
              <TransitionScreen
                stage={currentStage}
                stats={gameStats}
                onNextStage={handleNextStage}
              />
            )}
          </motion.div>
        )}

        {(gameState === GameState.GAME_OVER || gameState === GameState.GAME_CLEAR) && (
          <motion.div
            key="game_result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {gameStats && (
              <GameOverScreen
                stats={gameStats}
                isVictory={isVictory}
                stageReached={currentStage}
                onSaveScore={handleSaveScore}
                onRestart={handleStartGame}
                onGoToTitle={() => setGameState(GameState.TITLE)}
              />
            )}
          </motion.div>
        )}

        {gameState === GameState.RANKING && (
          <motion.div
            key="ranking"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <RankingList
              ranking={ranking}
              onBack={() => setGameState(GameState.TITLE)}
              onClearRanking={handleClearRanking}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
