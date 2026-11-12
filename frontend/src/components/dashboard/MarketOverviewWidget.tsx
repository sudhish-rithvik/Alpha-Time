import React from 'react';
import { MarketIndex } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketOverviewWidgetProps {
  indices: MarketIndex[];
}

export const MarketOverviewWidget: React.FC<MarketOverviewWidgetProps> = ({ indices }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {indices.map((idx) => {
        const isUp = idx.change >= 0;
        return (
          <div
            key={idx.symbol}
            className="bg-card border border-subtleBorder hover:border-[#323B4C] p-3.5 rounded-lg flex flex-col justify-between transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 font-mono tracking-wider">
                {idx.symbol}
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${
                  isUp ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-400'
                }`}
              >
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isUp ? '+' : ''}
                {idx.change_percent.toFixed(2)}%
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between font-mono">
              <span className="text-lg font-bold text-white tracking-tight">
                ₹{idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? '+' : ''}
                {idx.change.toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
