import React from 'react';
import { Trophy, Coins, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TopBarProps {
  score: number;
  highScore: number;
  coins: number;
  level: number;
  xp: number;
  combo: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPause: () => void;
  onOpenShop: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  score,
  highScore,
  coins,
  level,
  xp,
  combo,
  soundEnabled,
  onToggleSound,
  onPause,
  onOpenShop,
}) => {
  // XP required for next level: 500 * level
  const xpNeeded = level * 500;
  const xpPercentage = Math.min(100, Math.max(0, (xp / xpNeeded) * 100));

  return (
    <div className="w-full px-4 pt-2 pb-2 flex flex-col gap-2 select-none">
      {/* Upper Status Row: Level, Coins, Sound, Pause */}
      <div className="flex items-center justify-between gap-2">
        {/* Level & XP pill */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/70 px-2.5 py-1 rounded-2xl shadow-sm">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-inner">
            {level}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-amber-400 leading-none">LVL {level}</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-0.5 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Coins Pill */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenShop();
          }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/20 border border-amber-500/40 hover:border-amber-400/70 px-3 py-1 rounded-2xl transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-xs font-black text-amber-300 tracking-wide font-['Outfit']">
            {coins.toLocaleString()}
          </span>
          <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center ml-0.5">
            +
          </span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleSound();
            }}
            className="p-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 active:scale-95 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onPause();
            }}
            className="p-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 active:scale-95 transition-colors cursor-pointer"
            title="Pause Game"
          >
            <Pause className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Main Score Board */}
      <div className="flex items-center justify-between bg-gradient-to-b from-slate-900/95 to-slate-900/60 border border-slate-800/90 rounded-2xl px-4 py-2.5 shadow-lg backdrop-blur-md">
        {/* Current Score */}
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SCORE</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-white font-['Outfit'] drop-shadow-md">
              {score.toLocaleString()}
            </span>
            {combo > 1 && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-xs animate-bounce shadow-md shadow-orange-500/40">
                <Sparkles className="w-3 h-3" />
                x{combo}
              </span>
            )}
          </div>
        </div>

        {/* High Score */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400/90">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>BEST</span>
          </div>
          <span className="text-xl font-bold text-amber-300/90 font-['Outfit']">
            {highScore.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
