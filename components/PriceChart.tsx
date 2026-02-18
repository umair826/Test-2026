
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Pool } from '../types';

interface PriceChartProps {
  pool: Pool;
}

const PriceChart: React.FC<PriceChartProps> = ({ pool }) => {
  const k = pool.reserveX * pool.reserveY;
  
  // Generate curve points around current reserveX
  const data = [];
  const startX = pool.reserveX * 0.5;
  const endX = pool.reserveX * 1.5;
  const step = (endX - startX) / 40;

  for (let x = startX; x <= endX; x += step) {
    const y = k / x;
    data.push({ x: x, y: y });
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold dark:text-white">Constant Product Curve</h2>
        <span className="text-xs text-slate-500 font-mono">x * y = {k.toLocaleString()}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} vertical={false} />
          <XAxis 
            dataKey="x" 
            label={{ value: pool.tokenX.symbol + ' Reserves', position: 'insideBottom', offset: -5 }} 
            tick={{ fontSize: 10 }}
            hide
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            hide
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
                    <p className="text-xs font-bold dark:text-white mb-1">Point on Curve</p>
                    <p className="text-[10px] text-slate-500">{pool.tokenX.symbol}: {Number(payload[0].payload.x).toFixed(2)}</p>
                    <p className="text-[10px] text-slate-500">{pool.tokenY.symbol}: {Number(payload[0].payload.y).toFixed(2)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="y" 
            stroke="#6366f1" 
            fillOpacity={1} 
            fill="url(#colorY)" 
            strokeWidth={3}
            isAnimationActive={false}
          />
          <ReferenceDot 
            x={pool.reserveX} 
            y={pool.reserveY} 
            r={6} 
            fill="#4f46e5" 
            stroke="#fff" 
            strokeWidth={2} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
