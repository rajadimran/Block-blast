import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  ShoppingBag,
  Gift,
  Trophy,
  Award,
  BarChart2,
  Settings,
  Sparkles,
  Coins,
  Compass,
  Zap,
  HelpCircle,
  User,
  Check,
  X,
  Crown,
  Flame,
  Download,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

const AVATAR_OPTIONS = ['😎', '🤖', '👑', '🚀', '🔥', '💎', '🦁', '⚡', '🌟', '🦄'];

interface HomeScreenProps {
  highScore: number;
  coins: number;
  level: number;
  xp: number;
  userName: string;
  userAvatar: string;
  hasDailyReward: boolean;
  hasFreeSpin: boolean;
  activeSkinName: string;
  onPlay: () => void;
  onOpenShop: () => void;
  onOpenDailyReward: () => void;
  onOpenLuckyWheel: () => void;
  onOpenLeaderboard: () => void;
  onOpenQuests: () => void;
  onOpenAchievements: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  onOpenInstall?: () => void;
  onUpdateProfile?: (name: string, avatar: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  highScore,
  coins,
  level,
  xp,
  userName,
  userAvatar,
  hasDailyReward,
  hasFreeSpin,
  activeSkinName,
  onPlay,
  onOpenShop,
  onOpenDailyReward,
  onOpenLuckyWheel,
  onOpenLeaderboard,
  onOpenQuests,
  onOpenAchievements,
  onOpenStats,
  onOpenSettings,
  onOpenTutorial,
  onOpenInstall,
  onUpdateProfile,
}) => {
  const xpNeeded = level * 500;
  const xpPercent = Math.min(100, Math.max(0, (xp / xpNeeded) * 100));

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [selectedAvatar, setSelectedAvatar] = useState(userAvatar);

  const handleSaveProfile = () => {
    soundEngine.playClick();
    if (onUpdateProfile && tempName.trim()) {
      onUpdateProfile(tempName.trim(), selectedAvatar);
    }
    setIsEditingProfile(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 overflow-y-auto select-none bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/90 relative">
      {/* Animated Floating Ambient Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 blur-sm"
            style={{
              width: `${(i % 4) * 8 + 8}px`,
              height: `${(i % 4) * 8 + 8}px`,
              left: `${(i * 19 + 7) % 95}%`,
              top: `${(i * 23 + 11) % 95}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.45, 0.15],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 4 + (i % 3) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Top Header: User Profile, Coins & Settings */}
      <div className="flex items-center justify-between gap-2 pt-1 z-10">
        {/* Profile Card (Clickable to Edit) */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setTempName(userName);
            setSelectedAvatar(userAvatar);
            setIsEditingProfile(true);
          }}
          className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 rounded-2xl px-3 py-1.5 shadow-lg active:scale-95 transition-all cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-lg shadow-md border border-white/20">
            {userAvatar}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-white leading-tight truncate max-w-[90px]">
              {userName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-black text-amber-400">LVL {level}</span>
              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </button>

        {/* Coins, Install & Settings Pill Group */}
        <div className="flex items-center gap-1.5">
          {onOpenInstall && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenInstall();
              }}
              className="flex items-center gap-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 text-cyan-300 px-2.5 py-1.5 rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all text-xs font-bold"
              title="Install Android App / APK"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenShop();
            }}
            className="flex items-center gap-1.5 bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 px-3 py-1.5 rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all"
          >
            <Coins className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-xs font-black text-amber-300 font-['Outfit']">
              {coins.toLocaleString()}
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenSettings();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer shadow-md"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Branding & Animated Mascot */}
      <div className="flex flex-col items-center justify-center my-auto py-2 z-10">
        {/* Floating 3D Block Mascot */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-3 cursor-pointer"
          onClick={() => soundEngine.playPickup()}
        >
          <div className="w-22 h-22 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 p-1.5 shadow-[0_0_45px_rgba(6,182,212,0.45)] border-2 border-white/40 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-cyan-300 to-cyan-500 shadow-md flex items-center justify-center text-[11px] font-black text-slate-950">
                ★
              </div>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-amber-300 to-amber-500 shadow-md flex items-center justify-center text-[11px] font-black text-slate-950">
                ✦
              </div>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-rose-300 to-rose-500 shadow-md flex items-center justify-center text-[11px] font-black text-slate-950">
                ●
              </div>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-emerald-300 to-emerald-500 shadow-md flex items-center justify-center text-[11px] font-black text-slate-950">
                ▲
              </div>
            </div>
          </div>
          <Sparkles className="absolute -top-2.5 -right-2.5 w-7 h-7 text-yellow-300 animate-spin-slow drop-shadow" />
        </motion.div>

        {/* Title with Gradient Text */}
        <h1 className="text-4xl sm:text-5xl font-black font-['Outfit'] tracking-tight text-center uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
            Imran
          </span>{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
            Blast
          </span>
        </h1>

        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider">
            8×8 Puzzle
          </span>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
            {activeSkinName}
          </span>
        </div>

        {/* High Score Trophy Pill */}
        <div className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-900/90 to-slate-850/90 border border-amber-500/40 shadow-lg flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-slate-300">
            BEST SCORE:{' '}
            <span className="text-amber-300 font-black font-['Outfit'] text-sm">
              {highScore.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* Central Large Animated Play Button */}
      <div className="w-full flex flex-col items-center gap-2 my-2 z-10">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundEngine.playClick();
            onPlay();
          }}
          className="w-full max-w-[320px] py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xl font-['Outfit'] tracking-wider flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(6,182,212,0.5)] border-t-2 border-cyan-200/60 cursor-pointer active:scale-95 transition-all relative overflow-hidden group"
        >
          {/* Animated Sheen Sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-in-out" />
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
          <span>PLAY GAME</span>
        </motion.button>
      </div>

      {/* Feature Navigation Grid (Material 3 rounded cards) */}
      <div className="grid grid-cols-4 gap-2 mb-2 z-10">
        {/* Daily Reward */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenDailyReward();
          }}
          className="relative py-2.5 px-1 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-md"
        >
          {hasDailyReward && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-ping" />
          )}
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-300 text-center">Daily</span>
        </button>

        {/* Lucky Wheel */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenLuckyWheel();
          }}
          className="relative py-2.5 px-1 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-md"
        >
          {hasFreeSpin && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full ring-2 ring-slate-950 animate-ping" />
          )}
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <span className="text-[10px] font-bold text-slate-300 text-center">Wheel</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenShop();
          }}
          className="py-2.5 px-1 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-300 text-center">Shop</span>
        </button>

        {/* Leaderboard */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenLeaderboard();
          }}
          className="py-2.5 px-1 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-yellow-500/50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-300 text-center">Ranks</span>
        </button>
      </div>

      {/* Secondary Row: Quests, Achievements, Stats, Tutorial */}
      <div className="grid grid-cols-4 gap-2 z-10">
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenQuests();
          }}
          className="py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-850 flex items-center justify-center gap-1 text-xs text-slate-300 active:scale-95 transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[10px] font-semibold">Missions</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAchievements();
          }}
          className="py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-850 flex items-center justify-center gap-1 text-xs text-slate-300 active:scale-95 transition-all cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-semibold">Badges</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenStats();
          }}
          className="py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-850 flex items-center justify-center gap-1 text-xs text-slate-300 active:scale-95 transition-all cursor-pointer"
        >
          <BarChart2 className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-[10px] font-semibold">Stats</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenTutorial();
          }}
          className="py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-850 flex items-center justify-center gap-1 text-xs text-slate-300 active:scale-95 transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-semibold">Guide</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-750 rounded-3xl p-5 shadow-2xl flex flex-col relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-black text-white font-['Outfit']">Edit Player Profile</h3>
                </div>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Name Input */}
              <label className="text-xs font-bold text-slate-300 mb-1 block">Player Name</label>
              <input
                type="text"
                value={tempName}
                maxLength={15}
                onChange={e => setTempName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white font-bold text-sm focus:border-cyan-400 focus:outline-none mb-4"
                placeholder="Enter player name..."
              />

              {/* Avatar Picker */}
              <label className="text-xs font-bold text-slate-300 mb-2 block">Choose Avatar</label>
              <div className="grid grid-cols-5 gap-2 mb-5">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedAvatar(av);
                    }}
                    className={`h-11 rounded-xl text-xl flex items-center justify-center border transition-all cursor-pointer ${
                      selectedAvatar === av
                        ? 'bg-cyan-500/20 border-cyan-400 scale-105 shadow-md shadow-cyan-950'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-md shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
              >
                SAVE PROFILE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
