import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PricePoint } from '../../types';

interface StockChartProps {
  data: PricePoint[];
  symbol: string;
  vwap?: number;
  entryZone?: { lower: number; upper: number };
}

export const StockChart: React.FC<StockChartProps> = ({ data, symbol, vwap, entryZone }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-brand-muted font-mono">
        Loading historical chart data...
      </div>
    );
  }

  const prices = data.map((d) => d.close);
  const minPrice = Math.min(...prices) * 0.985;
  const maxPrice = Math.max(...prices) * 1.015;

  return (
    <div className="w-full h-80 flex flex-col">
      <div className="flex items-center justify-between pb-2 text-[11px] font-mono text-brand-muted">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-accent-blue inline-block" /> Price (Close)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> VWAP
          </span>
          {entryZone && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2 bg-emerald-500/20 border border-emerald-500/40 inline-block" />{' '}
              Target Zone: ₹{entryZone.lower} – ₹{entryZone.upper}
            </span>
          )}
        </div>
        <span>1D Interval • Institutional Confluence</span>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#287BFF" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#287BFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2633" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              orientation="right"
              tickFormatter={(v) => `₹${v.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141821',
                borderColor: '#242B38',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#FFFFFF',
              }}
              formatter={(value: any, name: any) => [
                `₹${Number(value).toFixed(2)}`,
                name === 'close' ? 'Price' : name.toUpperCase(),
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#287BFF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
            <Line
              type="monotone"
              dataKey="vwap"
              stroke="#F59E0B"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
