import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { marketService } from '../services/api';
import { BacktestResult } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { History, Play, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const BacktestPage: React.FC = () => {
  const [symbol, setSymbol] = useState('RELIANCE');
  const [strategy, setStrategy] = useState('AlphaTime Momentum & VWAP');
  const [period, setPeriod] = useState('6M');

  const backtestMutation = useMutation({
    mutationFn: () => marketService.runBacktest({ symbol, strategy, period }),
  });

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    backtestMutation.mutate();
  };

  const result = backtestMutation.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-subtleBorder">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Historical Analysis & Backtesting
          </h1>
          <p className="text-xs text-brand-muted font-mono mt-0.5">
            Statistical Validation of Entry Timing Without Look-Ahead Bias
          </p>
        </div>
      </div>

      {/* Control Panel Form */}
      <div className="bg-card border border-subtleBorder rounded-lg p-5">
        <form onSubmit={handleRun} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">STOCK SYMBOL</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full bg-[#090B10] border border-subtleBorder rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-accent-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">STRATEGY MODEL</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-[#090B10] border border-subtleBorder rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-accent-blue"
            >
              <option value="AlphaTime Momentum & VWAP">AlphaTime Momentum & VWAP</option>
              <option value="RSI Mean Reversion with ATR Bands">RSI Mean Reversion with ATR Bands</option>
              <option value="Catalytic Breakout on Volume">Catalytic Breakout on Volume</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">HISTORICAL WINDOW</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-[#090B10] border border-subtleBorder rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-accent-blue"
            >
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
              <option value="1Y">1 Year</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={backtestMutation.isPending}
            className="w-full py-2 rounded-md bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(40,123,255,0.3)] disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            {backtestMutation.isPending ? 'Simulating...' : 'Run Simulation'}
          </button>
        </form>
      </div>

      {/* Results Display */}
      {result ? (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 bg-card border border-subtleBorder rounded-lg font-mono">
              <span className="text-[10px] uppercase text-brand-muted block">Win Rate</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">
                {result.win_rate}%
              </span>
              <span className="text-[10px] text-zinc-400">
                {result.winning_trades}W / {result.losing_trades}L
              </span>
            </div>

            <div className="p-3 bg-card border border-subtleBorder rounded-lg font-mono">
              <span className="text-[10px] uppercase text-brand-muted block">Avg Trade Return</span>
              <span className="text-xl font-bold text-white mt-1 block">
                +{result.avg_return}%
              </span>
              <span className="text-[10px] text-zinc-400">per 5-day window</span>
            </div>

            <div className="p-3 bg-card border border-subtleBorder rounded-lg font-mono">
              <span className="text-[10px] uppercase text-brand-muted block">Max Drawdown</span>
              <span className="text-xl font-bold text-rose-400 mt-1 block">
                -{result.max_drawdown}%
              </span>
              <span className="text-[10px] text-zinc-400">controlled drawdown</span>
            </div>

            <div className="p-3 bg-card border border-subtleBorder rounded-lg font-mono">
              <span className="text-[10px] uppercase text-brand-muted block">Profit Factor</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {result.profit_factor}
              </span>
              <span className="text-[10px] text-zinc-400">Gross Gain / Loss</span>
            </div>

            <div className="p-3 bg-card border border-subtleBorder rounded-lg font-mono col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase text-brand-muted block">Total Observations</span>
              <span className="text-xl font-bold text-accent-blue mt-1 block">
                {result.total_trades}
              </span>
              <span className="text-[10px] text-zinc-400">Verified triggers</span>
            </div>
          </div>

          {/* Equity Curve Chart */}
          {result.equity_curve && result.equity_curve.length > 0 && (
            <div className="bg-card border border-subtleBorder rounded-lg p-5">
              <div className="flex items-center justify-between pb-3">
                <span className="text-sm font-semibold text-white">Simulated Capital Growth Curve</span>
                <span className="text-xs font-mono text-brand-muted">Starting: ₹1,00,000 INR</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.equity_curve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2633" vertical={false} />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickLine={false} />
                    <YAxis
                      domain={['auto', 'auto']}
                      stroke="#6B7280"
                      fontSize={10}
                      tickLine={false}
                      orientation="right"
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#141821',
                        borderColor: '#242B38',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#FFFFFF',
                      }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Capital']}
                    />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Disclaimers & Bias warnings */}
          <div className="p-4 rounded-lg bg-[#0F131C] border border-subtleBorder text-xs text-zinc-400 font-mono flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-400 block mb-0.5">HISTORICAL SIMULATION DISCLAIMER:</strong>
              {result.disclaimer} Survivorship bias, execution slippage, exchange transaction fees, and sudden liquidity shortages can cause live results to diverge from historical models.
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-card border border-subtleBorder rounded-lg font-mono text-xs text-brand-muted flex flex-col items-center justify-center gap-2">
          <History className="w-8 h-8 opacity-40 mb-1" />
          Select a stock ticker and click 'Run Simulation' to execute historical entry timing backtesting.
        </div>
      )}
    </div>
  );
};
