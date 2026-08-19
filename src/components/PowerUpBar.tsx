import React from 'react';
import { Hammer, Bomb, RefreshCw, Undo2, Plus } from 'lucide-react';
import { ActivePowerUp } from '../types';
import { soundEngine } from '../utils/audio';

interface PowerUpBarProps {
  powerups: {
    hammer: number;
    bomb: number;
    reroll: number;
    undo: number;
  };
  activePowerUp: ActivePowerUp;
  canUndo: boolean;
  onSelectPowerUp: (type: 'hammer' | 'bomb') => void;
  onReroll: () => void;
  onUndo: () => void;
  onBuyPowerUp: (type: 'hammer' | 'bomb' | 'reroll' | 'undo', cost: number) => void;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({
  powerups,
  activePowerUp,
  canUndo,
  onSelectPowerUp,
  onReroll,
  onUndo,
  onBuyPowerUp,
}) => {
  return (
    <div className="w-full px-4 py-1.5 flex items-center justify-between gap-2 max-w-[380px] mx-auto select-none">
      {/* Hammer PowerUp */}
      <button
        onClick={() => {
          soundEngine.playClick();
          if (powerups.hammer > 0) {
            onSelectPowerUp('hammer');
          } else {
            onBuyPowerUp('hammer', 150);
          }
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border transition-all cursor-pointer relative ${
          activePowerUp === 'hammer'
            ? 'bg-amber-500/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 scale-105 shadow-md shadow-amber-500/30'
            : 'bg-slate-900/80 hover:bg-slate-850 border-slate-750 text-slate-300'
        }`}
      >
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
          <Hammer className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold mt-1">Hammer</span>
        <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 min-w-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
          {powerups.hammer > 0 ? powerups.hammer : <Plus className="w-2.5 h-2.5" />}
        </div>
      </button>

      {/* Bomb PowerUp */}
      <button
        onClick={() => {
          soundEngine.playClick();
          if (powerups.bomb > 0) {
            onSelectPowerUp('bomb');
          } else {
            onBuyPowerUp('bomb', 250);
          }
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border transition-all cursor-pointer relative ${
          activePowerUp === 'bomb'
            ? 'bg-rose-500/30 border-rose-400 text-rose-300 ring-2 ring-rose-400/50 scale-105 shadow-md shadow-rose-500/30'
            : 'bg-slate-900/80 hover:bg-slate-850 border-slate-750 text-slate-300'
        }`}
      >
        <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
          <Bomb className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold mt-1">Bomb 3x3</span>
        <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 min-w-4 rounded-full bg-rose-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
          {powerups.bomb > 0 ? powerups.bomb : <Plus className="w-2.5 h-2.5" />}
        </div>
      </button>

      {/* Reroll Tray PowerUp */}
      <button
        onClick={() => {
          soundEngine.playClick();
          if (powerups.reroll > 0) {
            onReroll();
          } else {
            onBuyPowerUp('reroll', 100);
          }
        }}
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-750 text-slate-300 transition-all cursor-pointer relative active:scale-95"
      >
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
          <RefreshCw className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold mt-1">Reroll</span>
        <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 min-w-4 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
          {powerups.reroll > 0 ? powerups.reroll : <Plus className="w-2.5 h-2.5" />}
        </div>
      </button>

      {/* Undo Last Move */}
      <button
        disabled={!canUndo && powerups.undo <= 0}
        onClick={() => {
          soundEngine.playClick();
          if (powerups.undo > 0 && canUndo) {
            onUndo();
          } else if (powerups.undo <= 0) {
            onBuyPowerUp('undo', 100);
          }
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border transition-all relative ${
          !canUndo && powerups.undo > 0
            ? 'opacity-50 cursor-not-allowed bg-slate-900/50 border-slate-800 text-slate-500'
            : 'bg-slate-900/80 hover:bg-slate-850 border-slate-750 text-slate-300 active:scale-95 cursor-pointer'
        }`}
      >
        <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
          <Undo2 className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold mt-1">Undo</span>
        <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 min-w-4 rounded-full bg-purple-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
          {powerups.undo > 0 ? powerups.undo : <Plus className="w-2.5 h-2.5" />}
        </div>
      </button>
    </div>
  );
};
