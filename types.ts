
export type TileType = 'NORMAL' | 'GOLD' | 'TRAP' | 'PORTAL' | 'START' | 'FINISH';

export interface Tile {
  id: number;
  type: TileType;
  title: string;
  description: string;
}

export interface Player {
  id: number;
  name: string;
  position: number; // 0 to MAX_TILES
  score: number;
  color: string;
  avatar: string;
}

export interface GameEvent {
  playerName: string;
  action: string;
  detail: string;
  timestamp: number;
}
