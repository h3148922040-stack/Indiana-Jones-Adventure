
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tile, Player, GameEvent, TileType } from './types';
import { BOARD_SIZE, PLAYER_COUNT, COLORS, AVATARS, TILE_CONFIG } from './constants';
import { generateEventNarrative } from './services/adventureLog';
import Dice from './components/Dice';

// --- 子组件：玩家卡片 ---
const PlayerCard: React.FC<{ 
    player: Player; 
    isActive: boolean; 
    onClick: () => void;
    disabled: boolean;
}> = ({ player, isActive, onClick, disabled }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-3 p-3 rounded-xl transition-all border-2 w-full text-left relative overflow-hidden
      ${isActive ? 'bg-slate-700 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-slate-800/50 border-transparent opacity-70'}
      ${disabled && !isActive ? 'grayscale' : 'cursor-pointer'}
    `}
  >
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-slate-900 border-2" style={{ borderColor: player.color }}>
      {player.avatar}
    </div>
    <div className="flex-1">
      <div className="font-bold text-slate-100 text-lg">{player.name}</div>
      <div className="text-xs text-amber-400 font-bold uppercase tracking-tighter">
        黄金: {player.score} | 位置: {player.position}
      </div>
    </div>
    {isActive && (
      <motion.div 
        layoutId="activeGlow"
        className="absolute inset-0 border-2 border-yellow-400 pointer-events-none"
        initial={false}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    )}
  </motion.button>
);

// --- 子组件：棋格 ---
const TileComponent: React.FC<{ tile: Tile; playersAtTile: Player[] }> = ({ tile, playersAtTile }) => {
  const config = TILE_CONFIG[tile.type];
  const isStart = tile.type === 'START';
  const isFinish = tile.type === 'FINISH';
  
  return (
    <div className={`relative w-full aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all tile-shadow overflow-hidden
      ${config.color} hover:brightness-105 group z-10 
      ${isStart ? 'border-emerald-400 ring-4 ring-emerald-900/40 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 
        isFinish ? 'border-amber-200 ring-4 ring-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.6)]' : 
        'border-amber-950/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'}
    `}>
      {/* 终点流光效果 */}
      {isFinish && (
        <>
          <motion.div 
            animate={{ 
              x: ['-100%', '200%'],
              opacity: [0, 0.3, 0]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 pointer-events-none"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute inset-0 bg-yellow-200/30 blur-2xl"
          />
        </>
      )}

      {/* 起点特殊背景装饰 */}
      {isStart && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-full h-full border-[6px] border-white rounded-full scale-110"></div>
           </div>
        </div>
      )}

      <span className={`filter drop-shadow-lg group-hover:scale-110 transition-transform relative z-10
        ${isStart || isFinish ? 'text-4xl' : 'text-3xl mb-1'}
      `}>
        {config.icon}
      </span>
      
      {/* 极高对比度的数字标识 */}
      {!isStart && !isFinish && (
        <div className="absolute top-1 left-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center border border-amber-900/30 shadow-sm z-20">
          <span className="text-[9px] text-yellow-500 font-black leading-none">
            {tile.id}
          </span>
        </div>
      )}

      {/* 棋格效果标识 */}
      {config.effect && !isStart && !isFinish && (
        <div className="absolute bottom-1 right-1 bg-black/10 px-1 rounded text-[8px] font-black text-black/40">
          {config.effect}
        </div>
      )}

      <div className={`font-bold uppercase tracking-tight relative z-10 text-center pointer-events-none
        ${isStart ? 'text-[10px] text-emerald-50 mt-1 px-2 bg-emerald-900/40 rounded-full' : 
          isFinish ? 'text-[10px] text-amber-950 mt-1 px-2 bg-yellow-300 rounded-full border border-amber-600 shadow-sm' : 
          'text-[8px] text-black/60'}
      `}>
        {config.label}
      </div>
      
      {/* 棋格上的玩家容器 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {playersAtTile.map((p, idx) => (
            <motion.div 
              key={p.id}
              layoutId={`player-${p.id}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                type: "tween", 
                ease: "easeInOut",
                duration: 0.4 
              }}
              className="absolute w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-2xl shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-30"
              style={{ 
                backgroundColor: p.color,
                transform: `translate(${idx * 4}px, ${idx * -4}px)` 
              }}
            >
              {p.avatar}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- 主应用组件 ---
export default function App() {
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'WON'>('SETUP');
  const [players, setPlayers] = useState<Player[]>([]);
  const [board, setBoard] = useState<Tile[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(null);
  const [logs, setLogs] = useState<GameEvent[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 初始化游戏数据
  const initGame = useCallback(() => {
    const initialPlayers: Player[] = Array.from({ length: PLAYER_COUNT }, (_, i) => ({
      id: i,
      name: `探险者 ${i + 1}`,
      position: 0,
      score: 0,
      color: COLORS[i],
      avatar: AVATARS[i],
    }));
    setPlayers(initialPlayers);

    const newBoard: Tile[] = Array.from({ length: BOARD_SIZE + 1 }, (_, i) => {
      let type: TileType = 'NORMAL';
      if (i === 0) type = 'START';
      else if (i === BOARD_SIZE) type = 'FINISH';
      else if (i % 7 === 0) type = 'TRAP';
      else if (i % 5 === 0) type = 'GOLD';
      else if (i % 9 === 0) type = 'PORTAL';
      return { id: i, type, title: TILE_CONFIG[type].label, description: "" };
    });
    setBoard(newBoard);
    setLogs([]);
    setWinner(null);
    setCurrentPlayerId(null);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const addLog = (playerName: string, action: string, detail: string) => {
    setLogs(prev => [{ playerName, action, detail, timestamp: Date.now() }, ...prev].slice(0, 15));
  };

  const handleStartGame = () => {
    setGameState('PLAYING');
    setCurrentPlayerId(0);
    addLog("系统", "启程", "探险队已进入神秘山谷！");
  };

  const resetGameManually = () => {
    if (window.confirm("确定要放弃当前进度并重新开始吗？")) {
      initGame();
      setGameState('SETUP');
    }
  };

  const animateMove = async (playerId: number, steps: number) => {
    const isForward = steps > 0;
    const moveCount = Math.abs(steps);

    for (let i = 0; i < moveCount; i++) {
      setPlayers(prev => prev.map(p => {
        if (p.id === playerId) {
          const nextPos = isForward ? p.position + 1 : p.position - 1;
          return { ...p, position: Math.max(0, Math.min(BOARD_SIZE, nextPos)) };
        }
        return p;
      }));
      await new Promise(r => setTimeout(r, 450));
    }
  };

  const handleRoll = async (diceValue: number) => {
    if (currentPlayerId === null || isProcessing) return;
    setIsProcessing(true);

    const player = players.find(p => p.id === currentPlayerId)!;
    await animateMove(player.id, diceValue);
    
    let latestPos = 0;
    setPlayers(prev => {
        const p = prev.find(pl => pl.id === currentPlayerId);
        latestPos = p ? p.position : 0;
        return prev;
    });

    const targetTile = board[latestPos];
    let scoreChange = 0;
    let stepChange = 0;

    switch (targetTile.type) {
      case 'GOLD': scoreChange = 20; break;
      case 'TRAP': stepChange = -3; break;
      case 'PORTAL': stepChange = 4; break;
      case 'FINISH': scoreChange = 100; break;
    }

    if (stepChange !== 0) {
      await new Promise(r => setTimeout(r, 600)); 
      await animateMove(player.id, stepChange);
    }

    let finalPos = 0;
    setPlayers(prev => {
        const updated = prev.map(p => 
            p.id === currentPlayerId ? { ...p, score: Math.max(0, p.score + scoreChange) } : p
        );
        const f = updated.find(pl => pl.id === currentPlayerId);
        finalPos = f ? f.position : 0;
        return updated;
    });

    const narrative = await generateEventNarrative(player.name, targetTile.type, scoreChange, stepChange);
    addLog(player.name, `掷出 ${diceValue} 点`, narrative);

    if (finalPos === BOARD_SIZE) {
      setTimeout(() => {
        setWinner(players.find(p => p.id === currentPlayerId) || null);
        setGameState('WON');
      }, 500);
    } else {
      setCurrentPlayerId((currentPlayerId + 1) % PLAYER_COUNT);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-slate-950 overflow-hidden text-slate-100">
      {/* 侧边栏 */}
      <div className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-30">
        <div className="p-6 bg-slate-900/50 backdrop-blur-md relative">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl adventure-font font-bold text-yellow-500 tracking-wider drop-shadow-lg">
              夺宝奇兵
            </h1>
            {gameState !== 'SETUP' && (
              <button 
                onClick={resetGameManually}
                className="text-[10px] text-slate-500 hover:text-amber-500 flex flex-col items-center gap-1 transition-colors group"
                title="重新开始"
              >
                <span className="text-xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                <span className="adventure-font uppercase">Restart</span>
              </button>
            )}
          </div>
          <div className="space-y-3">
            {players.map((p) => (
              <PlayerCard 
                key={p.id} 
                player={p} 
                isActive={currentPlayerId === p.id} 
                disabled={isProcessing || gameState === 'WON' || gameState === 'SETUP'}
                onClick={() => !isProcessing && setCurrentPlayerId(p.id)}
              />
            ))}
          </div>
        </div>

        {/* 探险指南 */}
        <div className="px-6 py-4 bg-slate-800/30 border-y border-slate-700/50">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>📜</span> 探险指南
          </h3>
          <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[160px] custom-scrollbar pr-2">
            {Object.entries(TILE_CONFIG).filter(([key]) => key !== 'NORMAL' && key !== 'START').map(([key, config]) => (
              <div key={key} className="flex items-center gap-2 text-[11px] bg-slate-950/40 p-1.5 rounded-lg border border-slate-700/30">
                <span className="text-base">{config.icon}</span>
                <div className="flex-1">
                  <span className="font-bold text-slate-200">{config.label}</span>
                  <p className="text-slate-500 leading-tight">{config.effectDetail}</p>
                </div>
                <span className="text-amber-500 font-bold ml-auto shrink-0">{config.effect === 'WIN' ? '+100💰' : config.effect}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-800/40 flex flex-col items-center shrink-0">
          <Dice 
            onRoll={handleRoll} 
            disabled={isProcessing || gameState === 'WON' || gameState === 'SETUP'} 
          />
        </div>

        <div className="flex-1 overflow-hidden flex flex-col p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">探险日志</h3>
          <div className="flex-1 overflow-y-auto space-y-3 px-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {logs.map((log, i) => (
                <motion.div 
                  key={log.timestamp + i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-800/30 p-3 rounded-lg border-l-4"
                  style={{ borderLeftColor: players.find(p => p.name === log.playerName)?.color || '#facc15' }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm" style={{ color: players.find(p => p.name === log.playerName)?.color }}>{log.playerName}</span>
                    <span className="text-[10px] text-slate-500">{log.action}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed italic">"{log.detail}"</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 棋盘主画布 */}
      <div className="flex-1 relative flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="map-texture p-6 md:p-10 rounded-[24px] border-[12px] border-[#4a3222] shadow-[0_40px_100px_rgba(0,0,0,0.9)] max-w-5xl w-full"
        >
          {/* 背景罗盘装饰 */}
          <svg className="compass-rose" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            <text x="48" y="10" fontSize="8" fill="currentColor" className="adventure-font">N</text>
          </svg>

          {/* 网格显示 */}
          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-3 relative z-10 p-2 bg-black/10 rounded-xl border border-amber-950/20 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]">
            {board.map((tile) => (
              <TileComponent 
                key={tile.id} 
                tile={tile} 
                playersAtTile={players.filter(p => p.position === tile.id)} 
              />
            ))}
          </div>
        </motion.div>

        {gameState === 'SETUP' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 p-8 rounded-[40px] border-4 border-amber-600 shadow-[0_0_50px_rgba(217,119,6,0.3)] max-w-lg w-full text-center"
            >
              <h2 className="text-4xl adventure-font text-yellow-500 mb-6 drop-shadow-md">准备你的远征</h2>
              <div className="space-y-4 mb-8">
                {players.map(p => (
                  <div key={p.id} className="flex gap-3 items-center bg-slate-800 p-2 rounded-2xl border border-slate-700/50">
                    <span className="text-2xl w-10 shrink-0">{p.avatar}</span>
                    <input 
                      className="bg-transparent border-b border-slate-600 focus:border-yellow-500 outline-none flex-1 text-white py-1 px-2 transition-colors"
                      value={p.name}
                      maxLength={10}
                      onChange={(e) => setPlayers(prev => prev.map(pl => pl.id === p.id ? { ...pl, name: e.target.value } : pl))}
                    />
                  </div>
                ))}
              </div>
              <button 
                onClick={handleStartGame}
                className="w-full bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xl font-bold py-4 rounded-2xl shadow-xl transition-all adventure-font tracking-widest"
              >
                进入荒野
              </button>
            </motion.div>
          </div>
        )}

        {/* 获胜界面 */}
        {gameState === 'WON' && winner && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-10 md:p-16 bg-slate-900 rounded-[60px] border-8 border-yellow-500 shadow-[0_0_120px_rgba(234,179,8,0.4)] max-w-2xl"
            >
              <motion.div 
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2.5 }} 
                className="text-9xl mb-8 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]"
              >
                🏆
              </motion.div>
              <h2 className="text-5xl md:text-7xl adventure-font text-yellow-500 mb-6">传奇诞生！</h2>
              <p className="text-2xl text-slate-300 mb-2">伟大的探险家 <span className="font-bold underline px-2" style={{ color: winner.color }}>{winner.name}</span></p>
              <p className="text-xl text-slate-400 mb-10 italic">穿越了重重机关，成功夺取了黄金偶像！</p>
              <div className="flex flex-col gap-4 items-center">
                <div className="text-amber-400 text-3xl font-bold mb-4">最终赏金: {winner.score} 💰</div>
                <button 
                  onClick={() => {
                    initGame();
                    setGameState('SETUP');
                  }}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-16 rounded-full text-2xl transition-all shadow-2xl active:scale-95 adventure-font tracking-widest"
                >
                  重返探险之路
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
