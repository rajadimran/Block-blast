import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  RefreshCw,
  Home,
  Sparkles,
  Coins,
  Zap,
  HeartPulse,
  Tv,
  Share2,
  Check,
  Flame,
  Award,
  Layers,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  coinsEarned: number;
  linesCleared: number;
  maxCombo: number;
  levelReached: number;
  userCoins: number;
  revivesUsed: number;
  onRestart: () => void;
  onHome: () => void;
  onReviveWithCoins: () => void;
  onReviveWithAd: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  coinsEarned,
  linesCleared,
  maxCombo,
  levelReached,
  userCoins,
  revivesUsed,
  onRestart,
  onHome,
  onReviveWithCoins,
  onReviveWithAd,
}) => {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const reviveCoinCost = 200 * (revivesUsed + 1);
  const canAffordRevive = userCoins >= reviveCoinCost;

  // Animated Score Counting Effect
  useEffect(() => {
    if (isNewHighScore) {
      soundEngine.playHighScore();
    }

    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * score);
      setDisplayedScore(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedScore(score);
      }
    };

    const rafId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(rafId);
  }, [score, isNewHighScore]);

  // Confetti Particle Effect on New High Score
  useEffect(() => {
    if (!isNewHighScore) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#34d399', '#f97316'];
    const particles = Array.from({ length: 60 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.rotation += p.rotSpeed;
        p.opacity -= 0.008;

        if (p.opacity > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isNewHighScore]);

  const handleShare = () => {
    soundEngine.playClick();
    if (navigator.share) {
      navigator
        .share({
          title: 'Imran Blast',
          text: `💥 I just scored ${score.toLocaleString()} points and reached Level ${levelReached} in Imran Blast! Can you beat my high score? 🚀`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `💥 I scored ${score.toLocaleString()} points and reached Level ${levelReached} in Imran Blast! Can you beat my high score? 🚀`
      );
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 select-none overflow-hidden">
      {/* High Score Confetti Canvas */}
      {isNewHighScore && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-750 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center relative z-20 overflow-hidden"
      >
        {/* Glow Ambient Top Highlight */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-28 rounded-full blur-3xl pointer-events-none ${
            isNewHighScore ? 'bg-amber-500/25' : 'bg-rose-500/15'
          }`}
        />

        {/* Large Game Over Emblem */}
        <motion.div
          initial={{ scale: 0.5, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2.5 shadow-xl border ${
            isNewHighScore
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-500/30'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-950/50'
          }`}
        >
          {isNewHighScore ? (
            <Trophy className="w-8 h-8 animate-bounce" />
          ) : (
            <HeartPulse className="w-8 h-8 animate-pulse" />
          )}
        </motion.div>

        {/* Large Game Over Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
          {isNewHighScore ? 'NEW RECORD!' : 'GAME OVER'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-3 font-medium">
          {isNewHighScore
            ? 'Incredible run! You set a brand new best score.'
            : 'No valid spaces left on the board.'}
        </p>

        {/* Main Score & Stats Card */}
        <div className="w-full bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 mb-3 relative shadow-inner">
          {isNewHighScore && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-md shadow-amber-500/40 animate-pulse">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span>HIGH SCORE!</span>
            </div>
          )}

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              FINAL SCORE
            </span>
            <span className="text-4xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight mt-0.5 drop-shadow">
              {displayedScore.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-extrabold mt-1">
              <Trophy className="w-3.5 h-3.5 fill-amber-400" />
              <span>Best: {Math.max(score, highScore).toLocaleString()}</span>
            </div>
          </div>

          {/* 4-Item Stats Matrix */}
          <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-850 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                <Coins className="w-2.5 h-2.5 text-amber-400" />
                Coins
              </span>
              <span className="font-black text-amber-300 font-['Outfit'] text-sm">
                +{coinsEarned}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                <Award className="w-2.5 h-2.5 text-cyan-400" />
                Level
              </span>
              <span className="font-black text-cyan-300 font-['Outfit'] text-sm">
                {levelReached}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                <Layers className="w-2.5 h-2.5 text-emerald-400" />
                Lines
              </span>
              <span className="font-black text-emerald-300 font-['Outfit'] text-sm">
                {linesCleared}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 text-orange-400" />
                Combo
              </span>
              <span className="font-black text-orange-400 font-['Outfit'] text-sm">
                x{maxCombo}
              </span>
            </div>
          </div>
        </div>

        {/* Revive / Continue Options (Optional) */}
        {revivesUsed < 2 && (
          <div className="w-full flex flex-col gap-2 mb-3">
            <button
              onClick={() => {
                soundEngine.playClick();
                if (canAffordRevive) onReviveWithCoins();
              }}
              disabled={!canAffordRevive}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-between transition-all cursor-pointer shadow-md ${
                canAffordRevive
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/20 active:scale-95'
                  : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-current text-amber-950" />
                <span>CONTINUE & CLEAR SPACE</span>
              </div>
              <span className="flex items-center gap-1 font-black bg-slate-950/40 px-2 py-0.5 rounded-lg text-[11px] text-slate-950">
                <Coins className="w-3 h-3 fill-current" />
                {reviveCoinCost}
              </span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onReviveWithAd();
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span>Watch Ad to Revive Free</span>
            </button>
          </div>
        )}

        {/* Bottom Actions: Play Again, Share, Home */}
        <div className="w-full flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onRestart();
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/35 border-t border-cyan-300/40 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={handleShare}
            className="p-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95 shadow-md"
            title="Share Score"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onHome();
            }}
            className="p-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95 shadow-md"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Copied Toast Notification */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-2 px-3 py-1 bg-emerald-500 text-slate-950 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg"
            >
              <Check className="w-3 h-3" />
              <span>Score copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
