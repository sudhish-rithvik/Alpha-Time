import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketService, watchlistService, monitoringService, newsService } from '../services/api';
import { StockChart } from '../components/charts/StockChart';
import { EntryScoreCard } from '../components/analysis/EntryScoreCard';
import { ScoreBadge } from '../components/common/ScoreBadge';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Compass,
  Check,
  AlertCircle,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';

export const StockAnalysisPage: React.FC = () => {
  const { symbol = 'RELIANCE' } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState('6mo');
  const [watchlistSuccess, setWatchlistSuccess] = useState(false);
  const [monitoringSuccess, setMonitoringSuccess] = useState(false);

  // Fetch Stock Data
  const { data: stockData, isLoading: stockLoading } = useQuery({
    queryKey: ['stockDetail', symbol, selectedPeriod],
    queryFn: () => marketService.getStockDetail(symbol, selectedPeriod),
    refetchInterval: 30000,
  });

  // Fetch AI Entry Score
  const { data: entryScore, isLoading: scoreLoading } = useQuery({
    queryKey: ['entryScore', symbol],
    queryFn: () => marketService.getEntryScore(symbol),
    refetchInterval: 30000,
  });

  // Fetch related news
  const { data: stockNews = [] } = useQuery({
    queryKey: ['stockNews', symbol],
    queryFn: () => newsService.getNews(symbol, 4),
  });

  // Add to Watchlist Mutation
  const addWatchlistMutation = useMutation({
    mutationFn: () => watchlistService.addItem({ symbol, name: stockData?.name }),
    onSuccess: () => {
      setWatchlistSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      setTimeout(() => setWatchlistSuccess(false), 3000);
    },
  });

  // Start Monitoring Session Mutation
  const createMonitoringMutation = useMutation({
    mutationFn: () =>
      monitoringService.createSession({
        symbol,
        investment_intent: 25000,
        target_strategy: 'VWAP-based zone',
      }),
    onSuccess: () => {
      setMonitoringSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['monitoring'] });
      setTimeout(() => setMonitoringSuccess(false), 3000);
    },
  });

  if (stockLoading || !stockData) {
    return (
      <div className="h-96 flex flex-col items-center justify-center font-mono text-xs text-brand-muted gap-2">
        <span className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
        Retrieving financial feeds and computing technical indicators for {symbol}...
      </div>
    );
  }

  const isPositive = stockData.change_percent >= 0;

  return (
    <div className="space-y-6">
      {/* 1. Header with Symbol, Price, and Fast Action Buttons */}
      <div className="bg-card border border-subtleBorder rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              {stockData.symbol}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
              {stockData.exchange} • {stockData.sector}
            </span>
            {stockData.is_demo && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30">
                DEMO DATA SIMULATION
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">{stockData.name}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="text-right font-mono">
            <div className="text-2xl font-bold text-white">
              ₹{stockData.current_price.toFixed(2)}
            </div>
            <div
              className={`text-xs font-semibold flex items-center justify-end gap-1 ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPositive ? '+' : ''}
              {stockData.change_percent.toFixed(2)}%
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addWatchlistMutation.mutate()}
              disabled={watchlistSuccess}
              className="px-3 py-2 rounded-md bg-[#1B212D] hover:bg-[#252E3F] border border-subtleBorder text-xs text-zinc-300 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {watchlistSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
              {watchlistSuccess ? 'Added to Watchlist' : 'Add to Watchlist'}
            </button>

            <button
              onClick={() => createMonitoringMutation.mutate()}
              disabled={monitoringSuccess}
              className="px-3.5 py-2 rounded-md bg-accent-blue hover:bg-accent-blueHover text-xs text-white font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(40,123,255,0.3)] disabled:opacity-50"
            >
              {monitoringSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : <Compass className="w-3.5 h-3.5" />}
              {monitoringSuccess ? 'Monitoring Active' : 'Start Entry Monitor'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. AI ENTRY SCORE CARD (Primary Focus) */}
      {entryScore && <EntryScoreCard scoreData={entryScore} />}

      {/* 3. Interactive Chart & Key Financial Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-subtleBorder rounded-lg p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Historical Price & VWAP Confluence</span>
            </div>
            <div className="flex items-center gap-1 bg-[#0F131C] p-1 rounded border border-subtleBorder font-mono text-[10px]">
              {['1mo', '3mo', '6mo', '1y'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-2 py-0.5 rounded uppercase ${
                    selectedPeriod === p ? 'bg-accent-blue text-white font-bold' : 'text-brand-muted hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <StockChart
            data={stockData.history}
            symbol={stockData.symbol}
            vwap={stockData.vwap}
            entryZone={entryScore?.preferred_entry_zone}
          />
        </div>

        {/* Technical Indicators Summary Table */}
        <div className="bg-card border border-subtleBorder rounded-lg p-5 flex flex-col justify-between font-mono text-xs">
          <div>
            <h3 className="text-xs uppercase font-semibold text-brand-muted tracking-wider mb-4 pb-2 border-b border-subtleBorder">
              Quantitative Metrics & Indicators
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-1 border-b border-subtleBorder/50">
                <span className="text-zinc-400">Institutional VWAP:</span>
                <span className="text-amber-400 font-bold">₹{stockData.vwap.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-subtleBorder/50">
                <span className="text-zinc-400">RSI (14-Period):</span>
                <span
                  className={`font-bold ${
                    stockData.rsi_14 > 70
                      ? 'text-rose-400'
                      : stockData.rsi_14 < 35
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {stockData.rsi_14.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-subtleBorder/50">
                <span className="text-zinc-400">MACD Histogram:</span>
                <span className={stockData.macd.hist >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {stockData.macd.hist.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-subtleBorder/50">
                <span className="text-zinc-400">20-Day EMA:</span>
                <span className="text-white">₹{stockData.ema_20.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-subtleBorder/50">
                <span className="text-zinc-400">50-Day SMA:</span>
                <span className="text-white">₹{stockData.sma_50.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-subtleBorder/50">
                <span className="text-zinc-400">ATR (14 Volatility):</span>
                <span className="text-white">₹{stockData.atr_14.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-subtleBorder/50">
                <span className="text-zinc-400">52-Week Range:</span>
                <span className="text-zinc-300 text-[11px]">
                  ₹{stockData.low_52w.toFixed(0)} – ₹{stockData.high_52w.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-subtleBorder text-[10px] text-brand-muted">
            Feed Provider: {stockData.data_provider}
          </div>
        </div>
      </div>

      {/* 4. Relevant News Catalysts for this Stock */}
      <div className="bg-card border border-subtleBorder rounded-lg p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Breaking News & Event Catalysts ({stockData.symbol})
          </h3>
          <span className="text-xs font-mono text-brand-muted">Event Understanding Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stockNews.map((news) => (
            <div
              key={news.id}
              className="p-3.5 rounded bg-[#0F131C] border border-subtleBorder flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {news.source} • {news.category}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                      news.sentiment === 'POSITIVE'
                        ? 'bg-emerald-950 text-emerald-400'
                        : news.sentiment === 'NEGATIVE'
                        ? 'bg-rose-950 text-rose-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {news.sentiment}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white leading-snug">{news.title}</h4>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              <div className="text-[10px] text-brand-muted font-mono pt-2 border-t border-subtleBorder/50">
                Catalytic Impact: Favorable sector alignment for {stockData.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
