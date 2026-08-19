export type CellColor = 
  | 'cyan' 
  | 'blue' 
  | 'orange' 
  | 'yellow' 
  | 'green' 
  | 'purple' 
  | 'red' 
  | 'pink' 
  | 'gold' 
  | 'emerald';

export type BlockSkinId = 'classic' | 'neon' | 'candy' | 'gem' | 'cyber' | 'gold' | 'sunset' | 'sakura';
export type BoardThemeId = 'midnight' | 'deep_azure' | 'cyber_violet' | 'frosted_light' | 'amoled';

export interface BoardCell {
  filled: boolean;
  color?: CellColor;
  skin?: BlockSkinId;
  clearing?: boolean;
  highlight?: boolean;
  highlightInvalid?: boolean;
  animating?: boolean;
}

export interface ShapeDefinition {
  id: string;
  name: string;
  matrix: number[][]; // 1 for filled, 0 for empty
  color: CellColor;
  weight?: number; // For weighted random distribution
}

export interface TrayBlock {
  id: string;
  shape: ShapeDefinition;
  placed: boolean;
}

export interface DraggingState {
  trayIndex: number;
  block: TrayBlock;
  startPointerX: number;
  startPointerY: number;
  currentPointerX: number;
  currentPointerY: number;
  gridRow: number | null; // target anchor row
  gridCol: number | null; // target anchor col
  isValid: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  highScore: number;
  totalLinesCleared: number;
  highestCombo: number;
  totalBlocksPlaced: number;
  totalCoinsEarned: number;
  revivesUsed: number;
  luckySpinsCount: number;
  playTimeMinutes: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  activeSkin: BlockSkinId;
  activeBoardTheme: BoardThemeId;
  unlockedSkins: BlockSkinId[];
  unlockedBoardThemes: BoardThemeId[];
  powerups: {
    hammer: number;
    bomb: number;
    reroll: number;
    undo: number;
  };
  lastDailyClaimTimestamp: number;
  dailyStreak: number;
  lastFreeSpinTimestamp: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  themeMode: 'dark' | 'light' | 'amoled';
  androidFrame: boolean;
  showPlacementGuide: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardCoins: number;
  claimed: boolean;
  type: 'daily' | 'achievement';
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  target: number;
  current: number;
  rewardCoins: number;
  unlocked: boolean;
  icon: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  level: number;
  isCurrentUser?: boolean;
  badge?: string;
  countryCode?: string;
}

export type ActivePowerUp = 'hammer' | 'bomb' | null;

export interface ScorePopup {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  isCombo?: boolean;
}
