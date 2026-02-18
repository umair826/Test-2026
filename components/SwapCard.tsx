
import React, { useState, useEffect } from 'react';
import { Pool, SwapResult } from '../types';

interface SwapCardProps {
  pool: Pool;
  onSwap: (inputAmount: number, isXtoY: boolean) => void;
}

const SwapCard: React.FC<SwapCardProps> = ({ pool, onSwap }) => {
  const [amount, setAmount] = useState<string>('');
  const [isXtoY, setIsXtoY] = useState<boolean>(true);
  const [result, setResult] = useState<SwapResult | null>(null);

  useEffect(() => {
    const inputNum = parseFloat(amount);
    if (!inputNum || isNaN(inputNum) || inputNum <= 0) {
      setResult(null);
      return;
    }

    const x = pool.reserveX;
    const y = pool.reserveY;
    const fee = pool.fee;

    if (isXtoY) {
      // x * y = k
      // (x + dx) * (y - dy) = k
      const dx = inputNum * (1 - fee);
      const dy = (y * dx) / (x + dx);
      const priceImpact = (1 - (dy / inputNum) / (y / x)) * 100;
      setResult({
        inputAmount: inputNum,
        outputAmount: dy,
        priceImpact,
        executionPrice: dy / inputNum,
        feePaid: inputNum * fee
      });
    } else {
      const dy = inputNum * (1 - fee);
      const dx = (x * dy) / (y + dy);
      const priceImpact = (1 - (dx / inputNum) / (x / y)) * 100;
      setResult({
        inputAmount: inputNum,
        outputAmount: dx,
        priceImpact,
        executionPrice: dx / inputNum,
        feePaid: inputNum * fee
      });
    }
  }, [amount, isXtoY, pool]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white">Swap Simulator</h2>
        <button 
          onClick={() => setIsXtoY(!isXtoY)}
          className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          Reverse
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
            Pay {isXtoY ? pool.tokenX.symbol : pool.tokenY.symbol}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-2xl mono focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        {result && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Receive (est.)</span>
              <span className="font-semibold dark:text-white">{result.outputAmount.toFixed(4)} {isXtoY ? pool.tokenY.symbol : pool.tokenX.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Price Impact</span>
              <span className={`font-semibold ${result.priceImpact > 5 ? 'text-red-500' : 'text-green-500'}`}>
                {result.priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Fee ({(pool.fee * 100).toFixed(1)}%)</span>
              <span className="font-semibold dark:text-slate-300">
                {result.feePaid.toFixed(6)} {isXtoY ? pool.tokenX.symbol : pool.tokenY.symbol}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => onSwap(parseFloat(amount), isXtoY)}
          disabled={!result}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 mt-4"
        >
          Execute Swap
        </button>
      </div>
    </div>
  );
};

export default SwapCard;
