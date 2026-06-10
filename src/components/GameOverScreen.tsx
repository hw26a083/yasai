/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { PlayerStats, RankingEntry } from "../types";
import React, { useState, useEffect } from "react";
import { audio } from "../utils/audio";
import { Trophy, Home, RotateCcw, Flame, Sparkles, AlertCircle, Heart } from "lucide-react";

interface GameOverScreenProps {
  stats: PlayerStats;
  isVictory: boolean;
  stageReached: number;
  onSaveScore: (entry: RankingEntry) => void;
  onRestart: () => void;
  onGoToTitle: () => void;
}

export default function GameOverScreen({
  stats,
  isVictory,
  stageReached,
  onSaveScore,
  onRestart,
  onGoToTitle
}: GameOverScreenProps) {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isVictory) {
      audio.playGameClear();
    } else {
      audio.playGameOver();
    }
  }, [isVictory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saved) return;

    const trimmedName = name.trim();
    const finalName = trimmedName === "" ? "ななしの勇者" : trimmedName;

    const entry: RankingEntry = {
      name: finalName,
      score: stats.score,
      stageReached: stageReached,
      date: new Date().toISOString(),
      carrot: stats.carrotCount,
      tomato: stats.tomatoCount,
      pimiento: stats.pimientoCount,
      eggplant: stats.eggplantCount,
      broccoli: stats.broccoliCount,
      corn: stats.cornCount
    };

    onSaveScore(entry);
    setSaved(true);
    audio.playPickup("TOMATO");
  };

  // プレイヤーの強化状況を算出
  const totalVeggieCount = stats.carrotCount + stats.tomatoCount + stats.pimientoCount + stats.eggplantCount + stats.broccoliCount + stats.cornCount;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950 text-white font-sans overflow-y-auto selection:bg-amber-500 selection:text-slate-900">
      {/* 背景エフェクト */}
      <div className={`absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000 ${
        isVictory 
          ? "bg-radial-gradient from-emerald-500/30 via-slate-950 to-slate-950" 
          : "bg-radial-gradient from-red-900/30 via-slate-950 to-slate-950"
      }`} />

      <div className="relative z-10 w-full max-w-2xl bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.65)] my-8">
        {/* ビジュアルクラウン */}
        <div className="flex flex-col items-center text-center mb-8">
          {isVictory ? (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse"
            >
              <Sparkles className="w-12 h-12 text-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-full mb-4"
            >
              <AlertCircle className="w-12 h-12 text-red-500 animate-pulse" />
            </motion.div>
          )}

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-4xl md:text-5xl font-black tracking-tight ${
              isVictory 
                ? "bg-gradient-to-r from-yellow-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(245,158,11,0.2)]"
                : "text-red-500 font-extrabold filter drop-shadow-[0_2px_10px_rgba(239,68,68,0.3)]"
            }`}
          >
            {isVictory ? "ゲーム完全クリア！" : "GAME OVER"}
          </motion.h2>

          <p className="text-slate-400 mt-2.5 text-sm md:text-base leading-relaxed tracking-wide">
            {isVictory 
              ? "魔界のカボチャ大王を圧倒的な強さで打ち倒した！村に平和が戻りました！" 
              : "無念！野菜悪魔たちの強力な攻撃に男の子は力尽きてしまった..."}
          </p>
        </div>

        {/* コア スコアボード */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 text-center mb-6 shadow-inner"
        >
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">
            FINAL SCORE
          </span>
          <span className="text-5xl md:text-6xl font-black text-amber-400 font-mono tracking-tight filter drop-shadow">
            {stats.score.toLocaleString()}
          </span>
          
          <div className="flex justify-center flex-wrap gap-4 md:gap-6 mt-4 border-t border-slate-800/60 pt-4 text-xs md:text-sm text-slate-400 font-semibold tracking-wide">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              到達: <b>STAGE {stageReached}</b>
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              最大HP: <b>{stats.maxHp}</b>
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              食べた野菜: <b>{totalVeggieCount}個</b>
            </span>
          </div>
        </motion.div>

        {/* 野菜の獲得詳細 */}
        <div className="grid grid-cols-6 gap-1.5 w-full mb-8">
          <div className="bg-slate-950/60 border border-slate-850/85 p-2 rounded-xl flex flex-col items-center shadow-inner hover:border-slate-800 transition-all duration-300">
            <span className="text-2xl mb-1 filter drop-shadow">🥕</span>
            <span className="text-[10px] text-slate-500 font-black tracking-wider font-mono">CARROT</span>
            <span className="font-mono text-xs font-black text-amber-500 mt-1">{stats.carrotCount}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-850/85 p-2 rounded-xl flex flex-col items-center shadow-inner hover:border-slate-800 transition-all duration-300">
            <span className="text-2xl mb-1 filter drop-shadow">🍅</span>
            <span className="text-[10px] text-slate-500 font-black tracking-wider font-mono">TOMATO</span>
            <span className="font-mono text-xs font-black text-red-500 mt-1">{stats.tomatoCount}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-850/85 p-2 rounded-xl flex flex-col items-center shadow-inner hover:border-slate-800 transition-all duration-300">
            <span className="text-2xl mb-1 filter drop-shadow">🫑</span>
            <span className="text-[10px] text-slate-500 font-black tracking-wider font-mono">PIMIENTO</span>
            <span className="font-mono text-xs font-black text-emerald-500 mt-1">{stats.pimientoCount}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-850/85 p-2 rounded-xl flex flex-col items-center shadow-inner hover:border-slate-800 transition-all duration-300">
            <span className="text-2xl mb-1 filter drop-shadow">🍆</span>
            <span className="text-[10px] text-slate-500 font-black tracking-wider font-mono">EGGPLANT</span>
            <span className="font-mono text-xs font-black text-purple-500 mt-1">{stats.eggplantCount}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-850/85 p-2 rounded-xl flex flex-col items-center shadow-inner hover:border-slate-800 transition-all duration-300">
            <span className="text-2xl mb-1 filter drop-shadow">🥦</span>
            <span className="text-[10px] text-slate-500 font-black tracking-wider font-mono">BROCCOLI</span>
            <span className="font-mono text-xs font-black text-teal-400 mt-1">{stats.broccoliCount}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-850/85 p-2 rounded-xl flex flex-col items-center shadow-inner hover:border-slate-800 transition-all duration-300">
            <span className="text-2xl mb-1 filter drop-shadow">🌽</span>
            <span className="text-[10px] text-slate-500 font-black tracking-wider font-mono">CORN</span>
            <span className="font-mono text-xs font-black text-yellow-400 mt-1">{stats.cornCount}</span>
          </div>
        </div>

        {/* スコア登録フォーム */}
        {!saved ? (
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-slate-900/75 backdrop-blur-xl border border-slate-850/80 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-3 items-center shadow-md"
          >
            <div className="relative w-full">
              <input
                type="text"
                maxLength={10}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="勇者の名前を入力..."
                className="w-full bg-slate-950/90 border border-slate-800/80 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-3 px-4 font-black tracking-wide text-center md:text-left transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-8 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 hover:scale-103 active:scale-97 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
            >
              <Trophy className="w-4 h-4 fill-slate-950" />
              スコアを登録
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/30 p-4.5 rounded-2xl mb-8 text-center text-emerald-400 font-black text-sm tracking-wide shadow-sm"
          >
            🎉 ランキングに登録しました！
          </motion.div>
        )}

        {/* コントロールボタン */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={() => {
              audio.playPickup("CARROT");
              onRestart();
            }}
            className="flex-1 flex items-center justify-center gap-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-extrabold py-4 rounded-xl transition-all hover:scale-103 active:scale-97 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            もう一度遊ぶ
          </button>
          
          <button
            onClick={onGoToTitle}
            className="flex-1 flex items-center justify-center gap-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-extrabold py-4 rounded-xl transition-all hover:scale-103 active:scale-97 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            タイトルへ戻る
          </button>
        </div>
      </div>
    </div>
  );
}
