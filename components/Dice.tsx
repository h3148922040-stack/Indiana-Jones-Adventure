
import React, { useState } from 'react';

interface DiceProps {
  onRoll: (value: number) => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRoll, disabled }) => {
  const [rolling, setRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(1);

  const roll = () => {
    if (disabled || rolling) return;
    setRolling(true);
    
    let iterations = 0;
    const interval = setInterval(() => {
      setCurrentValue(Math.floor(Math.random() * 6) + 1);
      iterations++;
      if (iterations > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setCurrentValue(finalValue);
        setRolling(false);
        onRoll(finalValue);
      }
    }, 80);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={roll}
        disabled={disabled || rolling}
        className={`w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center relative transition-all duration-200 transform
          ${rolling ? 'rotate-12 scale-110' : 'hover:scale-105 active:scale-95'}
          ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        `}
      >
        <div className={`grid grid-cols-3 grid-rows-3 w-16 h-16 p-2`}>
            {currentValue === 1 && <div className="col-start-2 row-start-2 bg-slate-900 rounded-full w-4 h-4 m-auto" />}
            {currentValue === 2 && (
                <>
                <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                </>
            )}
            {currentValue === 3 && (
                <>
                <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-2 row-start-2 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                </>
            )}
            {currentValue === 4 && (
                <>
                <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-3 row-start-1 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-1 row-start-3 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                </>
            )}
            {currentValue === 5 && (
                <>
                <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-3 row-start-1 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-2 row-start-2 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-1 row-start-3 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                </>
            )}
            {currentValue === 6 && (
                <>
                <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-3 row-start-1 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-1 row-start-2 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-3 row-start-2 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-1 row-start-3 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-4 h-4 m-auto" />
                </>
            )}
        </div>
      </button>
      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
        {rolling ? '投掷中...' : '点击投骰子'}
      </span>
    </div>
  );
};

export default Dice;
