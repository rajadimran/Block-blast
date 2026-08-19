import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, X, Check, Coins, Sparkles, Tv, ShieldAlert, Hammer, Bomb, RefreshCw, Undo2 } from 'lucide-react';
import { BlockSkinId, BoardThemeId } from '../types';
import { SKINS_METADATA, BOARD_THEMES_METADATA, getBlockColorClasses } from '../utils/themeStyles';
import { soundEngine } from '../utils/audio';

interface ShopModalProps {
  userCoins: number;
  activeSkin: BlockSkinId;
  activeBoardTheme: BoardThemeId;
  unlockedSkins: BlockSkinId[];
  unlockedBoardThemes: BoardThemeId[];
  onSelectSkin: (skinId: BlockSkinId) => void;
  onBuySkin: (skinId: BlockSkinId, price: number) => void;
  onSelectBoardTheme: (themeId: BoardThemeId) => void;
  onBuyBoardTheme: (themeId: BoardThemeId, price: number) => void;
  onBuyPowerupPack: (type: 'hammer' | 'bomb' | 'reroll' | 'undo', count: number, cost: number) => void;
  onWatchAdForCoins: () => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  userCoins,
  activeSkin,
  activeBoardTheme,
  unlockedSkins,
  unlockedBoardThemes,
  onSelectSkin,
  onBuySkin,
  onSelectBoardTheme,
  onBuyBoardTheme,
  onBuyPowerupPack,
  onWatchAdForCoins,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'themes' | 'boosters' | 'coins'>('skins');

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
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit'] leading-tight">Game Shop</h2>
              <span className="text-[11px] text-slate-400">Unlock custom styles & boosters</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
              <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-black text-amber-300 font-['Outfit']">
                {userCoins.toLocaleString()}
              </span>
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
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl my-3 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('skins');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'skins'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Skins
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('themes');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Themes
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('boosters');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'boosters'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Boosters
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('coins');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'coins'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Free Coins
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {/* Skins Tab */}
          {activeTab === 'skins' && (
            <div className="grid grid-cols-2 gap-2.5">
              {SKINS_METADATA.map(skin => {
                const isUnlocked = unlockedSkins.includes(skin.id);
                const isEquipped = activeSkin === skin.id;
                const canAfford = userCoins >= skin.price;

                return (
                  <div
                    key={skin.id}
                    className={`p-3 rounded-2xl border flex flex-col justify-between transition-all relative ${
                      isEquipped
                        ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/40 shadow-md shadow-cyan-950/50'
                        : isUnlocked
                        ? 'bg-slate-850/90 border-slate-750 hover:border-slate-650'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{skin.icon}</span>
                        <span className="text-xs font-black text-white">{skin.name}</span>
                      </div>
                      {isEquipped && (
                        <span className="px-1.5 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-black text-[9px]">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Skin Preview Mini Blocks */}
                    <div className="flex items-center justify-center gap-1.5 py-2 bg-slate-950/60 rounded-xl mb-2">
                      {skin.previewColors.map((col, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-md shadow-sm ${getBlockColorClasses(col, skin.id)}`}
                        >
                          <div className="w-full h-1/3 bg-white/40 rounded-t-sm" />
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-2 mb-2">
                      {skin.description}
                    </p>

                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onSelectSkin(skin.id);
                        }}
                        disabled={isEquipped}
                        className={`w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isEquipped
                            ? 'bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 active:scale-95'
                        }`}
                      >
                        {isEquipped ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{isEquipped ? 'Equipped' : 'Equip'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          if (canAfford) onBuySkin(skin.id, skin.price);
                        }}
                        disabled={!canAfford}
                        className={`w-full py-1.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{skin.price} Coins</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Board Themes Tab */}
          {activeTab === 'themes' && (
            <div className="space-y-2">
              {BOARD_THEMES_METADATA.map(theme => {
                const isUnlocked = unlockedBoardThemes.includes(theme.id);
                const isEquipped = activeBoardTheme === theme.id;
                const canAfford = userCoins >= theme.price;

                return (
                  <div
                    key={theme.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      isEquipped
                        ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/40'
                        : isUnlocked
                        ? 'bg-slate-850/90 border-slate-750 hover:border-slate-650'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-750 flex items-center justify-center text-xl shadow-inner">
                        {theme.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{theme.name}</span>
                          {isEquipped && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-slate-950 font-black text-[9px]">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{theme.description}</p>
                      </div>
                    </div>

                    <div className="w-28 flex-shrink-0">
                      {isUnlocked ? (
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            onSelectBoardTheme(theme.id);
                          }}
                          disabled={isEquipped}
                          className={`w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            isEquipped
                              ? 'bg-slate-800 text-slate-400 cursor-default'
                              : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 active:scale-95'
                          }`}
                        >
                          {isEquipped ? <Check className="w-3.5 h-3.5" /> : null}
                          <span>{isEquipped ? 'Equipped' : 'Equip'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            if (canAfford) onBuyBoardTheme(theme.id, theme.price);
                          }}
                          disabled={!canAfford}
                          className={`w-full py-1.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 active:scale-95'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-3 h-3" />
                          <span>{theme.price}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Boosters Pack Tab */}
          {activeTab === 'boosters' && (
            <div className="grid grid-cols-2 gap-2.5">
              {/* Hammer Pack */}
              <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white">Hammer x3</span>
                    <p className="text-[10px] text-slate-400">Smash any cell</p>
                  </div>
                </div>
                <button
                  onClick={() => onBuyPowerupPack('hammer', 3, 350)}
                  disabled={userCoins < 350}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>350 Coins</span>
                </button>
              </div>

              {/* Bomb Pack */}
              <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Bomb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white">Bomb x3</span>
                    <p className="text-[10px] text-slate-400">Blast 3x3 area</p>
                  </div>
                </div>
                <button
                  onClick={() => onBuyPowerupPack('bomb', 3, 500)}
                  disabled={userCoins < 500}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>500 Coins</span>
                </button>
              </div>

              {/* Reroll Pack */}
              <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white">Reroll x3</span>
                    <p className="text-[10px] text-slate-400">Fresh tray blocks</p>
                  </div>
                </div>
                <button
                  onClick={() => onBuyPowerupPack('reroll', 3, 250)}
                  disabled={userCoins < 250}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>250 Coins</span>
                </button>
              </div>

              {/* Undo Pack */}
              <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Undo2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white">Undo x3</span>
                    <p className="text-[10px] text-slate-400">Revert move</p>
                  </div>
                </div>
                <button
                  onClick={() => onBuyPowerupPack('undo', 3, 250)}
                  disabled={userCoins < 250}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>250 Coins</span>
                </button>
              </div>
            </div>
          )}

          {/* Free Coins & Rewarded Video Tab */}
          {activeTab === 'coins' && (
            <div className="space-y-3">
              {/* Watch AdMob Rewarded Video Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                    <Tv className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white font-['Outfit']">
                      Watch Rewarded Video
                    </span>
                    <p className="text-xs text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                      <Coins className="w-3.5 h-3.5" />
                      +200 Free Coins
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onWatchAdForCoins();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-white font-black text-xs shadow-md shadow-purple-500/30 cursor-pointer active:scale-95 transition-all"
                >
                  WATCH AD
                </button>
              </div>

              {/* Starter Coin Pack */}
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                    🪙
                  </div>
                  <div>
                    <span className="text-xs font-black text-white">Starter Pack</span>
                    <span className="text-[11px] text-amber-400 font-bold block">+1,000 Coins</span>
                  </div>
                </div>
                <button
                  onClick={() => onBuyPowerupPack('hammer', 0, -1000)} // Grants 1000 coins directly
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow cursor-pointer active:scale-95"
                >
                  FREE BONUS
                </button>
              </div>

              {/* Mega Fortune Bundle */}
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                    💰
                  </div>
                  <div>
                    <span className="text-xs font-black text-white">Mega Fortune</span>
                    <span className="text-[11px] text-amber-400 font-bold block">+5,000 Coins + All Boosters</span>
                  </div>
                </div>
                <button
                  onClick={() => onBuyPowerupPack('hammer', 2, -5000)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs shadow cursor-pointer active:scale-95"
                >
                  CLAIM PACK
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
