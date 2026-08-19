import React from 'react';
import { motion } from 'motion/react';
import { Settings, X, Volume2, Music, Vibrate, Smartphone, Moon, Sun, Trash2, HelpCircle } from 'lucide-react';
import { GameSettings } from '../types';
import { soundEngine } from '../utils/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenTutorial: () => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onOpenTutorial,
  onResetData,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md h-[90vh] max-h-[640px] bg-slate-900 border border-slate-750 rounded-3xl p-4 shadow-2xl flex flex-col relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit'] leading-tight">Settings</h2>
              <span className="text-[11px] text-slate-400">Audio, graphics & preferences</span>
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

        {/* Options List */}
        <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-3">
          {/* Sound FX */}
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-xs font-bold text-white block">Sound Effects</span>
                <span className="text-[10px] text-slate-400">Pops, blasts & combo chimes</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onUpdateSettings({ soundEnabled: !settings.soundEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Background Music */}
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Music className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-xs font-bold text-white block">Background Music</span>
                <span className="text-[10px] text-slate-400">Procedural ambient synth melody</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onUpdateSettings({ musicEnabled: !settings.musicEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.musicEnabled ? 'bg-purple-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Haptics / Vibration */}
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">Vibration / Haptics</span>
                <span className="text-[10px] text-slate-400">Tactile block placement feedback</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.vibrationEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 ${
                  settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Theme Mode */}
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col gap-2">
            <span className="text-xs font-bold text-white">Theme Palette</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onUpdateSettings({ themeMode: 'dark' });
                }}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  settings.themeMode === 'dark'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-750 text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onUpdateSettings({ themeMode: 'light' });
                }}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  settings.themeMode === 'light'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-750 text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onUpdateSettings({ themeMode: 'amoled' });
                }}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  settings.themeMode === 'amoled'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-slate-900 border-slate-750 text-slate-400'
                }`}
              >
                <span>AMOLED</span>
              </button>
            </div>
          </div>

          {/* Android View Frame Toggle */}
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-xs font-bold text-white block">Android Device Mockup</span>
                <span className="text-[10px] text-slate-400">Smartphone bezel frame & notch</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onUpdateSettings({ androidFrame: !settings.androidFrame });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.androidFrame ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 ${
                  settings.androidFrame ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Tutorial Link */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenTutorial();
            }}
            className="w-full p-3 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-750 flex items-center justify-between text-slate-200 cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <div className="text-left">
                <span className="text-xs font-bold block">How to Play</span>
                <span className="text-[10px] text-slate-400">Rules, mechanics & combo multipliers</span>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-400">View</span>
          </button>

          {/* Reset Data */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all game data and scores?')) {
                onResetData();
              }
            }}
            className="w-full p-3 rounded-2xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-800/40 flex items-center justify-between text-rose-400 cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-5 h-5" />
              <div className="text-left">
                <span className="text-xs font-bold block">Reset All Game Progress</span>
                <span className="text-[10px] text-rose-400/70">Clears high score, level & inventory</span>
              </div>
            </div>
            <span className="text-xs font-bold">Reset</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
