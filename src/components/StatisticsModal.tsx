import React from 'react';
import { motion } from 'motion/react';
import { BarChart2, X, Trophy, Flame, Zap, Clock, Coins, Compass, Grid, Sparkles } from 'lucide-react';
import { GameStats } from '../types';
import { soundEngine } from '../utils/audio';

interface StatisticsModalProps {
  stats: GameStats;
  onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ stats, onClose }) => {
  const avgScore = stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;

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
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit'] leading-tight">Career Statistics</h2>
              <span className="text-[11px] text-slate-400">Your total puzzle journey</span>
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

        {/* Stats Grid */}
        <div className="flex-1 overflow-y-auto pr-1 my-3 grid grid-cols-2 gap-2.5">
          {/* High Score */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/15 to-yellow-500/5 border border-amber-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">High Score</span>
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-amber-300 font-['Outfit']">
              {stats.highScore.toLocaleString()}
            </span>
          </div>

          {/* Highest Combo */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-orange-500/15 to-rose-500/5 border border-orange-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-orange-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Best Combo</span>
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-orange-300 font-['Outfit']">
              x{stats.highestCombo}
            </span>
          </div>

          {/* Games Played */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-cyan-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Games Played</span>
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-white font-['Outfit']">
              {stats.gamesPlayed.toLocaleString()}
            </span>
          </div>

          {/* Total Lines Cleared */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Lines Cleared</span>
              <Grid className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-emerald-300 font-['Outfit']">
              {stats.totalLinesCleared.toLocaleString()}
            </span>
          </div>

          {/* Blocks Placed */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-purple-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Blocks Placed</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-white font-['Outfit']">
              {stats.totalBlocksPlaced.toLocaleString()}
            </span>
          </div>

          {/* Average Score */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Average Score</span>
              <BarChart2 className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-blue-300 font-['Outfit']">
              {avgScore.toLocaleString()}
            </span>
          </div>

          {/* Total Coins Earned */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Coins Earned</span>
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-amber-300 font-['Outfit']">
              {stats.totalCoinsEarned.toLocaleString()}
            </span>
          </div>

          {/* Lucky Wheel Spins */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-fuchsia-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Wheel Spins</span>
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-fuchsia-300 font-['Outfit']">
              {stats.luckySpinsCount.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
