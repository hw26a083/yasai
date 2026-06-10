/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { PlayerStats } from "../types";
import { audio } from "../utils/audio";
import { useEffect } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart, Sword, FastForward } from "lucide-react";

interface TransitionScreenProps {
  stage: number; // これから挑むステージ (2, 3, 4)
  stats: PlayerStats;
  onNextStage: () => void;
}

export default function TransitionScreen({ stage, stats, onNextStage }: TransitionScreenProps) {
  useEffect(() => {
    audio.playStageClear();
  }, [stage]);

  // ステータスの割合や度合いの計算 (最大想定値に基づいたバー表示)
  const speedPercent = Math.min(100, ((stats.speed - 3) / 4) * 100); // speed範囲: 3 .. 7
  const atkPercent = Math.min(100, (stats.atk / 25) * 100);        // atk範囲: 5 .. 25
  const fireRatePercent = Math.min(100, ((1000 - stats.fireDelay) / 800) * 100); // delay範囲: 1000 .. 200ms
  const maxHpPercent = Math.min(100, (stats.maxHp / 200) * 100);    // maxHp範囲: 60 .. 200
  const defPercent = Math.min(100, (stats.defense / 50) * 100);     // defense範囲: 0 .. 50

  const getStageTitle = (s: number) => {
    switch (s) {
      case 2: return "ステージ２：実りの果樹園";
      case 3: return "ステージ３：嵐の野菜畑";
      case 4: return "ファイナルステージ：魔界のカボチャ大宮殿";
      default: return `ステージ ${s}`;
    }
  };

  const getStageDescription = (s: number) => {
    switch (s) {
      case 2: return "悪魔に汚染された美しい果樹園。すばやいピーマンやジグザグに動くナス悪魔が行く手を阻む！";
      case 3: return "激しい嵐が吹き荒れる荒野。ここからは鉄壁のガードを誇るブロッコリー悪魔が突進してくるぞ！";
      case 4: return "ついに魔界の最深部。すべての悪魔を統べる巨大カボチャ大王が、怒れる牙をむいて立ち塞がる！";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex flex-col items-center justify-center p-4 md:p-8 select-none relative overflow-hidden">
      {/* 背景の装飾的なグラデーションやパーティクル */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-950/15 via-slate-950 to-slate-950" />

      <div className="relative z-10 w-full max-w-2xl bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.65)] my-8">
        {/* CLEAR 演出 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            STAGE {stage - 1} CLEAN!
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent filter drop-shadow animate-pulse"
          >
            男の子が進化しました！
          </motion.h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2 flex justify-center items-center gap-1.5">
            野菜を吸収して眠れる潜在能力が覚醒！次の試練に備えよう。
          </p>
        </div>

        {/* プレイヤーの成長状況 (ビジュアライズされた能力バー) */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 mb-8 space-y-4 shadow-inner">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
            <Sword className="w-4 h-4 text-amber-500 animate-pulse" />
            現在の成長パラメータ
          </h3>

          {/* 1. 攻撃力 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sword className="w-3.5 h-3.5 text-emerald-500" />
                攻撃力 (ピーマン 🫑で強化)
              </span>
              <span className="font-mono text-emerald-400">{stats.atk} ATK</span>
            </div>
            <div className="w-full bg-slate-900/60 rounded-full h-3.5 overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, atkPercent)}%` }}
                transition={{ duration: 1.0, delay: 0.4 }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
          </div>

          {/* 2. 連射速度と同時弾数 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                射撃性能 (🌽で連射、🍆で同時弾数)
              </span>
              <span className="font-mono text-yellow-400">{(1000 / stats.fireDelay).toFixed(1)} 発/秒 ({stats.bulletCount}マルチ)</span>
            </div>
            <div className="w-full bg-slate-900/60 rounded-full h-3.5 overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, fireRatePercent)}%` }}
                transition={{ duration: 1.0, delay: 0.5 }}
                className="bg-yellow-500 h-full rounded-full"
              />
            </div>
          </div>

          {/* 3. 移動速度 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <FastForward className="w-3.5 h-3.5 text-amber-500" />
                移動速度 (にんじん 🥕で強化)
              </span>
              <span className="font-mono text-amber-400">{stats.speed.toFixed(1)} SPD</span>
            </div>
            <div className="w-full bg-slate-900/60 rounded-full h-3.5 overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, speedPercent)}%` }}
                transition={{ duration: 1.0, delay: 0.6 }}
                className="bg-amber-500 h-full rounded-full"
              />
            </div>
          </div>

          {/* 4. 体力上限 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                最大HP ＆ 回復 (トマト 🍅で強化)
              </span>
              <span className="font-mono text-red-400">{stats.hp} / {stats.maxHp} HP</span>
            </div>
            <div className="w-full bg-slate-900/60 rounded-full h-3.5 overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, maxHpPercent)}%` }}
                transition={{ duration: 1.0, delay: 0.7 }}
                className="bg-red-500 h-full rounded-full"
              />
            </div>
          </div>

          {/* 5. 防御力 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                ダメージ軽減 (ブロッコリー 🥦で強化)
              </span>
              <span className="font-mono text-teal-400">{stats.defense}% カット</span>
            </div>
            <div className="w-full bg-slate-900/60 rounded-full h-3.5 overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, defPercent)}%` }}
                transition={{ duration: 1.0, delay: 0.8 }}
                className="bg-teal-400 h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* 次ステージ予告 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-slate-950/50 backdrop-blur-md border border-slate-850/80 rounded-2xl p-5 mb-8 text-left"
        >
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">
            NEXT THREAT
          </span>
          <h4 className="text-lg font-black text-slate-100 flex items-center gap-1.5">
            {getStageTitle(stage)}
          </h4>
          <p className="text-slate-400 text-xs mt-2.5 leading-relaxed">
            {getStageDescription(stage)}
          </p>
        </motion.div>

        {/* アクション */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="w-full"
        >
          <button
            onClick={() => {
              audio.playPickup("CARROT");
              onNextStage();
            }}
            className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-lg font-black py-4 rounded-2xl transition hover:scale-102 active:scale-98 shadow-xl shadow-emerald-500/10 cursor-pointer"
          >
            {stage === 4 ? "最後の悪魔を討伐にいく！" : "次のステージへ進む"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
