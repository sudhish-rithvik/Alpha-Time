import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioService } from '../services/api';
import { Briefcase, Plus, Trash2, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [symbol, setSymbol] = useState('RELIANCE');
  const [quantity, setQuantity] = useState(15);
  const [avgPrice, setAvgPrice] = useState(1390);

  const { data: holdings = [], isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioService.getHoldings,
  });

  const addMutation = useMutation({
    mutationFn: () =>
      portfolioService.addHolding({
        symbol,
        quantity,
        average_price: avgPrice,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setShowAddModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => portfolioService.deleteHolding(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
  });

  // Calculate Aggregates
  const totalInvested = holdings.reduce((sum, h) => sum + h.invested_value, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.current_value, 0);
  const totalPnl = totalCurrent - totalInvested;
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-subtleBorder">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Manual Portfolio Tracker</h1>
          <p className="text-xs text-brand-muted font-mono mt-0.5">
            Advisory Position Tracking & Allocation Metrics (No Broker Connection Required)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-md bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold font-mono flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(40,123,255,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" /> Add Holding
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-card border border-subtleBorder font-mono">
          <span className="text-[10px] uppercase text-brand-muted block">Total Portfolio Value</span>
          <span className="text-2xl font-bold text-white mt-1 block">
            ₹{totalCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-card border border-subtleBorder font-mono">
          <span className="text-[10px] uppercase text-brand-muted block">Invested Capital</span>
          <span className="text-2xl font-bold text-zinc-300 mt-1 block">
            ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-card border border-subtleBorder font-mono">
          <span className="text-[10px] uppercase text-brand-muted block">Total Unrealized P&L</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-2xl font-bold ${
                totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span
              className={`text-xs font-semibold ${
                totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              ({totalPnlPct >= 0 ? '+' : ''}
              {totalPnlPct.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card border border-subtleBorder font-mono">
          <span className="text-[10px] uppercase text-brand-muted block">Holdings Count</span>
          <span className="text-2xl font-bold text-accent-blue mt-1 block">
            {holdings.length} Positions
          </span>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-card border border-subtleBorder rounded-lg overflow-hidden">
        {holdings.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2 font-mono text-xs text-brand-muted">
            <Briefcase className="w-8 h-8 opacity-40 mb-1" />
            No holdings recorded yet. Click 'Add Holding' above to record manually purchased stocks.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-subtleBorder bg-[#0F131C] text-[10px] uppercase font-mono text-brand-muted tracking-wider">
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4 text-right">Avg Buy Price</th>
                  <th className="py-3 px-4 text-right">Current Price</th>
                  <th className="py-3 px-4 text-right">Current Value</th>
                  <th className="py-3 px-4 text-right">Unrealized P&L</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtleBorder/60 text-xs">
                {holdings.map((h) => {
                  const isUp = h.unrealized_pnl >= 0;
                  return (
                    <tr key={h.id} className="hover:bg-[#1B212D] transition-colors">
                      <td
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => navigate(`/stocks/${h.symbol}`)}
                      >
                        <div className="font-mono font-bold text-white hover:text-accent-blue transition-colors">
                          {h.symbol}
                        </div>
                        <div className="text-[11px] text-zinc-400">{h.name}</div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-white">{h.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono text-zinc-300">
                        ₹{h.average_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-white font-semibold">
                        ₹{h.current_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-white font-bold">
                        ₹{h.current_value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        <span className={isUp ? 'text-emerald-400' : 'text-rose-400'}>
                          {isUp ? '+' : ''}₹{h.unrealized_pnl.toFixed(2)} ({isUp ? '+' : ''}
                          {h.pnl_percent.toFixed(2)}%)
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteMutation.mutate(h.id)}
                          className="p-1.5 rounded hover:bg-rose-950/40 text-brand-muted hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-card border border-subtleBorder rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Manual Portfolio Holding</h3>
            <p className="text-xs text-brand-muted mt-1 font-mono">
              Track your positions against live market price feeds
            </p>

            <div className="mt-4 space-y-4">
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
                <label className="block text-xs font-mono text-zinc-300 mb-1">QUANTITY</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-[#090B10] border border-subtleBorder rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  AVERAGE PURCHASE PRICE (₹)
                </label>
                <input
                  type="number"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="w-full bg-[#090B10] border border-subtleBorder rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addMutation.mutate()}
                  disabled={addMutation.isPending}
                  className="px-4 py-2 rounded bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold"
                >
                  {addMutation.isPending ? 'Saving...' : 'Add Position'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
