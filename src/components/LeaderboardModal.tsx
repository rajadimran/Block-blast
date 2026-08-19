import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, X, Globe, Users, Flame, Medal, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { soundEngine } from '../utils/audio';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  userScore: number;
  userName: string;
  userAvatar: string;
  userLevel: number;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  userScore,
  userName,
  userAvatar,
  userLevel,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'friends'>('global');

  // Insert current user into rankings dynamically
  const sortedList = React.useMemo(() => {
    const list = [...entries];
    const userEntry: LeaderboardEntry = {
      id: 'current_user',
      rank: 0,
      name: `${userName} (You)`,
      avatar: userAvatar,
      score: userScore,
      level: userLevel,
      isCurrentUser: true,
      countryCode: 'PK',
    };

    // If not in list, add and sort
    if (!list.some(e => e.isCurrentUser)) {
      list.push(userEntry);
    }
    list.sort((a, b) => b.score - a.score);

    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [entries, userScore, userName, userAvatar, userLevel]);

  const userRankItem = sortedList.find(e => e.isCurrentUser);

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
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit'] leading-tight">Leaderboard</h2>
              <span className="text-[11px] text-slate-400">Firebase & Global Rankings</span>
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

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl my-3 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('global');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'global'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Global</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('weekly');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'weekly'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Weekly</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('friends');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Friends</span>
          </button>
        </div>

        {/* Top 3 Podium (Visual Showcase) */}
        <div className="flex items-end justify-center gap-2 mb-3 px-2">
          {/* 2nd Place */}
          {sortedList[1] && (
            <div className="flex-1 flex flex-col items-center p-2 rounded-2xl bg-slate-850/80 border border-slate-700/80 text-center">
              <span className="text-xl mb-0.5">{sortedList[1].avatar}</span>
              <span className="text-[11px] font-bold text-slate-200 truncate w-full">
                {sortedList[1].name}
              </span>
              <span className="text-[10px] text-slate-400 font-['Outfit'] font-extrabold">
                {sortedList[1].score.toLocaleString()}
              </span>
              <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 text-[10px] font-black">
                #2
              </div>
            </div>
          )}

          {/* 1st Place */}
          {sortedList[0] && (
            <div className="flex-1 flex flex-col items-center p-2.5 rounded-2xl bg-gradient-to-b from-amber-500/20 to-yellow-500/10 border-2 border-amber-400 text-center shadow-lg shadow-amber-500/20 scale-105">
              <div className="relative">
                <span className="text-2xl mb-0.5 block">{sortedList[0].avatar}</span>
                <Medal className="w-4 h-4 text-amber-400 absolute -top-1 -right-2" />
              </div>
              <span className="text-xs font-black text-amber-300 truncate w-full">
                {sortedList[0].name}
              </span>
              <span className="text-xs font-black text-white font-['Outfit']">
                {sortedList[0].score.toLocaleString()}
              </span>
              <div className="mt-1 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black">
                #1 👑
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {sortedList[2] && (
            <div className="flex-1 flex flex-col items-center p-2 rounded-2xl bg-slate-850/80 border border-slate-700/80 text-center">
              <span className="text-xl mb-0.5">{sortedList[2].avatar}</span>
              <span className="text-[11px] font-bold text-slate-200 truncate w-full">
                {sortedList[2].name}
              </span>
              <span className="text-[10px] text-slate-400 font-['Outfit'] font-extrabold">
                {sortedList[2].score.toLocaleString()}
              </span>
              <div className="mt-1 px-2 py-0.5 rounded-md bg-amber-700/50 text-amber-300 text-[10px] font-black">
                #3
              </div>
            </div>
          )}
        </div>

        {/* Rankings List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
          {sortedList.map(entry => (
            <div
              key={entry.id}
              className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                entry.isCurrentUser
                  ? 'bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-400/50 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-850/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 text-center text-xs font-black font-['Outfit'] ${
                    entry.rank === 1
                      ? 'text-amber-400'
                      : entry.rank === 2
                      ? 'text-slate-300'
                      : entry.rank === 3
                      ? 'text-amber-600'
                      : 'text-slate-500'
                  }`}
                >
                  #{entry.rank}
                </span>

                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-sm shadow-inner">
                  {entry.avatar}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{entry.name}</span>
                    {entry.isCurrentUser && (
                      <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-slate-950 font-black text-[9px]">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">LVL {entry.level}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-amber-300 font-['Outfit']">
                  {entry.score.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider">PTS</span>
              </div>
            </div>
          ))}
        </div>

        {/* User Rank Sticky Pill at bottom */}
        {userRankItem && (
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between bg-slate-950 px-3 py-2 rounded-2xl border border-cyan-500/40 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-cyan-400 font-['Outfit']">
                YOUR RANK: #{userRankItem.rank}
              </span>
              <span className="text-[11px] text-slate-300">• Best: {userScore.toLocaleString()}</span>
            </div>
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
        )}
      </motion.div>
    </div>
  );
};
