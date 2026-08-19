import React from 'react';
import { motion } from 'motion/react';
import { Play, RefreshCw, Home, Settings, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface PauseModalProps {
  score: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  soundEnabled,
  onToggleSound,
  onResume,
  onRestart,
  onHome,
  onOpenSettings,
  onOpenTutorial,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xs bg-slate-900 border border-slate-750 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center"
      >
        <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-tight mb-1">
          Game Paused
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Current Score: <span className="font-bold text-cyan-300 font-['Outfit']">{score.toLocaleString()}</span>
        </p>

        <div className="w-full flex flex-col gap-2.5">
          {/* Resume Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME GAME</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESTART MATCH</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleSound();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span>Sound Effects: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <div className="grid grid-cols-3 gap-2 mt-1">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenTutorial();
              }}
              className="py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-300 flex flex-col items-center justify-center gap-1 text-[10px] font-bold active:scale-95 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Rules</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenSettings();
              }}
              className="py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-300 flex flex-col items-center justify-center gap-1 text-[10px] font-bold active:scale-95 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onHome();
              }}
              className="py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-300 flex flex-col items-center justify-center gap-1 text-[10px] font-bold active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4 text-rose-400" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
