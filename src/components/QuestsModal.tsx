import React from 'react';
import { motion } from 'motion/react';
import { Zap, X, Check, Coins, Sparkles } from 'lucide-react';
import { Quest } from '../types';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QuestsModalProps {
  quests: Quest[];
  onClaimQuest: (questId: string, rewardCoins: number) => void;
  onClose: () => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  quests,
  onClaimQuest,
  onClose,
}) => {
  const handleClaim = (q: Quest) => {
    soundEngine.playCoin();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onClaimQuest(q.id, q.rewardCoins);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md h-[90vh] max-h-[600px] bg-slate-900 border border-slate-750 rounded-3xl p-4 shadow-2xl flex flex-col relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit'] leading-tight">Daily Missions</h2>
              <span className="text-[11px] text-slate-400">Complete tasks to earn coins</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quests List */}
        <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-2.5">
          {quests.map(q => {
            const isCompleted = q.progress >= q.target;
            const progressPercent = Math.min(100, Math.max(0, (q.progress / q.target) * 100));

            return (
              <div
                key={q.id}
                className={`p-3 rounded-2xl border transition-all ${
                  q.claimed
                    ? 'bg-slate-950/40 border-slate-800 opacity-60'
                    : isCompleted
                    ? 'bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border-amber-400/80 shadow-md shadow-amber-950/30'
                    : 'bg-slate-850/80 border-slate-750'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{q.icon}</span>
                    <div>
                      <span className="text-xs font-black text-white leading-tight block">{q.title}</span>
                      <span className="text-[10px] text-slate-400">{q.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-xl">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-black text-amber-300 font-['Outfit']">+{q.rewardCoins}</span>
                  </div>
                </div>

                {/* Progress Bar & Claim Button */}
                <div className="flex items-center justify-between gap-3 mt-1">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                      <span>Progress</span>
                      <span>
                        {Math.min(q.progress, q.target)} / {q.target}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                            : 'bg-cyan-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {q.claimed ? (
                    <div className="px-3 py-1 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Claimed</span>
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(q)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1 animate-pulse"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>CLAIM</span>
                    </button>
                  ) : (
                    <div className="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-500 font-bold text-[11px]">
                      In Progress
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
