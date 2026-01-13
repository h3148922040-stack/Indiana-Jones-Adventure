
import React from 'react';
import { TileType } from './types';

export const BOARD_SIZE = 29; // 修改为 29，总格数为 30 (0-29)
export const PLAYER_COUNT = 5;

export const COLORS = [
  '#ef4444', // 烈焰红
  '#3b82f6', // 海洋蓝
  '#10b981', // 翡翠绿
  '#f59e0b', // 沙漠金
  '#a855f7', // 神秘紫
];

export const AVATARS = [
  '⚔️', '🏹', '🪄', '🛡️', '🧪'
];

export const TILE_CONFIG: Record<TileType, { color: string; icon: string; label: string; effect: string; effectDetail: string }> = {
  START: { 
    color: 'bg-emerald-700', 
    icon: '⛺', 
    label: '起点营地', 
    effect: 'START', 
    effectDetail: '探险队的起点，整装待发。' 
  },
  FINISH: { 
    color: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600', 
    icon: '🏆', 
    label: '终极宝藏', 
    effect: 'WIN', 
    effectDetail: '到达此地即获得胜利，并获得100黄金。' 
  },
  NORMAL: { 
    color: 'bg-stone-200/80', 
    icon: '👣', 
    label: '荒野之路', 
    effect: '', 
    effectDetail: '一段平凡的旅程。' 
  },
  GOLD: { 
    color: 'bg-orange-300', 
    icon: '🏺', 
    label: '古老遗物', 
    effect: '+20💰', 
    effectDetail: '发现了古代遗留的财宝，增加20黄金。' 
  },
  TRAP: { 
    color: 'bg-red-400', 
    icon: '💀', 
    label: '致命机关', 
    effect: '-3👣', 
    effectDetail: '触发了古墓陷阱！强制后退3步。' 
  },
  PORTAL: { 
    color: 'bg-indigo-400', 
    icon: '🌀', 
    label: '神秘信标', 
    effect: '+4👣', 
    effectDetail: '古老的传送阵法，帮助你前进4步。' 
  },
};
