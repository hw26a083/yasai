/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RankingEntry } from "../types";
import { Trophy, ArrowLeft, Calendar, Award, Star, Zap, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface RankingListProps {
  ranking: RankingEntry[];
  onBack: () => void;
  onClearRanking?: () => void;
}

export default function RankingList({ ranking, onBack, onClearRanking }: RankingListProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (onClearRanking) {
      onClearRanking();
    }
    setShowConfirm(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-12 px-4 md:px-8 bg-slate-950 text-white font-sans selection:bg-amber-500 selection:text-slate-900">
      <div className="absolute inset-0 bg-radial-gradient from-slate-900 via-slate-950 to-slate-950" />
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* ヘッダー */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-full mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent filter drop-shadow">
            野菜マスターハイスコア
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            歴代の勇者たちが残したスーパープレイ記録
          </p>
        </div>

        {/* ランキングテーブル */}
        <div className="w-full bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-4 md:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] mb-8">
          {ranking.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Award className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              まだスコアが記録されていません。<br />
              ゲームをクリアして最初のヒーローになろう！
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-4 px-3 w-16 text-center">順位</th>
                    <th className="py-4 px-3">プレイヤー名</th>
                    <th className="py-4 px-3 text-center">到達ステージ</th>
                    <th className="py-4 px-3 text-right">スコア</th>
                    <th className="py-4 px-3 text-center hidden md:table-cell">獲得したお野菜</th>
                    <th className="py-4 px-3 text-right hidden sm:table-cell">挑戦日</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {ranking.map((entry, index) => {
                    const isTop3 = index < 3;
                    const rankColors = [
                      "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]",
                      "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-950 shadow-[0_0_12px_rgba(203,213,225,0.4)]",
                      "bg-gradient-to-r from-amber-750 to-amber-850 text-white border border-amber-600/30 shadow-[0_0_10px_rgba(180,83,9,0.3)]"
                    ];

                    return (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        key={index}
                        className="group hover:bg-slate-800/20 transition-colors"
                      >
                        {/* 順位 */}
                        <td className="py-4 px-3 text-center font-black">
                          {isTop3 ? (
                            <span className={`inline-flex items-center justify-center w-7.5 h-7.5 rounded-full text-xs font-black ${rankColors[index]}`}>
                              {index + 1}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono">{index + 1}</span>
                          )}
                        </td>

                        {/* 名前 */}
                        <td className="py-4 px-3 font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                          <div className="flex items-center gap-2">
                            {entry.name || "ななしの勇者"}
                            {index === 0 && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin" style={{ animationDuration: "8s" }} />}
                          </div>
                        </td>

                        {/* ステージ */}
                        <td className="py-4 px-3 text-center font-bold">
                          {entry.stageReached === 4 ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              STAGE 4 (クリア!)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-850/80">
                              STAGE {entry.stageReached}
                            </span>
                          )}
                        </td>

                        {/* スコア */}
                        <td className="py-4 px-3 text-right font-mono text-base font-black text-amber-400">
                          {entry.score.toLocaleString()}
                        </td>

                        {/* 獲得野菜内訳 */}
                        <td className="py-4 px-3 text-center hidden md:table-cell">
                          <div className="inline-flex gap-2 text-xs bg-slate-950/60 border border-slate-850/70 px-3 py-1 rounded-full text-slate-400 font-bold">
                            <span title="にんじん">🥕{entry.carrot || 0}</span>
                            <span title="トマト">🍅{entry.tomato || 0}</span>
                            <span title="ピーマン">🫑{entry.pimiento || 0}</span>
                            <span title="ナス">🍆{entry.eggplant || 0}</span>
                            <span title="ブロッコリー">🥦{entry.broccoli || 0}</span>
                            <span title="トウモロコシ">🌽{entry.corn || 0}</span>
                          </div>
                        </td>

                        {/* 日付 */}
                        <td className="py-4 px-3 text-right text-xs text-slate-500 hidden sm:table-cell font-mono">
                          <div className="flex items-center justify-end gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(entry.date).toLocaleDateString("ja-JP")}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* アクション */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center px-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold py-3 px-8 rounded-full transition cursor-pointer shadow-md select-none group w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            タイトルへ戻る
          </button>

          {ranking.length > 0 && onClearRanking && (
            <div className="w-full sm:w-auto">
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-red-400 bg-slate-950/20 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 py-2 px-4 rounded-lg transition-all cursor-pointer w-full"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  ランキング初期化
                </button>
              ) : (
                <div className="flex gap-2 items-center bg-slate-900 p-2 border border-red-500/30 rounded-xl">
                  <span className="text-xs text-red-400 font-bold px-2">本当に消去しますか？</span>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    消去
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    キャンセル
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
