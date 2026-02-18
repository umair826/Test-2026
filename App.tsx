
import React, { useState, useEffect, useMemo } from 'react';
import { Theme, Pool, LiquidityStats } from './types.ts';
import { INITIAL_POOL } from './constants.ts';
import ThemeToggle from './components/ThemeToggle.tsx';
import SwapCard from './components/SwapCard.tsx';
import PriceChart from './components/PriceChart.tsx';
import StrategyAIAgent from './components/StrategyAIAgent.tsx';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || Theme.DARK;
  });
  
  const [pool, setPool] = useState<Pool>(INITIAL_POOL);
  const [initialReserveX] = useState(INITIAL_POOL.reserveX);
  const [initialReserveY] = useState(INITIAL_POOL.reserveY);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.DARK);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const stats: LiquidityStats = useMemo(() => {
    const currentPriceX = pool.reserveY / pool.reserveX;
    const initialPriceX = initialReserveY / initialReserveX;
    
    // Impermanent Loss formula: IL = (2 * sqrt(price_ratio) / (1 + price_ratio)) - 1
    const priceRatio = currentPriceX / initialPriceX;
    const il = (2 * Math.sqrt(priceRatio) / (1 + priceRatio)) - 1;

    return {
      tvl: (pool.reserveX * pool.tokenX.priceInUSD) + (pool.reserveY * pool.tokenY.priceInUSD),
      priceX: currentPriceX,
      priceY: 1 / currentPriceX,
      impermanentLoss: il * 100
    };
  }, [pool, initialReserveX, initialReserveY]);

  const handleSwap = (inputAmount: number, isXtoY: boolean) => {
    const fee = pool.fee;
    const x = pool.reserveX;
    const y = pool.reserveY;

    if (isXtoY) {
      const dx = inputAmount * (1 - fee);
      const dy = (y * dx) / (x + dx);
      setPool(prev => ({
        ...prev,
        reserveX: prev.reserveX + inputAmount,
        reserveY: prev.reserveY - dy
      }));
    } else {
      const dy = inputAmount * (1 - fee);
      const dx = (x * dy) / (y + dy);
      setPool(prev => ({
        ...prev,
        reserveY: prev.reserveY + inputAmount,
        reserveX: prev.reserveX - dx
      }));
    }
  };

  const handleReset = () => {
    setPool(INITIAL_POOL);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Professional</span>
              <h1 className="text-3xl font-bold dark:text-white tracking-tight">DeFi AMM Simulator</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg">
              Model liquidity behavior, calculate slippage, and simulate constant product invariant pools in real-time.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleReset}
              className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Reset Simulation
            </button>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Stats and Chart */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Value Locked</p>
                <p className="text-2xl font-bold dark:text-white mono">${stats.tvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Price {pool.tokenX.symbol}</p>
                <p className="text-2xl font-bold dark:text-white mono">{stats.priceX.toFixed(2)} {pool.tokenY.symbol}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Impermanent Loss</p>
                <p className={`text-2xl font-bold mono ${stats.impermanentLoss < 0 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                  {stats.impermanentLoss.toFixed(4)}%
                </p>
              </div>
            </div>

            <PriceChart pool={pool} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                 <h3 className="font-bold dark:text-white mb-4">Reserve Distribution</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-sm text-slate-500">{pool.tokenX.symbol}</span>
                      <span className="text-lg font-bold dark:text-white mono">{pool.reserveX.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden">
                       <div className="bg-indigo-600 h-full" style={{ width: '50%' }}></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-sm text-slate-500">{pool.tokenY.symbol}</span>
                      <span className="text-lg font-bold dark:text-white mono">{pool.reserveY.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden">
                       <div className="bg-indigo-400 h-full" style={{ width: '50%' }}></div>
                    </div>
                 </div>
               </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                 <p className="text-sm text-slate-500 mb-2">The Constant Product formula (x * y = k) ensures that the total value of assets in the pool remains balanced in a 50/50 ratio by value (ignoring external market prices).</p>
                 <a href="https://uniswap.org/whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm font-bold hover:underline">Read v2 Whitepaper &rarr;</a>
               </div>
            </div>
          </div>

          {/* Right Column: Interaction and AI */}
          <div className="lg:col-span-4 space-y-8">
            <SwapCard pool={pool} onSwap={handleSwap} />
            <StrategyAIAgent pool={pool} stats={stats} />
            
            <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <h4 className="font-bold dark:text-white mb-2 text-sm">Simulation Parameters</h4>
              <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <li className="flex justify-between"><span>AMM Model:</span> <span className="mono">CPMM (v2)</span></li>
                <li className="flex justify-between"><span>Pool Fee:</span> <span className="mono">0.30%</span></li>
                <li className="flex justify-between"><span>Slippage Model:</span> <span className="mono">Standard</span></li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 DeFi Pro Simulator. Built for educational and professional modeling purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
