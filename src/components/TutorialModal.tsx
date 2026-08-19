import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, X, Sparkles, Zap, Flame, Hammer } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
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
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit'] leading-tight">How to Play</h2>
              <span className="text-[11px] text-slate-400">Mastering Imran Blast</span>
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

        {/* Steps */}
        <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-3 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black flex-shrink-0 text-sm">
              1
            </div>
            <div>
              <span className="font-bold text-white text-sm block mb-0.5">Drag & Drop Blocks</span>
              <p className="text-slate-400 leading-relaxed">
                Pick up any of the 3 blocks in the bottom tray and drag them onto the 8×8 grid. A placement preview highlights in green when valid.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black flex-shrink-0 text-sm">
              2
            </div>
            <div>
              <span className="font-bold text-white text-sm block mb-0.5">Clear Rows & Columns</span>
              <p className="text-slate-400 leading-relaxed">
                Fill complete horizontal lines or vertical columns to blast them! Clearing multiple lines at once earns massive bonus points.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black flex-shrink-0 text-sm">
              3
            </div>
            <div>
              <span className="font-bold text-white text-sm block mb-0.5">Build Chain Combos</span>
              <p className="text-slate-400 leading-relaxed">
                Clear lines on consecutive moves to build up your Combo streak (2x, 3x, 4x, 5x+). Combos multiply your scores exponentially!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black flex-shrink-0 text-sm">
              4
            </div>
            <div>
              <span className="font-bold text-white text-sm block mb-0.5">Use Powerful Boosters</span>
              <p className="text-slate-400 leading-relaxed">
                Stuck in a pinch? Use the <strong>Hammer</strong> to smash any obstacle, <strong>Bomb</strong> for a 3x3 blast, or <strong>Reroll</strong> to refresh tray pieces.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-md shadow-cyan-500/30 cursor-pointer active:scale-95 transition-all"
        >
          GOT IT, LET'S PLAY!
        </button>
      </motion.div>
    </div>
  );
};
