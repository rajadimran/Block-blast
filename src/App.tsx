import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BoardCell,
  TrayBlock,
  DraggingState,
  ActivePowerUp,
  ScorePopup,
  UserProfile,
  GameStats,
  GameSettings,
  Quest,
  Achievement,
  LeaderboardEntry,
  BlockSkinId,
  BoardThemeId,
} from './types';
import {
  generateThreeSmartBlocks,
  canPlaceShapeAt,
  canPlaceShapeAnywhere,
} from './utils/shapes';
import { soundEngine } from './utils/audio';
import {
  loadProfile,
  saveProfile,
  loadStats,
  saveStats,
  loadSettings,
  saveSettings,
  loadQuests,
  saveQuests,
  loadAchievements,
  saveAchievements,
  loadLeaderboard,
  saveLeaderboard,
  loadSavedGame,
  saveGameSession,
} from './utils/storage';
import { SKINS_METADATA } from './utils/themeStyles';

// Components
import { AndroidFrame } from './components/AndroidFrame';
import { TopBar } from './components/TopBar';
import { GameBoard } from './components/GameBoard';
import { BlockTray } from './components/BlockTray';
import { PowerUpBar } from './components/PowerUpBar';
import { ComboSplash } from './components/ComboSplash';
import { HomeScreen } from './components/HomeScreen';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { ShopModal } from './components/ShopModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { LuckyWheelModal } from './components/LuckyWheelModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { QuestsModal } from './components/QuestsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { StatisticsModal } from './components/StatisticsModal';
import { SettingsModal } from './components/SettingsModal';
import { TutorialModal } from './components/TutorialModal';
import { SimulatedAdModal } from './components/SimulatedAdModal';
import { InstallModal } from './components/InstallModal';

export default function App() {
  // Persistence state
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [quests, setQuests] = useState<Quest[]>(loadQuests);
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(loadLeaderboard);

  // App View
  const [view, setView] = useState<'home' | 'playing'>('home');

  // Game Engine State
  const createEmptyBoard = (): BoardCell[][] => {
    const b: BoardCell[][] = [];
    for (let r = 0; r < 8; r++) {
      b[r] = [];
      for (let c = 0; c < 8; c++) {
        b[r][c] = { filled: false };
      }
    }
    return b;
  };

  const [board, setBoard] = useState<BoardCell[][]>(createEmptyBoard);
  const [tray, setTray] = useState<TrayBlock[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [linesClearedThisGame, setLinesClearedThisGame] = useState<number>(0);
  const [maxComboThisGame, setMaxComboThisGame] = useState<number>(0);
  const [coinsEarnedThisGame, setCoinsEarnedThisGame] = useState<number>(0);
  const [revivesUsed, setRevivesUsed] = useState<number>(0);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Undo History
  const [previousState, setPreviousState] = useState<{
    board: BoardCell[][];
    tray: TrayBlock[];
    score: number;
    combo: number;
  } | null>(null);

  // Drag & Interaction state
  const [draggingState, setDraggingState] = useState<DraggingState | null>(null);
  const [activePowerUp, setActivePowerUp] = useState<ActivePowerUp>(null);
  const [hoveredPowerUpCell, setHoveredPowerUpCell] = useState<{ row: number; col: number } | null>(null);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [activeComboBanner, setActiveComboBanner] = useState<number>(0);
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Active Modal
  type ModalType =
    | 'pause'
    | 'game_over'
    | 'shop'
    | 'daily'
    | 'wheel'
    | 'leaderboard'
    | 'quests'
    | 'achievements'
    | 'stats'
    | 'settings'
    | 'tutorial'
    | 'install'
    | 'ad_revive'
    | 'ad_coins'
    | null;

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  // Sync settings with SoundEngine
  useEffect(() => {
    soundEngine.updateSettings(
      settings.soundEnabled,
      settings.musicEnabled,
      settings.vibrationEnabled,
      settings.soundVolume,
      settings.musicVolume
    );
  }, [settings]);

  // Persist storage whenever state changes
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveQuests(quests);
  }, [quests]);

  useEffect(() => {
    saveAchievements(achievements);
  }, [achievements]);

  useEffect(() => {
    saveLeaderboard(leaderboard);
  }, [leaderboard]);

  // Add XP and handle level up
  const addXP = useCallback((xpGain: number) => {
    setProfile(prev => {
      let newXP = prev.xp + xpGain;
      let newLevel = prev.level;
      let xpNeeded = newLevel * 500;

      while (newXP >= xpNeeded) {
        newXP -= xpNeeded;
        newLevel += 1;
        xpNeeded = newLevel * 500;
        soundEngine.playLevelUp();
      }

      // Check achievement for level 10
      setAchievements(achList =>
        achList.map(a =>
          a.id === 'imran_champion' ? { ...a, current: newLevel } : a
        )
      );

      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  // Spawn fresh tray
  const spawnTray = useCallback((currentBoard: BoardCell[][], currentScore: number) => {
    const shapes = generateThreeSmartBlocks(currentBoard, currentScore);
    const newTray: TrayBlock[] = shapes.map((shape, i) => ({
      id: `tray_${Date.now()}_${i}`,
      shape,
      placed: false,
    }));
    setTray(newTray);
  }, []);

  // Start new match
  const startNewGame = useCallback(() => {
    const empty = createEmptyBoard();
    setBoard(empty);
    setScore(0);
    setCombo(0);
    setLinesClearedThisGame(0);
    setMaxComboThisGame(0);
    setCoinsEarnedThisGame(0);
    setRevivesUsed(0);
    setIsNewHighScore(false);
    setPreviousState(null);
    setActivePowerUp(null);
    setActiveModal(null);
    spawnTray(empty, 0);
    setView('playing');

    // Update stats: games played
    setStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
  }, [spawnTray]);

  // Drag start
  const handleDragStart = useCallback(
    (index: number, block: TrayBlock, startX: number, startY: number) => {
      if (activePowerUp) setActivePowerUp(null);
      setDraggingState({
        trayIndex: index,
        block,
        startPointerX: startX,
        startPointerY: startY,
        currentPointerX: startX,
        currentPointerY: startY,
        gridRow: null,
        gridCol: null,
        isValid: false,
      });
    },
    [activePowerUp]
  );

  // Drag move
  const handleDragMove = useCallback(
    (
      currX: number,
      currY: number,
      gridRow: number | null,
      gridCol: number | null,
      isValid: boolean
    ) => {
      setDraggingState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentPointerX: currX,
          currentPointerY: currY,
          gridRow,
          gridCol,
          isValid,
        };
      });
    },
    []
  );

    // Trigger floating popup score text
    const addScorePopup = (text: string, x: number, y: number, isCombo = false) => {
      const id = `popup_${Date.now()}_${Math.random()}`;
      setScorePopups(prev => [...prev, { id, text, x, y, color: '#38bdf8', isCombo }]);
      setTimeout(() => {
        setScorePopups(prev => prev.filter(p => p.id !== id));
      }, 500);
    };

  // Drag End & Place Logic
  const handleDragEnd = useCallback(() => {
    if (!draggingState) return;

    const { trayIndex, block, gridRow, gridCol, isValid } = draggingState;
    setDraggingState(null);

    if (!isValid || gridRow === null || gridCol === null) {
      // Invalid placement
      return;
    }

    // Save previous state for Undo
    setPreviousState({
      board: board.map(row => row.map(cell => ({ ...cell }))),
      tray: tray.map(t => ({ ...t })),
      score,
      combo,
    });

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const { shape } = block;
    const tileCount = shape.matrix.flat().filter(v => v === 1).length;

    // 1. Place the piece
    for (let r = 0; r < shape.matrix.length; r++) {
      for (let c = 0; c < shape.matrix[0].length; c++) {
        if (shape.matrix[r][c] === 1) {
          const targetR = gridRow + r;
          const targetC = gridCol + c;
          newBoard[targetR][targetC] = {
            filled: true,
            color: shape.color,
            skin: profile.activeSkin,
          };
        }
      }
    }

    // 2. Mark tray item placed
    const newTray = tray.map((t, idx) => (idx === trayIndex ? { ...t, placed: true } : t));

    // Base score for placing tiles
    const placementScore = tileCount * 10;
    let earnedScore = placementScore;

    // 3. Find full rows & columns
    const fullRows: number[] = [];
    const fullCols: number[] = [];

    for (let r = 0; r < 8; r++) {
      if (newBoard[r].every(c => c.filled)) fullRows.push(r);
    }
    for (let c = 0; c < 8; c++) {
      let isFull = true;
      for (let r = 0; r < 8; r++) {
        if (!newBoard[r][c].filled) {
          isFull = false;
          break;
        }
      }
      if (isFull) fullCols.push(c);
    }

    const linesCount = fullRows.length + fullCols.length;
    let nextCombo = combo;

    if (linesCount > 0) {
      // Combo increment
      nextCombo = combo + 1;
      const comboMultiplier = nextCombo;
      const lineClearScore = linesCount * 100 * comboMultiplier + (linesCount >= 2 ? linesCount * 50 : 0);
      earnedScore += lineClearScore;

      // Coins reward
      const coinsReward = linesCount * 5 + (nextCombo >= 2 ? nextCombo * 3 : 0);
      setProfile(p => ({ ...p, coins: p.coins + coinsReward }));
      setCoinsEarnedThisGame(c => c + coinsReward);

      // Play audio & haptics with combo tiers
      soundEngine.playClear(linesCount, nextCombo);
      if (nextCombo === 2) {
        soundEngine.playCombo2();
      } else if (nextCombo >= 3 && nextCombo < 5) {
        soundEngine.playCombo3();
      } else if (nextCombo >= 5) {
        soundEngine.playCombo5();
      }

      if (linesCount >= 2) {
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 220);
      }

      if (nextCombo >= 2) {
        setActiveComboBanner(nextCombo);
      }

      // Mark clearing animation state
      fullRows.forEach(r => {
        for (let c = 0; c < 8; c++) newBoard[r][c].clearing = true;
      });
      fullCols.forEach(c => {
        for (let r = 0; r < 8; r++) newBoard[r][c].clearing = true;
      });

      // Update quests
      setQuests(qList =>
        qList.map(q => {
          if (q.id === 'daily_lines_10') return { ...q, progress: q.progress + linesCount };
          if (q.id === 'daily_combo_3') return { ...q, progress: Math.max(q.progress, nextCombo) };
          return q;
        })
      );

      // Update achievements
      setAchievements(achList =>
        achList.map(a => {
          if (a.id === 'first_blast') return { ...a, current: a.current + linesCount };
          if (a.id === 'lines_100') return { ...a, current: a.current + linesCount };
          if (a.id === 'combo_master') return { ...a, current: Math.max(a.current, nextCombo) };
          if (a.id === 'multiline_quad' && linesCount >= 4) return { ...a, current: Math.max(a.current, linesCount) };
          return a;
        })
      );

      setLinesClearedThisGame(l => l + linesCount);
      setMaxComboThisGame(m => Math.max(m, nextCombo));

      // Clear the cells after snappy 90ms flash
      setTimeout(() => {
        setBoard(currentB => {
          const clearedB = currentB.map(row => row.map(cell => ({ ...cell })));
          fullRows.forEach(r => {
            for (let c = 0; c < 8; c++) clearedB[r][c] = { filled: false };
          });
          fullCols.forEach(c => {
            for (let r = 0; r < 8; r++) clearedB[r][c] = { filled: false };
          });
          return clearedB;
        });
      }, 90);
    } else {
      // No lines cleared, reset combo
      nextCombo = 0;
      soundEngine.playPlace();
    }

    const nextScore = score + earnedScore;
    setScore(nextScore);
    setCombo(nextCombo);

    // Floating text
    addScorePopup(`+${earnedScore}`, 140, 180, nextCombo > 1);

    // Add XP
    addXP(tileCount * 5 + linesCount * 40);

    // Check quest score & blocks
    setQuests(qList =>
      qList.map(q => {
        if (q.id === 'daily_score_1500') return { ...q, progress: Math.max(q.progress, nextScore) };
        if (q.id === 'daily_blocks_40') return { ...q, progress: q.progress + 1 };
        return q;
      })
    );

    // Check achievement score
    setAchievements(achList =>
      achList.map(a =>
        a.id === 'score_5000' ? { ...a, current: Math.max(a.current, nextScore) } : a
      )
    );

    // Update stats
    setStats(s => ({
      ...s,
      totalScore: s.totalScore + earnedScore,
      totalBlocksPlaced: s.totalBlocksPlaced + 1,
      totalLinesCleared: s.totalLinesCleared + linesCount,
      highestCombo: Math.max(s.highestCombo, nextCombo),
      highScore: Math.max(s.highScore, nextScore),
    }));

    if (nextScore > stats.highScore) {
      setIsNewHighScore(true);
    }

    setBoard(newBoard);

    // 4. Check if all 3 tray blocks are placed
    const allPlaced = newTray.every(t => t.placed);
    let activeTray = newTray;

    if (allPlaced) {
      const nextTrayShapes = generateThreeSmartBlocks(newBoard, nextScore);
      activeTray = nextTrayShapes.map((s, i) => ({
        id: `tray_${Date.now()}_${i}`,
        shape: s,
        placed: false,
      }));
      setTray(activeTray);
    } else {
      setTray(newTray);
    }

    // 5. Game Over Check (Fast, responsive check after 100ms)
    setTimeout(() => {
      setBoard(latestBoard => {
        const remainingBlocks = activeTray.filter(t => !t.placed);
        const hasValidMove = remainingBlocks.some(b => canPlaceShapeAnywhere(latestBoard, b.shape));

        if (!hasValidMove && remainingBlocks.length > 0) {
          soundEngine.playGameOver();
          setTimeout(() => {
            setActiveModal('game_over');
          }, 120);
        }
        return latestBoard;
      });
    }, 100);
  }, [board, draggingState, profile.activeSkin, score, combo, tray, addXP, stats.highScore]);

  // Board cell click for Power-ups
  const handleBoardCellClick = (row: number, col: number) => {
    if (!activePowerUp) return;

    if (activePowerUp === 'hammer') {
      if (!board[row][col].filled) return;
      soundEngine.playHammer();
      setBoard(prev => {
        const next = prev.map(r => r.map(c => ({ ...c })));
        next[row][col] = { filled: false };
        return next;
      });
      setProfile(p => ({
        ...p,
        powerups: { ...p.powerups, hammer: Math.max(0, p.powerups.hammer - 1) },
      }));
      setActivePowerUp(null);
      addScorePopup('SMASHED!', 140, 180);
    } else if (activePowerUp === 'bomb') {
      soundEngine.playBomb();
      setBoard(prev => {
        const next = prev.map(r => r.map(c => ({ ...c })));
        for (let r = Math.max(0, row - 1); r <= Math.min(7, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(7, col + 1); c++) {
            next[r][c] = { filled: false };
          }
        }
        return next;
      });
      setProfile(p => ({
        ...p,
        powerups: { ...p.powerups, bomb: Math.max(0, p.powerups.bomb - 1) },
      }));
      setActivePowerUp(null);
      addScorePopup('BLAST!', 140, 180);
    }
  };

  // Power-up Reroll
  const handleRerollTray = () => {
    if (profile.powerups.reroll <= 0) return;
    soundEngine.playPickup();
    setProfile(p => ({
      ...p,
      powerups: { ...p.powerups, reroll: p.powerups.reroll - 1 },
    }));
    spawnTray(board, score);
    addScorePopup('REFRESHED!', 140, 200);
  };

  // Power-up Undo
  const handleUndo = () => {
    if (!previousState || profile.powerups.undo <= 0) return;
    soundEngine.playPickup();
    setBoard(previousState.board);
    setTray(previousState.tray);
    setScore(previousState.score);
    setCombo(previousState.combo);
    setProfile(p => ({
      ...p,
      powerups: { ...p.powerups, undo: p.powerups.undo - 1 },
    }));
    setPreviousState(null);
    addScorePopup('UNDONE!', 140, 200);
  };

  // Revive & continue match
  const handleRevive = (cost: number) => {
    setProfile(p => ({ ...p, coins: Math.max(0, p.coins - cost) }));
    setRevivesUsed(r => r + 1);
    setStats(s => ({ ...s, revivesUsed: s.revivesUsed + 1 }));

    // Clear center 4x4 area to give plenty of room
    setBoard(prev => {
      const next = prev.map(r => r.map(c => ({ ...c })));
      for (let r = 2; r <= 5; r++) {
        for (let c = 2; c <= 5; c++) {
          next[r][c] = { filled: false };
        }
      }
      return next;
    });

    setActiveModal(null);
    addScorePopup('REVIVED!', 140, 180);
  };

  // Daily Streak check badge indicator
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const hasDailyReward =
    profile.lastDailyClaimTimestamp === 0 ||
    Date.now() - profile.lastDailyClaimTimestamp >= ONE_DAY_MS;

  const ONE_HOUR_MS = 60 * 60 * 1000;
  const hasFreeSpin =
    profile.lastFreeSpinTimestamp === 0 ||
    Date.now() - profile.lastFreeSpinTimestamp >= ONE_HOUR_MS;

  const activeSkinMeta =
    SKINS_METADATA.find(s => s.id === profile.activeSkin) || SKINS_METADATA[0];

  return (
    <AndroidFrame
      enabled={settings.androidFrame}
      onToggleFrame={() => setSettings(s => ({ ...s, androidFrame: !s.androidFrame }))}
    >
      <div
        className={`w-full h-full flex flex-col justify-between relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] ${
          settings.themeMode === 'light'
            ? 'bg-slate-100 text-slate-900'
            : settings.themeMode === 'amoled'
            ? 'bg-black text-white'
            : 'bg-slate-950 text-white'
        }`}
      >
        {/* VIEW 1: HOME SCREEN */}
        {view === 'home' && (
          <HomeScreen
            highScore={stats.highScore}
            coins={profile.coins}
            level={profile.level}
            xp={profile.xp}
            userName={profile.name}
            userAvatar={profile.avatar}
            hasDailyReward={hasDailyReward}
            hasFreeSpin={hasFreeSpin}
            activeSkinName={activeSkinMeta.name}
            onPlay={startNewGame}
            onOpenShop={() => setActiveModal('shop')}
            onOpenDailyReward={() => setActiveModal('daily')}
            onOpenLuckyWheel={() => setActiveModal('wheel')}
            onOpenLeaderboard={() => setActiveModal('leaderboard')}
            onOpenQuests={() => setActiveModal('quests')}
            onOpenAchievements={() => setActiveModal('achievements')}
            onOpenStats={() => setActiveModal('stats')}
            onOpenSettings={() => setActiveModal('settings')}
            onOpenTutorial={() => setActiveModal('tutorial')}
            onOpenInstall={() => setActiveModal('install')}
            onUpdateProfile={(newName, newAvatar) => {
              setProfile(p => ({ ...p, name: newName, avatar: newAvatar }));
            }}
          />
        )}

        {/* VIEW 2: ACTIVE GAMEPLAY */}
        {view === 'playing' && (
          <div className={`w-full h-full flex flex-col justify-between relative ${screenShake ? 'animate-shake' : ''}`}>
            {/* Top Bar */}
            <TopBar
              score={score}
              highScore={stats.highScore}
              coins={profile.coins}
              level={profile.level}
              xp={profile.xp}
              combo={combo}
              soundEnabled={settings.soundEnabled}
              onToggleSound={() =>
                setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))
              }
              onPause={() => setActiveModal('pause')}
              onOpenShop={() => setActiveModal('shop')}
            />

            {/* 8x8 Board */}
            <GameBoard
              board={board}
              activeSkin={profile.activeSkin}
              activeBoardTheme={profile.activeBoardTheme}
              draggingState={draggingState}
              activePowerUp={activePowerUp}
              hoveredPowerUpCell={hoveredPowerUpCell}
              scorePopups={scorePopups}
              onBoardCellClick={handleBoardCellClick}
              onBoardCellHover={(r, c) => setHoveredPowerUpCell({ row: r, col: c })}
              boardRef={boardRef}
            />

            {/* Power-up Boosters */}
            <PowerUpBar
              powerups={profile.powerups}
              activePowerUp={activePowerUp}
              canUndo={previousState !== null}
              onSelectPowerUp={type =>
                setActivePowerUp(curr => (curr === type ? null : type))
              }
              onReroll={handleRerollTray}
              onUndo={handleUndo}
              onBuyPowerUp={(type, cost) => {
                if (profile.coins >= cost) {
                  setProfile(p => ({
                    ...p,
                    coins: p.coins - cost,
                    powerups: { ...p.powerups, [type]: p.powerups[type] + 1 },
                  }));
                  soundEngine.playCoin();
                } else {
                  setActiveModal('shop');
                }
              }}
            />

            {/* 3 Block Tray */}
            <BlockTray
              tray={tray}
              board={board}
              activeSkin={profile.activeSkin}
              draggingState={draggingState}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              boardRef={boardRef}
            />

            {/* Combo Streak Announcement Popup */}
            <ComboSplash
              combo={activeComboBanner}
              onComplete={() => setActiveComboBanner(0)}
            />
          </div>
        )}

        {/* MODALS */}
        {activeModal === 'pause' && (
          <PauseModal
            score={score}
            soundEnabled={settings.soundEnabled}
            onToggleSound={() =>
              setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))
            }
            onResume={() => setActiveModal(null)}
            onRestart={startNewGame}
            onHome={() => {
              setActiveModal(null);
              setView('home');
            }}
            onOpenSettings={() => setActiveModal('settings')}
            onOpenTutorial={() => setActiveModal('tutorial')}
          />
        )}

        {activeModal === 'game_over' && (
          <GameOverModal
            score={score}
            highScore={stats.highScore}
            isNewHighScore={isNewHighScore}
            coinsEarned={coinsEarnedThisGame}
            linesCleared={linesClearedThisGame}
            maxCombo={maxComboThisGame}
            levelReached={profile.level}
            userCoins={profile.coins}
            revivesUsed={revivesUsed}
            onRestart={startNewGame}
            onHome={() => {
              setActiveModal(null);
              setView('home');
            }}
            onReviveWithCoins={() => handleRevive(200 * (revivesUsed + 1))}
            onReviveWithAd={() => setActiveModal('ad_revive')}
          />
        )}

        {activeModal === 'shop' && (
          <ShopModal
            userCoins={profile.coins}
            activeSkin={profile.activeSkin}
            activeBoardTheme={profile.activeBoardTheme}
            unlockedSkins={profile.unlockedSkins}
            unlockedBoardThemes={profile.unlockedBoardThemes}
            onSelectSkin={skinId => setProfile(p => ({ ...p, activeSkin: skinId }))}
            onBuySkin={(skinId, price) => {
              if (profile.coins >= price) {
                soundEngine.playCoin();
                setProfile(p => ({
                  ...p,
                  coins: p.coins - price,
                  unlockedSkins: [...p.unlockedSkins, skinId],
                  activeSkin: skinId,
                }));
                // Check skin achievement
                setAchievements(achList =>
                  achList.map(a =>
                    a.id === 'skin_collector'
                      ? { ...a, current: profile.unlockedSkins.length + 1 }
                      : a
                  )
                );
              }
            }}
            onSelectBoardTheme={themeId =>
              setProfile(p => ({ ...p, activeBoardTheme: themeId }))
            }
            onBuyBoardTheme={(themeId, price) => {
              if (profile.coins >= price) {
                soundEngine.playCoin();
                setProfile(p => ({
                  ...p,
                  coins: p.coins - price,
                  unlockedBoardThemes: [...p.unlockedBoardThemes, themeId],
                  activeBoardTheme: themeId,
                }));
              }
            }}
            onBuyPowerupPack={(type, count, cost) => {
              if (cost < 0) {
                // Free pack or coin grant
                const bonusCoins = Math.abs(cost);
                soundEngine.playCoin();
                setProfile(p => ({
                  ...p,
                  coins: p.coins + bonusCoins,
                  powerups: {
                    hammer: p.powerups.hammer + count,
                    bomb: p.powerups.bomb + count,
                    reroll: p.powerups.reroll + count,
                    undo: p.powerups.undo + count,
                  },
                }));
              } else if (profile.coins >= cost) {
                soundEngine.playCoin();
                setProfile(p => ({
                  ...p,
                  coins: p.coins - cost,
                  powerups: { ...p.powerups, [type]: p.powerups[type] + count },
                }));
              }
            }}
            onWatchAdForCoins={() => setActiveModal('ad_coins')}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'daily' && (
          <DailyRewardModal
            dailyStreak={profile.dailyStreak}
            lastClaimTimestamp={profile.lastDailyClaimTimestamp}
            onClaim={day => {
              const dayCoinRewards = [100, 150, 100, 250, 150, 400, 1000];
              const rewardCoin = dayCoinRewards[day - 1] || 100;
              setProfile(p => ({
                ...p,
                coins: p.coins + rewardCoin,
                dailyStreak: p.dailyStreak + 1,
                lastDailyClaimTimestamp: Date.now(),
                powerups: {
                  ...p.powerups,
                  hammer: day === 3 ? p.powerups.hammer + 1 : p.powerups.hammer,
                  bomb: day === 5 ? p.powerups.bomb + 1 : p.powerups.bomb,
                },
                unlockedSkins:
                  day === 7 && !p.unlockedSkins.includes('gold')
                    ? [...p.unlockedSkins, 'gold']
                    : p.unlockedSkins,
              }));
              setActiveModal(null);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'wheel' && (
          <LuckyWheelModal
            userCoins={profile.coins}
            lastFreeSpinTimestamp={profile.lastFreeSpinTimestamp}
            onSpinWin={prize => {
              setProfile(p => {
                let newCoins = p.coins;
                let newPowerups = { ...p.powerups };

                if (prize.type === 'coins' || prize.type === 'jackpot') {
                  newCoins += prize.amount;
                } else if (prize.type === 'hammer') {
                  newPowerups.hammer += prize.amount;
                } else if (prize.type === 'bomb') {
                  newPowerups.bomb += prize.amount;
                } else if (prize.type === 'reroll') {
                  newPowerups.reroll += prize.amount;
                }

                return {
                  ...p,
                  coins: newCoins,
                  powerups: newPowerups,
                  lastFreeSpinTimestamp: Date.now(),
                };
              });

              setStats(s => ({
                ...s,
                luckySpinsCount: s.luckySpinsCount + 1,
              }));

              // Check quests
              setQuests(qList =>
                qList.map(q =>
                  q.id === 'daily_spin_wheel' ? { ...q, progress: q.progress + 1 } : q
                )
              );
              // Check achievements
              setAchievements(achList =>
                achList.map(a =>
                  a.id === 'wheel_spinner' ? { ...a, current: a.current + 1 } : a
                )
              );
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'leaderboard' && (
          <LeaderboardModal
            entries={leaderboard}
            userScore={stats.highScore}
            userName={profile.name}
            userAvatar={profile.avatar}
            userLevel={profile.level}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'quests' && (
          <QuestsModal
            quests={quests}
            onClaimQuest={(questId, reward) => {
              setQuests(qList =>
                qList.map(q => (q.id === questId ? { ...q, claimed: true } : q))
              );
              setProfile(p => ({ ...p, coins: p.coins + reward }));
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'achievements' && (
          <AchievementsModal
            achievements={achievements}
            onClaimAchievement={(achId, reward) => {
              setAchievements(achList =>
                achList.map(a => (a.id === achId ? { ...a, unlocked: true } : a))
              );
              setProfile(p => ({ ...p, coins: p.coins + reward }));
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'stats' && (
          <StatisticsModal stats={stats} onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'settings' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={newS => setSettings(s => ({ ...s, ...newS }))}
            onOpenTutorial={() => setActiveModal('tutorial')}
            onOpenInstall={() => setActiveModal('install')}
            onResetData={() => {
              localStorage.clear();
              window.location.reload();
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'tutorial' && (
          <TutorialModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'install' && (
          <InstallModal onClose={() => setActiveModal(null)} />
        )}

        {/* AdMob Rewarded Video Demo for Reviving */}
        {activeModal === 'ad_revive' && (
          <SimulatedAdModal
            rewardDescription="Free Game Revive & Center 4x4 Blast"
            onRewardEarned={() => {
              handleRevive(0);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {/* AdMob Rewarded Video Demo for Free Coins */}
        {activeModal === 'ad_coins' && (
          <SimulatedAdModal
            rewardDescription="+200 Free Coins"
            onRewardEarned={() => {
              setProfile(p => ({ ...p, coins: p.coins + 200 }));
            }}
            onClose={() => setActiveModal('shop')}
          />
        )}
      </div>
    </AndroidFrame>
  );
}
