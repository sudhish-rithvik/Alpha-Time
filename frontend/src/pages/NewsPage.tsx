import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '../services/api';
import { Newspaper, Filter, ArrowUpRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const { data: newsItems = [], isLoading } = useQuery({
    queryKey: ['newsFull'],
    queryFn: () => newsService.getNews(undefined, 30),
    refetchInterval: 60000,
  });

  const categories = [
    'ALL',
    'Government policies',
    'Quarterly earnings',
    'Interest rate changes',
    'Commodity price movements',
    'Regulatory announcements',
  ];

  const filteredNews = newsItems.filter((item) => {
    const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchSearch =
      !searchFilter ||
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.related_symbols.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-subtleBorder">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Financial News Intelligence</h1>
          <p className="text-xs text-brand-muted font-mono mt-0.5">
            Event Understanding & Quantitative Sector-to-Stock Catalyst Mapping
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter news or tickers..."
            className="bg-[#141821] border border-subtleBorder rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-brand-muted focus:outline-none focus:border-accent-blue"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-accent-blue text-white font-semibold'
                : 'bg-card text-brand-muted border border-subtleBorder hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="bg-card border border-subtleBorder hover:border-[#323B4C] rounded-lg p-4 flex flex-col justify-between gap-3 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {news.source}
                  </span>
                  <span className="text-[10px] font-mono text-brand-muted">
                    {news.category}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    news.sentiment === 'POSITIVE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : news.sentiment === 'NEGATIVE'
                      ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {news.sentiment} ({(news.sentiment_score * 100).toFixed(0)}%)
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white leading-snug hover:text-accent-blue transition-colors cursor-pointer">
                {news.title}
              </h3>

              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {news.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-subtleBorder/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-brand-muted">Related Tickers:</span>
                {news.related_symbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => navigate(`/stocks/${sym}`)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131B2A] text-accent-blue border border-[#287BFF]/30 hover:bg-accent-blue hover:text-white transition-colors flex items-center gap-1"
                  >
                    {sym} <ArrowUpRight className="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>

              <span className="text-[10px] font-mono text-brand-muted">
                {new Date(news.published_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
