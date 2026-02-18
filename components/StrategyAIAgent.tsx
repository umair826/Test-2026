
import React, { useState } from 'react';
import { Pool, LiquidityStats } from '../types';
import { getStrategyAdvice } from '../services/geminiService';

interface StrategyAIAgentProps {
  pool: Pool;
  stats: LiquidityStats;
}

const StrategyAIAgent: React.FC<StrategyAIAgentProps> = ({ pool, stats }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await getStrategyAdvice(pool, stats, query);
    setAdvice(result || "No advice received.");
    setLoading(false);
  };

  return (
    <div className="bg-indigo-50 dark:bg-slate-900 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 shadow-inner">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold dark:text-white">Pro AI Strategist</h2>
          <p className="text-xs text-slate-500">Gemini-powered liquidity insights</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about rebalancing, hedging, or yield..."
            className="w-full bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 rounded-xl p-3 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
          <button
            onClick={handleGetAdvice}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 rounded-lg font-bold disabled:bg-slate-400 transition-colors"
          >
            {loading ? 'Thinking...' : 'Analyze'}
          </button>
        </div>

        {advice && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-50 dark:border-slate-700 prose prose-indigo dark:prose-invert max-w-none text-sm animate-fade-in">
            <div className="whitespace-pre-wrap dark:text-slate-300">
              {advice}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyAIAgent;
