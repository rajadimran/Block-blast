import React from 'react';
import { motion } from 'motion/react';
import { Award, X, Check, Coins, Sparkles, Lock } from 'lucide-react';
import { Achievement } from '../types';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClaimAchievement: (achievementId: string, rewardCoins: number) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClaimAchievement,
  onClose,
}) => {
  const handleClaim = (ach: Achievement) => {
    soundEngine.playAchievement();
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClaimAchievement(ach.id, ach.rewardCoins);
  };

  const getTierBadge = (tier: Achievement['tier']) => {
    switch (tier) {
      case 'bronze':
        return 'bg-amber-800/40 text-amber-300 border-amber-700/60';
      case 'silver':
        return 'bg-slate-700/60 text-slate-200 border-slate-500/60';
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/60';
      case 'diamond':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/70';
    }
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
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit'] leading-tight">Achievements</h2>
              <span className="text-[11px] text-slate-400">Unlock trophies & rewards</span>
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

        {/* Achievements Grid */}
        <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-2.5">
          {achievements.map(ach => {
            const isCompleted = ach.current >= ach.target;
            const progressPercent = Math.min(100, Math.max(0, (ach.current / ach.target) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border transition-all ${
                  ach.unlocked
                    ? 'bg-slate-950/40 border-slate-800 opacity-60'
                    : isCompleted
                    ? 'bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border-indigo-400 shadow-md shadow-indigo-950/50'
                    : 'bg-slate-850/80 border-slate-750'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                      {isCompleted || ach.unlocked ? ach.icon : <Lock className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white leading-tight">{ach.title}</span>
                        <span className={`px-1.5 py-0.2 rounded border text-[9px] font-black uppercase ${getTierBadge(ach.tier)}`}>
                          {ach.tier}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{ach.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-xl">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-black text-amber-300 font-['Outfit']">+{ach.rewardCoins}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between gap-3 mt-1">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                      <span>Milestone</span>
                      <span>
                        {Math.min(ach.current, ach.target)} / {ach.target}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {ach.unlocked ? (
                    <div className="px-3 py-1 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Unlocked</span>
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(ach)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1 animate-pulse"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>CLAIM</span>
                    </button>
                  ) : (
                    <div className="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-500 font-bold text-[11px]">
                      Locked
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
