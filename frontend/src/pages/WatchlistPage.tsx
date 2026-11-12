import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistService } from '../services/api';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { Plus, Trash2, ArrowUpRight, ListOrdered } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WatchlistPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newSymbol, setNewSymbol] = useState('');

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: watchlistService.getWatchlist,
  });

  const addMutation = useMutation({
    mutationFn: (symbol: string) => watchlistService.addItem({ symbol }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      setNewSymbol('');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => watchlistService.removeItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] }),
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      addMutation.mutate(newSymbol.trim().toUpperCase());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-subtleBorder">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Institutional Watchlist</h1>
          <p className="text-xs text-brand-muted font-mono mt-0.5">
            Persisted in Database with Dynamic Confluence Scoring
          </p>
        </div>

        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="Add symbol (e.g. TCS)"
            className="bg-[#141821] border border-subtleBorder rounded-md px-3 py-1.5 text-xs text-white font-mono placeholder-brand-muted focus:outline-none focus:border-accent-blue"
          />
          <button
            type="submit"
            disabled={addMutation.isPending || !newSymbol.trim()}
            className="px-3 py-1.5 rounded-md bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold font-mono flex items-center gap-1 transition-all disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" /> Add Stock
          </button>
        </form>
      </div>

      {/* Watchlist Table */}
      <div className="bg-card border border-subtleBorder rounded-lg overflow-hidden">
        {watchlist?.items.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2 font-mono text-xs text-brand-muted">
            <ListOrdered className="w-8 h-8 opacity-40 mb-1" />
            Your watchlist is empty. Search or add a stock above to track its live AI Entry Score.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-subtleBorder bg-[#0F131C] text-[10px] uppercase font-mono text-brand-muted tracking-wider">
                  <th className="py-3 px-4">Symbol / Name</th>
                  <th className="py-3 px-4 text-right">Current Price</th>
                  <th className="py-3 px-4 text-right">Change %</th>
                  <th className="py-3 px-4 text-center">AI Entry Score</th>
                  <th className="py-3 px-4 text-center">Recommendation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtleBorder/60 text-xs">
                {watchlist?.items.map((item) => {
                  const isUp = (item.change_percent || 0) >= 0;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#1B212D] transition-colors group cursor-pointer"
                    >
                      <td
                        className="py-3 px-4"
                        onClick={() => navigate(`/stocks/${item.symbol}`)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm group-hover:text-accent-blue transition-colors">
                            {item.symbol}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-brand-muted group-hover:text-accent-blue transition-colors" />
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                          {item.name || `${item.symbol} Ltd`}
                        </div>
                      </td>

                      <td
                        className="py-3 px-4 text-right font-mono font-semibold text-white"
                        onClick={() => navigate(`/stocks/${item.symbol}`)}
                      >
                        {item.current_price ? `₹${item.current_price.toFixed(2)}` : 'N/A'}
                      </td>

                      <td
                        className="py-3 px-4 text-right font-mono font-medium"
                        onClick={() => navigate(`/stocks/${item.symbol}`)}
                      >
                        <span className={isUp ? 'text-emerald-400' : 'text-rose-400'}>
                          {isUp ? '+' : ''}
                          {item.change_percent ? `${item.change_percent.toFixed(2)}%` : '0.00%'}
                        </span>
                      </td>

                      <td
                        className="py-3 px-4 text-center"
                        onClick={() => navigate(`/stocks/${item.symbol}`)}
                      >
                        {item.entry_score !== undefined && item.entry_score !== null ? (
                          <span className="font-mono font-bold text-sm text-white">
                            {item.entry_score}/100
                          </span>
                        ) : (
                          '--'
                        )}
                      </td>

                      <td
                        className="py-3 px-4 text-center"
                        onClick={() => navigate(`/stocks/${item.symbol}`)}
                      >
                        {item.entry_score !== undefined && item.entry_score !== null ? (
                          <ScoreBadge
                            score={item.entry_score}
                            recommendation={item.recommendation || 'WAIT'}
                            size="sm"
                          />
                        ) : (
                          '--'
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMutation.mutate(item.id);
                          }}
                          className="p-1.5 rounded hover:bg-rose-950/40 text-brand-muted hover:text-rose-400 transition-colors"
                          title="Remove from watchlist"
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
    </div>
  );
};
