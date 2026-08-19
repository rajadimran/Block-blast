import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Compass, X, Sparkles, Coins, Gift } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface WheelPrize {
  id: string;
  name: string;
  type: 'coins' | 'hammer' | 'bomb' | 'reroll' | 'jackpot';
  amount: number;
  color: string;
  icon: string;
}

const WHEEL_PRIZES: WheelPrize[] = [
  { id: '1', name: '100 Coins', type: 'coins', amount: 100, color: '#0284c7', icon: '🪙' },
  { id: '2', name: 'Hammer x1', type: 'hammer', amount: 1, color: '#f59e0b', icon: '🔨' },
  { id: '3', name: '250 Coins', type: 'coins', amount: 250, color: '#10b981', icon: '🪙' },
  { id: '4', name: 'Bomb x1', type: 'bomb', amount: 1, color: '#ef4444', icon: '💣' },
  { id: '5', name: '500 Coins', type: 'coins', amount: 500, color: '#8b5cf6', icon: '🪙' },
  { id: '6', name: 'Reroll x2', type: 'reroll', amount: 2, color: '#06b6d4', icon: '🔄' },
  { id: '7', name: 'Mystery Box', type: 'coins', amount: 350, color: '#ec4899', icon: '🎁' },
  { id: '8', name: 'JACKPOT 1,000', type: 'jackpot', amount: 1000, color: '#eab308', icon: '👑' },
];

interface LuckyWheelModalProps {
  userCoins: number;
  lastFreeSpinTimestamp: number;
  onSpinWin: (prize: WheelPrize) => void;
  onClose: () => void;
}

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  userCoins,
  lastFreeSpinTimestamp,
  onSpinWin,
  onClose,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelPrize | null>(null);

  const ONE_HOUR_MS = 60 * 60 * 1000;
  const now = Date.now();
  const isFreeSpin = now - lastFreeSpinTimestamp >= ONE_HOUR_MS;
  const spinCost = 50;

  const handleSpin = () => {
    if (spinning) return;
    if (!isFreeSpin && userCoins < spinCost) return;

    soundEngine.playClick();
    setSpinning(true);
    setWonPrize(null);

    // Pick random prize
    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const prize = WHEEL_PRIZES[prizeIndex];

    // Calculate rotation: 8 segments = 45 deg per segment
    // Top pointer is at 0 deg (or 270 / 90 depending on alignment)
    const segmentAngle = 360 / WHEEL_PRIZES.length;
    // Align so needle at top lands on center of chosen segment
    const targetSegmentOffset = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const totalRotation = rotation + fullSpins * 360 + targetSegmentOffset;

    // Simulate tick sounds during rotation
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      soundEngine.playWheelTick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 150);

    setRotation(totalRotation);

    setTimeout(() => {
      clearInterval(tickInterval);
      setSpinning(false);
      setWonPrize(prize);
      soundEngine.playLevelUp();
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
      });
      onSpinWin(prize);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-750 rounded-3xl p-5 shadow-2xl flex flex-col items-center relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          disabled={spinning}
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-6 h-6 text-purple-400 animate-spin-slow" />
          <h2 className="text-xl font-black text-white font-['Outfit']">Lucky Spin Wheel</h2>
        </div>
        <p className="text-xs text-slate-400 text-center mb-4">
          Spin to win instant Coins, Hammers, Bombs, and Jackpots!
        </p>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 flex items-center justify-center my-2">
          {/* Wheel Pointer Needle (Top) */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]" />
            <div className="w-3 h-3 rounded-full bg-amber-300 -mt-4 shadow" />
          </div>

          {/* Rotating Wheel Disk */}
          <div
            className="w-full h-full rounded-full border-4 border-slate-800 shadow-[0_0_40px_rgba(139,92,246,0.3)] relative overflow-hidden transition-all duration-[4500ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {/* SVG Segments */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {WHEEL_PRIZES.map((prize, idx) => {
                const angle = 360 / WHEEL_PRIZES.length;
                const startAngle = idx * angle;
                const endAngle = startAngle + angle;

                const startRad = ((startAngle - 90) * Math.PI) / 180;
                const endRad = ((endAngle - 90) * Math.PI) / 180;

                const x1 = 100 + 100 * Math.cos(startRad);
                const y1 = 100 + 100 * Math.sin(startRad);
                const x2 = 100 + 100 * Math.cos(endRad);
                const y2 = 100 + 100 * Math.sin(endRad);

                const midAngle = startAngle + angle / 2;
                const midRad = ((midAngle - 90) * Math.PI) / 180;
                const textX = 100 + 65 * Math.cos(midRad);
                const textY = 100 + 65 * Math.sin(midRad);

                return (
                  <g key={prize.id}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                      fill={prize.color}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    >
                      {prize.icon} {prize.amount}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center Hub */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-amber-400 shadow-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Won Prize Banner */}
        {wonPrize && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full mt-3 p-2.5 rounded-xl bg-amber-500/20 border border-amber-400 text-center flex items-center justify-center gap-2"
          >
            <span className="text-xl">{wonPrize.icon}</span>
            <span className="text-xs font-black text-amber-300 font-['Outfit']">
              YOU WON {wonPrize.name}!
            </span>
          </motion.div>
        )}

        {/* Spin Button */}
        <div className="w-full mt-4">
          <button
            disabled={spinning || (!isFreeSpin && userCoins < spinCost)}
            onClick={handleSpin}
            className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              spinning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isFreeSpin
                ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-purple-500/30 active:scale-95 cursor-pointer'
                : userCoins >= spinCost
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{spinning ? 'SPINNING...' : isFreeSpin ? 'FREE SPIN' : `SPIN FOR ${spinCost} COINS`}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
