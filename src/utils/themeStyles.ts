import { CellColor, BlockSkinId, BoardThemeId } from '../types';

export interface SkinMeta {
  id: BlockSkinId;
  name: string;
  price: number;
  description: string;
  previewColors: CellColor[];
  icon: string;
}

export interface BoardThemeMeta {
  id: BoardThemeId;
  name: string;
  price: number;
  description: string;
  bgClass: string;
  boardBgClass: string;
  cellEmptyClass: string;
  icon: string;
}

export const SKINS_METADATA: SkinMeta[] = [
  {
    id: 'classic',
    name: 'Jelly Pop',
    price: 0,
    description: 'Glossy 3D jelly blocks with satisfying shine.',
    previewColors: ['cyan', 'orange', 'purple'],
    icon: '🍬',
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    price: 0,
    description: 'Electric neon glow with laser-sharp borders.',
    previewColors: ['green', 'pink', 'yellow'],
    icon: '⚡',
  },
  {
    id: 'gem',
    name: 'Gem Crystal',
    price: 600,
    description: 'Faceted crystalline gems with specular highlights.',
    previewColors: ['blue', 'emerald', 'purple'],
    icon: '💎',
  },
  {
    id: 'candy',
    name: 'Sweet Candy',
    price: 900,
    description: 'Vibrant lollipop candy glaze with sugar sparkle.',
    previewColors: ['pink', 'yellow', 'cyan'],
    icon: '🍭',
  },
  {
    id: 'cyber',
    name: 'Matrix Tech',
    price: 1200,
    description: 'Futuristic circuit blocks with high-tech pulses.',
    previewColors: ['emerald', 'cyan', 'gold'],
    icon: '🤖',
  },
  {
    id: 'gold',
    name: 'Royal Gold',
    price: 1800,
    description: 'Opulent 24K pure gold ingots and jewelry finish.',
    previewColors: ['gold', 'orange', 'yellow'],
    icon: '👑',
  },
  {
    id: 'sunset',
    name: 'Sunset Mirage',
    price: 1500,
    description: 'Warm dusk gradients with golden hour vibrancy.',
    previewColors: ['orange', 'pink', 'purple'],
    icon: '🌅',
  },
  {
    id: 'sakura',
    name: 'Sakura Blossom',
    price: 2000,
    description: 'Serene cherry blossom petals with pearlescent pinks.',
    previewColors: ['pink', 'purple', 'emerald'],
    icon: '🌸',
  },
];

export const BOARD_THEMES_METADATA: BoardThemeMeta[] = [
  {
    id: 'midnight',
    name: 'Midnight Slate',
    price: 0,
    description: 'Deep obsidian dark theme with subtle indigo gridlines.',
    bgClass: 'from-slate-950 via-slate-900 to-indigo-950',
    boardBgClass: 'bg-slate-900/90 border-slate-700/60 shadow-2xl shadow-indigo-950/50',
    cellEmptyClass: 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80',
    icon: '🌌',
  },
  {
    id: 'deep_azure',
    name: 'Deep Azure',
    price: 0,
    description: 'Soothing oceanic sapphire gradient with cyan accents.',
    bgClass: 'from-sky-950 via-slate-900 to-blue-950',
    boardBgClass: 'bg-blue-950/80 border-cyan-800/50 shadow-2xl shadow-cyan-950/50',
    cellEmptyClass: 'bg-blue-950/70 border-cyan-900/60 hover:border-cyan-700/80',
    icon: '🌊',
  },
  {
    id: 'cyber_violet',
    name: 'Cyber Violet',
    price: 800,
    description: 'Hyper-vibrant synthwave purple with neon aura.',
    bgClass: 'from-purple-950 via-slate-950 to-fuchsia-950',
    boardBgClass: 'bg-purple-950/80 border-fuchsia-800/50 shadow-2xl shadow-fuchsia-950/50',
    cellEmptyClass: 'bg-purple-950/70 border-purple-900/60 hover:border-fuchsia-700/80',
    icon: '👾',
  },
  {
    id: 'frosted_light',
    name: 'Frosted Pearl',
    price: 1000,
    description: 'Clean high-contrast light theme with frosted glass aesthetics.',
    bgClass: 'from-slate-100 via-sky-50 to-indigo-100',
    boardBgClass: 'bg-white/85 border-slate-300 shadow-xl shadow-slate-300/40 text-slate-900',
    cellEmptyClass: 'bg-slate-200/80 border-slate-300/90 hover:border-slate-400',
    icon: '❄️',
  },
  {
    id: 'amoled',
    name: 'AMOLED Black',
    price: 1200,
    description: 'Pure 100% OLED deep black for maximum battery savings and contrast.',
    bgClass: 'from-black via-black to-black',
    boardBgClass: 'bg-neutral-950 border-neutral-800 shadow-2xl shadow-black',
    cellEmptyClass: 'bg-black border-neutral-900 hover:border-neutral-800',
    icon: '🖤',
  },
];

/**
 * Returns Tailwind gradient/color styling for a given block color and skin
 */
export function getBlockColorClasses(color: CellColor = 'cyan', skin: BlockSkinId = 'classic'): string {
  // Classic Jelly Gloss
  if (skin === 'classic') {
    switch (color) {
      case 'cyan':
        return 'bg-gradient-to-b from-cyan-300 via-cyan-400 to-cyan-600 border-t-cyan-200 border-l-cyan-200 border-b-cyan-700 border-r-cyan-700 shadow-sm shadow-cyan-500/40';
      case 'blue':
        return 'bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700 border-t-blue-200 border-l-blue-200 border-b-blue-800 border-r-blue-800 shadow-sm shadow-blue-500/40';
      case 'orange':
        return 'bg-gradient-to-b from-amber-300 via-orange-500 to-orange-600 border-t-amber-200 border-l-amber-200 border-b-orange-700 border-r-orange-700 shadow-sm shadow-orange-500/40';
      case 'yellow':
        return 'bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-500 border-t-yellow-100 border-l-yellow-100 border-b-amber-600 border-r-amber-600 shadow-sm shadow-yellow-500/40';
      case 'green':
        return 'bg-gradient-to-b from-lime-300 via-emerald-500 to-emerald-700 border-t-lime-200 border-l-lime-200 border-b-emerald-800 border-r-emerald-800 shadow-sm shadow-emerald-500/40';
      case 'purple':
        return 'bg-gradient-to-b from-purple-300 via-purple-500 to-purple-700 border-t-purple-200 border-l-purple-200 border-b-purple-800 border-r-purple-800 shadow-sm shadow-purple-500/40';
      case 'red':
        return 'bg-gradient-to-b from-rose-300 via-red-500 to-red-700 border-t-rose-200 border-l-rose-200 border-b-red-800 border-r-red-800 shadow-sm shadow-red-500/40';
      case 'pink':
        return 'bg-gradient-to-b from-pink-300 via-pink-500 to-pink-700 border-t-pink-200 border-l-pink-200 border-b-pink-800 border-r-pink-800 shadow-sm shadow-pink-500/40';
      case 'gold':
        return 'bg-gradient-to-b from-yellow-100 via-amber-400 to-yellow-600 border-t-yellow-50 border-l-yellow-50 border-b-amber-700 border-r-amber-700 shadow-sm shadow-amber-500/50';
      case 'emerald':
        return 'bg-gradient-to-b from-emerald-300 via-teal-500 to-emerald-700 border-t-emerald-200 border-l-emerald-200 border-b-emerald-800 border-r-emerald-800 shadow-sm shadow-teal-500/40';
    }
  }

  // Neon Laser Glow
  if (skin === 'neon') {
    switch (color) {
      case 'cyan':
        return 'bg-cyan-500 border-2 border-cyan-200 shadow-md shadow-cyan-400/80';
      case 'blue':
        return 'bg-blue-600 border-2 border-sky-300 shadow-md shadow-blue-400/80';
      case 'orange':
        return 'bg-orange-500 border-2 border-orange-200 shadow-md shadow-orange-400/80';
      case 'yellow':
        return 'bg-yellow-400 border-2 border-yellow-100 shadow-md shadow-yellow-300/90 text-slate-900';
      case 'green':
        return 'bg-emerald-500 border-2 border-lime-200 shadow-md shadow-emerald-400/80';
      case 'purple':
        return 'bg-purple-600 border-2 border-fuchsia-300 shadow-md shadow-purple-400/80';
      case 'red':
        return 'bg-red-500 border-2 border-rose-200 shadow-md shadow-red-400/80';
      case 'pink':
        return 'bg-pink-500 border-2 border-pink-200 shadow-md shadow-pink-400/80';
      case 'gold':
        return 'bg-amber-400 border-2 border-amber-100 shadow-md shadow-amber-300/90';
      case 'emerald':
        return 'bg-teal-500 border-2 border-teal-200 shadow-md shadow-teal-400/80';
    }
  }

  // Crystal Gem
  if (skin === 'gem') {
    switch (color) {
      case 'cyan':
        return 'bg-gradient-to-tr from-cyan-700 via-cyan-400 to-sky-100 border border-cyan-100/70 shadow-sm shadow-cyan-400/40';
      case 'blue':
        return 'bg-gradient-to-tr from-blue-800 via-indigo-500 to-blue-100 border border-blue-100/70 shadow-sm shadow-blue-400/40';
      case 'orange':
        return 'bg-gradient-to-tr from-orange-700 via-amber-400 to-yellow-100 border border-orange-100/70 shadow-sm shadow-orange-400/40';
      case 'yellow':
        return 'bg-gradient-to-tr from-amber-600 via-yellow-300 to-yellow-50 border border-yellow-100/70 shadow-sm shadow-yellow-300/40';
      case 'green':
        return 'bg-gradient-to-tr from-emerald-800 via-emerald-400 to-lime-100 border border-lime-100/70 shadow-sm shadow-emerald-400/40';
      case 'purple':
        return 'bg-gradient-to-tr from-purple-800 via-purple-400 to-fuchsia-100 border border-purple-100/70 shadow-sm shadow-purple-400/40';
      case 'red':
        return 'bg-gradient-to-tr from-red-800 via-rose-500 to-rose-100 border border-red-100/70 shadow-sm shadow-red-400/40';
      case 'pink':
        return 'bg-gradient-to-tr from-pink-800 via-pink-400 to-pink-100 border border-pink-100/70 shadow-sm shadow-pink-400/40';
      case 'gold':
        return 'bg-gradient-to-tr from-amber-700 via-yellow-400 to-white border border-amber-100/80 shadow-sm shadow-amber-300/50';
      case 'emerald':
        return 'bg-gradient-to-tr from-teal-800 via-teal-400 to-emerald-100 border border-teal-100/70 shadow-sm shadow-teal-400/40';
    }
  }

  // Sweet Candy
  if (skin === 'candy') {
    return 'bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 border-2 border-white/60 shadow-sm shadow-pink-400/30';
  }

  // Royal Gold
  if (skin === 'gold') {
    return 'bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 border-t-yellow-100 border-b-amber-800 border-x-amber-500 shadow-md shadow-amber-500/40';
  }

  // Sunset Mirage
  if (skin === 'sunset') {
    return 'bg-gradient-to-tr from-orange-600 via-rose-500 to-purple-500 border-t-orange-300 border-b-purple-800 shadow-sm shadow-rose-500/40';
  }

  // Sakura
  if (skin === 'sakura') {
    return 'bg-gradient-to-b from-pink-200 via-pink-400 to-rose-400 border-t-white/80 border-b-rose-500 shadow-sm shadow-pink-300/40';
  }

  // Matrix Cyber
  return 'bg-slate-900 border-2 border-emerald-400 shadow-sm shadow-emerald-500/50';
}
