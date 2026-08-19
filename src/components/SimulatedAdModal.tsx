import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tv, X, Check, Coins, Sparkles, Volume2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SimulatedAdModalProps {
  rewardDescription: string;
  onRewardEarned: () => void;
  onClose: () => void;
}

export const SimulatedAdModal: React.FC<SimulatedAdModalProps> = ({
  rewardDescription,
  onRewardEarned,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (!completed) {
      setCompleted(true);
      soundEngine.playCoin();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      onRewardEarned();
    }
  }, [countdown, completed, onRewardEarned]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Top Ad Info Banner */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">
              AdMob Demo
            </span>
            <span>Reward Video</span>
          </div>

          <div className="flex items-center gap-2">
            {completed ? (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 font-black text-amber-400 text-[11px] font-['Outfit']">
                Reward in {countdown}s
              </span>
            )}
          </div>
        </div>

        {/* Video Simulation Canvas */}
        <div className="w-full h-48 my-4 rounded-2xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 flex flex-col items-center justify-center relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-3xl mb-2"
          >
            🚀
          </motion.div>
          <span className="text-sm font-black text-white font-['Outfit']">
            Imran Blast Premium Pass
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            Play anywhere, anytime with zero lag!
          </span>

          {/* Progress bar at bottom of video */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-950">
            <div
              className="h-full bg-cyan-400 transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Reward Status */}
        {completed ? (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <Check className="w-4 h-4" />
              <span>Reward Granted: {rewardDescription}</span>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-md cursor-pointer active:scale-95 transition-all"
            >
              COLLECT & RETURN
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Please watch until the timer completes to receive your reward.
          </p>
        )}
      </motion.div>
    </div>
  );
};
