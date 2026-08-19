import React from 'react';
import { motion } from 'motion/react';
import { Gift, X, Check, Sparkles, Coins, Hammer, Bomb } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DailyRewardModalProps {
  dailyStreak: number;
  lastClaimTimestamp: number;
  onClaim: (day: number) => void;
  onClose: () => void;
}

const REWARDS = [
  { day: 1, title: '100 Coins', type: 'coins', amount: 100, icon: '🪙' },
  { day: 2, title: '150 Coins', type: 'coins', amount: 150, icon: '🪙' },
  { day: 3, title: 'Hammer + 100 Coins', type: 'combo', amount: 100, powerup: 'hammer', icon: '🔨' },
  { day: 4, title: '250 Coins', type: 'coins', amount: 250, icon: '🪙' },
  { day: 5, title: 'Bomb + 150 Coins', type: 'combo', amount: 150, powerup: 'bomb', icon: '💣' },
  { day: 6, title: '400 Coins', type: 'coins', amount: 400, icon: '🪙' },
  { day: 7, title: '1,000 Coins + Skin!', type: 'grand', amount: 1000, icon: '👑' },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  dailyStreak,
  lastClaimTimestamp,
  onClaim,
  onClose,
}) => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const timeSinceClaim = now - lastClaimTimestamp;
  const canClaim = lastClaimTimestamp === 0 || timeSinceClaim >= ONE_DAY_MS;

  // Streak day is (dailyStreak % 7) + 1
  const currentStreakDay = canClaim ? (dailyStreak % 7) + 1 : Math.max(1, dailyStreak % 7 || 7);

  const handleClaim = () => {
    soundEngine.playDailyReward();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClaim(currentStreakDay);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-750 rounded-3xl p-5 shadow-2xl flex flex-col relative"
      >
        {/* Close button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
            <Gift className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-white font-['Outfit']">Daily Login Rewards</h2>
            <span className="text-xs text-amber-400 font-bold">
              Current Streak: {dailyStreak} Days 🔥
            </span>
          </div>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {REWARDS.slice(0, 6).map(r => {
            const isCompleted = !canClaim ? r.day <= currentStreakDay : r.day < currentStreakDay;
            const isToday = canClaim && r.day === currentStreakDay;

            return (
              <div
                key={`day-${r.day}`}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all text-center relative ${
                  isToday
                    ? 'bg-gradient-to-b from-amber-500/20 to-yellow-500/10 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-800 text-slate-500'
                    : 'bg-slate-850 border-slate-750 text-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 mb-1">DAY {r.day}</span>
                <span className="text-2xl mb-1">{r.icon}</span>
                <span className="text-[10px] font-bold text-amber-300 line-clamp-1">{r.title}</span>

                {isCompleted && (
                  <div className="absolute inset-0 bg-slate-950/75 rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Day 7 Grand Reward spanning 3 cols */}
          <div
            className={`col-span-3 p-3 rounded-2xl border transition-all flex items-center justify-between relative overflow-hidden ${
              canClaim && currentStreakDay === 7
                ? 'bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-rose-500/20 border-amber-400 ring-2 ring-amber-400 shadow-xl'
                : !canClaim && currentStreakDay === 7
                ? 'bg-slate-900/60 border-slate-800 text-slate-500'
                : 'bg-slate-850 border-slate-750 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">
                👑
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-amber-400">DAY 7 • GRAND PRIZE</span>
                <span className="text-sm font-black text-white font-['Outfit']">1,000 Coins + VIP Skin</span>
              </div>
            </div>

            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />

            {!canClaim && currentStreakDay === 7 && (
              <div className="absolute inset-0 bg-slate-950/75 rounded-2xl flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Claim Action */}
        {canClaim ? (
          <button
            onClick={handleClaim}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>CLAIM DAY {currentStreakDay} REWARD</span>
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center gap-2">
            <span>Come back tomorrow for your next reward!</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
