import {
  UserProfile,
  GameStats,
  GameSettings,
  Quest,
  Achievement,
  LeaderboardEntry,
  BoardCell,
  TrayBlock,
  BlockSkinId,
  BoardThemeId,
} from '../types';

const PROFILE_KEY = 'imran_blast_profile';
const STATS_KEY = 'imran_blast_stats';
const SETTINGS_KEY = 'imran_blast_settings';
const QUESTS_KEY = 'imran_blast_quests';
const ACHIEVEMENTS_KEY = 'imran_blast_achievements';
const LEADERBOARD_KEY = 'imran_blast_leaderboard';
const SAVED_GAME_KEY = 'imran_blast_saved_game';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Imran Blaster',
  avatar: '🚀',
  level: 1,
  xp: 0,
  coins: 500,
  activeSkin: 'classic',
  activeBoardTheme: 'midnight',
  unlockedSkins: ['classic', 'neon'],
  unlockedBoardThemes: ['midnight', 'deep_azure'],
  powerups: {
    hammer: 2,
    bomb: 1,
    reroll: 2,
    undo: 2,
  },
  lastDailyClaimTimestamp: 0,
  dailyStreak: 0,
  lastFreeSpinTimestamp: 0,
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  totalScore: 0,
  highScore: 0,
  totalLinesCleared: 0,
  highestCombo: 0,
  totalBlocksPlaced: 0,
  totalCoinsEarned: 500,
  revivesUsed: 0,
  luckySpinsCount: 0,
  playTimeMinutes: 0,
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  soundVolume: 0.8,
  musicVolume: 0.5,
  themeMode: 'dark',
  androidFrame: false,
  showPlacementGuide: true,
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'daily_lines_10',
    title: 'Line Destroyer',
    description: 'Clear 10 rows or columns',
    target: 10,
    progress: 0,
    rewardCoins: 100,
    claimed: false,
    type: 'daily',
    icon: '⚡',
  },
  {
    id: 'daily_combo_3',
    title: 'Combo Striker',
    description: 'Achieve a 3x Combo streak',
    target: 3,
    progress: 0,
    rewardCoins: 150,
    claimed: false,
    type: 'daily',
    icon: '🔥',
  },
  {
    id: 'daily_score_1500',
    title: 'High Scorer',
    description: 'Reach 1,500 points in a single match',
    target: 1500,
    progress: 0,
    rewardCoins: 200,
    claimed: false,
    type: 'daily',
    icon: '🏆',
  },
  {
    id: 'daily_blocks_40',
    title: 'Master Builder',
    description: 'Place 40 blocks on the board',
    target: 40,
    progress: 0,
    rewardCoins: 120,
    claimed: false,
    type: 'daily',
    icon: '🧩',
  },
  {
    id: 'daily_spin_wheel',
    title: 'Fortune Seeker',
    description: 'Spin the Lucky Wheel',
    target: 1,
    progress: 0,
    rewardCoins: 100,
    claimed: false,
    type: 'daily',
    icon: '🎡',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blast',
    title: 'First Blast',
    description: 'Clear your very first line',
    tier: 'bronze',
    target: 1,
    current: 0,
    rewardCoins: 50,
    unlocked: false,
    icon: '💥',
  },
  {
    id: 'combo_master',
    title: 'Combo Master',
    description: 'Reach a 5x Combo streak',
    tier: 'silver',
    target: 5,
    current: 0,
    rewardCoins: 250,
    unlocked: false,
    icon: '🔥',
  },
  {
    id: 'score_5000',
    title: 'Score Legend',
    description: 'Achieve a score of 5,000 points',
    tier: 'gold',
    target: 5000,
    current: 0,
    rewardCoins: 500,
    unlocked: false,
    icon: '👑',
  },
  {
    id: 'lines_100',
    title: 'Centurion',
    description: 'Clear a total of 100 lines',
    tier: 'gold',
    target: 100,
    current: 0,
    rewardCoins: 400,
    unlocked: false,
    icon: '🎯',
  },
  {
    id: 'wheel_spinner',
    title: 'Lucky Star',
    description: 'Spin the Lucky Wheel 5 times',
    tier: 'bronze',
    target: 5,
    current: 0,
    rewardCoins: 150,
    unlocked: false,
    icon: '🎡',
  },
  {
    id: 'skin_collector',
    title: 'Fashion Icon',
    description: 'Unlock 3 block skins',
    tier: 'silver',
    target: 3,
    current: 2,
    rewardCoins: 300,
    unlocked: false,
    icon: '🎨',
  },
  {
    id: 'multiline_quad',
    title: 'Quadruple Blast',
    description: 'Clear 4 or more lines simultaneously',
    tier: 'diamond',
    target: 4,
    current: 0,
    rewardCoins: 600,
    unlocked: false,
    icon: '🎆',
  },
  {
    id: 'imran_champion',
    title: 'Imran Champion',
    description: 'Reach Level 10 in Imran Blast',
    tier: 'diamond',
    target: 10,
    current: 1,
    rewardCoins: 1000,
    unlocked: false,
    icon: '🌟',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', rank: 1, name: 'Imran (Master)', avatar: '👑', score: 14850, level: 24, countryCode: 'PK' },
  { id: '2', rank: 2, name: 'Alex PuzzlePro', avatar: '⚡', score: 12400, level: 19, countryCode: 'US' },
  { id: '3', rank: 3, name: 'Yuki Blaster', avatar: '🌸', score: 10950, level: 17, countryCode: 'JP' },
  { id: '4', rank: 4, name: 'Sofia Star', avatar: '💎', score: 8720, level: 14, countryCode: 'BR' },
  { id: '5', rank: 5, name: 'Lucas Grid', avatar: '🎮', score: 7650, level: 12, countryCode: 'DE' },
  { id: '6', rank: 6, name: 'Zara Gem', avatar: '✨', score: 6200, level: 10, countryCode: 'UK' },
  { id: '7', rank: 7, name: 'Leo Neon', avatar: '🔥', score: 5400, level: 8, countryCode: 'CA' },
  { id: '8', rank: 8, name: 'Maya Blast', avatar: '🌈', score: 4890, level: 7, countryCode: 'FR' },
  { id: '9', rank: 9, name: 'Chen Smart', avatar: '🐉', score: 4120, level: 6, countryCode: 'CN' },
  { id: '10', rank: 10, name: 'Aiden Blocks', avatar: '🚀', score: 3500, level: 5, countryCode: 'AU' },
];

export interface SavedGameState {
  board: BoardCell[][];
  tray: TrayBlock[];
  score: number;
  combo: number;
  level: number;
  powerupsUsedInGame: number;
}

// Storage helpers
export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    // Fallback
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_STATS;
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function loadQuests(): Quest[] {
  try {
    const raw = localStorage.getItem(QUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_QUESTS;
}

export function saveQuests(quests: Quest[]): void {
  try {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
  } catch {}
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {}
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_LEADERBOARD;
}

export function saveLeaderboard(leaderboard: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch {}
}

export function loadSavedGame(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(SAVED_GAME_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveGameSession(state: SavedGameState | null): void {
  try {
    if (!state) {
      localStorage.removeItem(SAVED_GAME_KEY);
    } else {
      localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(state));
    }
  } catch {}
}
