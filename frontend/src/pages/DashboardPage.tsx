import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { marketService, newsService } from '../services/api';
import { MarketOverviewWidget } from '../components/dashboard/MarketOverviewWidget';
import { TopOpportunitiesWidget } from '../components/dashboard/TopOpportunitiesWidget';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { Newspaper, TrendingUp, Compass, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Queries
  const { data: marketData } = useQuery({
    queryKey: ['marketOverview'],
    queryFn: marketService.getOverview,
    refetchInterval: 30000,
  });

  const { data: opportunities = [] } = useQuery({
    queryKey: ['topOpportunities'],
    queryFn: marketService.getTopOpportunities,
    refetchInterval: 45000,
  });

  const { data: newsItems = [] } = useQuery({
    queryKey: ['latestNews'],
    queryFn: () => newsService.getNews(undefined, 5),
    refetchInterval: 60000,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-subtleBorder">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Institutional Market Overview</h1>
          <p className="text-xs text-brand-muted font-mono mt-0.5">
            NSE/BSE Real-Time Entry Intelligence & Volatility Metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/stocks/RELIANCE')}
            className="px-3 py-1.5 rounded-md bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold font-mono flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(40,123,255,0.25)]"
          >
            Inspect RELIANCE <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. Market Indices Snapshot */}
      {marketData?.indices && <MarketOverviewWidget indices={marketData.indices} />}

      {/* 2. Top AI Entry Opportunities Widget */}
      <TopOpportunitiesWidget opportunities={opportunities} />

      {/* 3. Bottom Row: News Intelligence & Market Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Market Catalyst News */}
        <div className="lg:col-span-2 bg-card border border-subtleBorder rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-accent-blue" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Latest Financial Catalyst News
              </h3>
            </div>
            <button
              onClick={() => navigate('/news')}
              className="text-xs text-accent-blue hover:underline font-mono"
            >
              View All News →
            </button>
          </div>

          <div className="divide-y divide-subtleBorder/70">
            {newsItems.map((item) => (
              <div key={item.id} className="py-3 flex flex-col gap-1.5 first:pt-1 last:pb-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {item.source}
                    </span>
                    <span className="text-[10px] font-mono text-brand-muted">
                      {item.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded uppercase ${
                      item.sentiment === 'POSITIVE'
                        ? 'bg-emerald-950/80 text-emerald-400'
                        : item.sentiment === 'NEGATIVE'
                        ? 'bg-rose-950/80 text-rose-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-white hover:text-accent-blue cursor-pointer transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono text-brand-muted">Impacted Tickers:</span>
                  {item.related_symbols.map((sym) => (
                    <span
                      key={sym}
                      onClick={() => navigate(`/stocks/${sym}`)}
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1A2232] text-accent-blue cursor-pointer hover:underline"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Sentiment & Discipline Card */}
        <div className="bg-card border border-subtleBorder rounded-lg p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Market Sentiment State
              </h3>
            </div>

            <div className="p-3 bg-[#0F131C] rounded border border-subtleBorder font-mono text-xs flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Broad Sentiment:</span>
                <span className="text-emerald-400 font-bold">MODERATELY BULLISH</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">India VIX:</span>
                <span className="text-white font-bold">14.25 (Subdued Risk)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">FII / DII Flow:</span>
                <span className="text-emerald-400 font-bold">+₹1,840 Cr Net Inflow</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded bg-[#111622] border border-[#287BFF]/30 text-xs text-zinc-300 leading-relaxed font-sans">
              <strong className="text-accent-blue block font-mono text-[11px] mb-1">
                EXECUTION GUIDELINE:
              </strong>
              Market breadth favors quality large-cap accumulation. Avoid chasing gap-ups beyond +2%
              above intraday VWAP.
            </div>
          </div>

          <div className="p-3 bg-[#0F131C] rounded border border-subtleBorder text-center">
            <span className="text-[10px] uppercase font-mono text-brand-muted block">
              Active Strategy
            </span>
            <span className="text-xs font-mono font-semibold text-white mt-0.5 block">
              VWAP Mean-Reversion & Catalytic Momentum
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
