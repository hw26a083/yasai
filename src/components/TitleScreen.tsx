/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Play, Trophy, Volume2, VolumeX, Shield, Zap, Sparkles, Swords, Milestone } from "lucide-react";
import { audio } from "../utils/audio";
import { useState } from "react";
import titleImg from "../assets/images/veggie_shooter_title_1781068653249.png";

interface TitleScreenProps {
  onStartGame: () => void;
  onShowRanking: () => void;
}

export default function TitleScreen({ onStartGame, onShowRanking }: TitleScreenProps) {
  const [muted, setMuted] = useState(audio.isMuted);

  const toggleMute = () => {
    audio.isMuted = !audio.isMuted;
    setMuted(audio.isMuted);
    audio.playPickup("TOMATO"); // テストトーン
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white font-sans selection:bg-amber-500 selection:text-slate-900">
      {/* 背景イラスト */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 filter blur-xs md:blur-none scale-105 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${titleImg})` }}
      />
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

      {/* コンテンツ */}
      <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center">
        {/* ミュートトグル */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 md:top-8 md:right-8 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-full p-3 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg"
          title={muted ? "消音解除" : "消音"}
        >
          {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        {/* サブタイトル */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider mb-4"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          野菜に立ち向かう、男の子の成長物語
        </motion.div>

        {/* メインタイトル */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent filter drop-shadow-md"
        >
          野菜悪魔シューティング
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed drop-shadow"
        >
          魔界の野菜悪魔たちに襲われた村を守るため、勇敢な男の子がスプリンクラーガンを手に立ち上がる！
          倒した野菜をパクパク食べて自分をパワーアップさせ、ステージ4の最深部に潜む<b>カボチャ大王</b>を討伐しよう！
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 w-full max-w-3xl mb-12"
        >
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 p-3.5 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] group">
            <span className="text-3xl mb-1.5 filter drop-shadow select-none group-hover:scale-110 transition-transform">🥕</span>
            <span className="text-xs font-black tracking-wider text-amber-400">にんじん</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium font-mono uppercase tracking-wide">SPD: +SPEED</span>
          </div>
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 p-3.5 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] group">
            <span className="text-3xl mb-1.5 filter drop-shadow select-none group-hover:scale-110 transition-transform">🍅</span>
            <span className="text-xs font-black tracking-wider text-red-400">トマト</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium font-mono uppercase tracking-wide">HP: HEAL & MAX</span>
          </div>
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 p-3.5 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] group">
            <span className="text-3xl mb-1.5 filter drop-shadow select-none group-hover:scale-110 transition-transform">🫑</span>
            <span className="text-xs font-black tracking-wider text-emerald-400">ピーマン</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium font-mono uppercase tracking-wide">ATK: +POWER</span>
          </div>
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 p-3.5 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group">
            <span className="text-3xl mb-1.5 filter drop-shadow select-none group-hover:scale-110 transition-transform">🍆</span>
            <span className="text-xs font-black tracking-wider text-purple-400">ナス</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium font-mono uppercase tracking-wide">BUL: +RAPID</span>
          </div>
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 p-3.5 rounded-xl flex flex-col items-center justify-center col-span-2 sm:col-span-1 transition-all duration-300 hover:border-teal-500/50 hover:shadow-[0_0_15px_rgba(45,212,191,0.15)] group">
            <span className="text-3xl mb-1.5 filter drop-shadow select-none group-hover:scale-110 transition-transform">🥦</span>
            <span className="text-xs font-black tracking-wider text-teal-400">ブロッコリー</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium font-mono uppercase tracking-wide">DEF: +ARMOR</span>
          </div>
        </motion.div>

        {/* アクションボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-5 w-full justify-center mb-10"
        >
          <button
            onClick={() => {
              audio.playPickup("CARROT");
              onStartGame();
            }}
            className="group flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-lg font-black py-4.5 px-12 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer tracking-wider"
          >
            <Play className="w-5.5 h-5.5 fill-slate-950" />
            ゲームを始める
          </button>
          
          <button
            onClick={onShowRanking}
            className="flex items-center justify-center gap-2.5 bg-slate-900/75 backdrop-blur-xl hover:bg-slate-800/85 border border-slate-800/80 text-slate-150 text-lg font-extrabold py-4.5 px-12 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-slate-700 hover:text-white"
          >
            <Trophy className="w-5.5 h-5.5 text-amber-500 animate-pulse" />
            ハイスコア順位表
          </button>
        </motion.div>

        {/* コントロール説明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.0 }}
          className="bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl max-w-xl text-left shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <h3 className="text-xs font-black text-slate-350 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <Swords className="w-4 h-4 text-amber-500 animate-pulse" />
            操作方法（PC ＆ モバイル対応）
          </h3>
          <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4.5 tracking-wide leading-relaxed">
            <li><b>移動:</b> キーボード <kbd className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[10px] text-slate-200">W</kbd> <kbd className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[10px] text-slate-200">A</kbd> <kbd className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[10px] text-slate-200">S</kbd> <kbd className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[10px] text-slate-200">D</kbd> / または <kbd className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[10px] text-slate-200">↑</kbd><kbd className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[10px] text-slate-200">↓</kbd><kbd className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[10px] text-slate-200">←</kbd><kbd className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[10px] text-slate-200">→</kbd> 、もしくは画面タッチのバーチャルジョイスティック。</li>
            <li><b>射撃:</b> 水鉄砲は自動射撃！カーソルの方向、または一番近い敵への自動オートエイム（タッチ中はジョイスティック角度へ連射）。</li>
            <li><b>魔野菜の摂取:</b> 倒した敵が野菜を落とします！プレイヤーが近くに寄ると、重力フィールドのようにスルスルと自動吸引されます。</li>
          </ul>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] text-slate-500 font-mono">
        v1.0.0 | © 2026 野菜悪魔シューティング
      </div>
    </div>
  );
}
