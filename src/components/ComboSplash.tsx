import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Zap, Flame, Sparkles } from 'lucide-react';

interface ComboSplashProps {
  combo: number;
  onComplete: () => void;
}

export const ComboSplash: React.FC<ComboSplashProps> = ({ combo, onComplete }) => {
  useEffect(() => {
    if (combo < 2) return;

    // Trigger canvas confetti bursts based on combo magnitude
    if (combo >= 4) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6'],
      });
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 1400);
    return () => clearTimeout(timer);
  }, [combo, onComplete]);

  if (combo < 2) return null;

  const getComboText = (c: number) => {
    if (c === 2) return { title: 'COOL!', subtitle: 'Combo x2', color: 'from-cyan-400 to-blue-500' };
    if (c === 3) return { title: 'GREAT!', subtitle: 'Combo x3', color: 'from-amber-400 to-orange-500' };
    if (c === 4) return { title: 'AMAZING!', subtitle: 'Combo x4', color: 'from-rose-400 to-red-600' };
    if (c === 5) return { title: 'UNBELIEVABLE!', subtitle: 'Combo x5', color: 'from-purple-400 to-fuchsia-600' };
    return { title: 'IMRAN BLAST!', subtitle: `Mega Streak x${c}`, color: 'from-yellow-300 via-amber-400 to-rose-500' };
  };

  const info = getComboText(combo);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.3, y: 30 }}
        animate={{ opacity: 1, scale: 1.1, y: 0 }}
        exit={{ opacity: 0, scale: 1.4, y: -40 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center select-none"
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            {combo >= 5 ? (
              <Flame className="w-8 h-8 text-amber-400 animate-bounce" />
            ) : (
              <Sparkles className="w-6 h-6 text-cyan-300 animate-spin" />
            )}
            <span
              className={`text-4xl sm:text-5xl font-black font-['Outfit'] italic tracking-wider uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}
            >
              {info.title}
            </span>
            {combo >= 5 && <Flame className="w-8 h-8 text-rose-500 animate-bounce" />}
          </div>

          <div className="px-4 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-sm font-black text-amber-300 tracking-wide font-['Outfit']">
              {info.subtitle}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
