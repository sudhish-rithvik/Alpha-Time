import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, Sliders, Shield, Key, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [techWeight, setTechWeight] = useState(30);
  const [sentimentWeight, setSentimentWeight] = useState(20);
  const [newsWeight, setNewsWeight] = useState(20);
  const [volumeWeight, setVolumeWeight] = useState(15);
  const [historicalWeight, setHistoricalWeight] = useState(15);
  const [saved, setSaved] = useState(false);

  const totalWeight = techWeight + sentimentWeight + newsWeight + volumeWeight + historicalWeight;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-subtleBorder">
        <h1 className="text-xl font-bold text-white tracking-tight">Terminal Settings & Weights</h1>
        <p className="text-xs text-brand-muted font-mono mt-0.5">
          Configure AI Entry Engine Weights, API Integration, and Account Preferences
        </p>
      </div>

      {/* Account Info */}
      <div className="p-5 rounded-lg bg-card border border-subtleBorder flex flex-col gap-3 font-sans">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-blue" /> User Profile & Security
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-brand-muted block text-[10px] uppercase">User Email</span>
            <span className="text-white font-semibold">{user?.email || 'quant@alphatime.trade'}</span>
          </div>
          <div>
            <span className="text-brand-muted block text-[10px] uppercase">Account Tier</span>
            <span className="text-emerald-400 font-semibold">Institutional Trading Terminal</span>
          </div>
        </div>
      </div>

      {/* Scoring Weight Configuration */}
      <div className="p-5 rounded-lg bg-card border border-subtleBorder flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-accent-blue" />
            <h3 className="text-sm font-semibold text-white">AI Entry Score Factor Weights</h3>
          </div>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              totalWeight === 100
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-950 text-rose-400 border border-rose-500/40'
            }`}
          >
            Total: {totalWeight}% {totalWeight !== 100 && '(Must equal 100%)'}
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Customize the relative weighting assigned to each pillar when AlphaTime generates its 0–100 AI Entry Score.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-zinc-300">Technical Indicators (RSI, Moving Averages, MACD)</span>
              <span className="text-white font-bold">{techWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={techWeight}
              onChange={(e) => setTechWeight(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-zinc-300">Market Trend & Benchmark Sentiment</span>
              <span className="text-white font-bold">{sentimentWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={sentimentWeight}
              onChange={(e) => setSentimentWeight(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-zinc-300">News Catalyst & Event Impact</span>
              <span className="text-white font-bold">{newsWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={newsWeight}
              onChange={(e) => setNewsWeight(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-zinc-300">Volume Surge & VWAP Proximity</span>
              <span className="text-white font-bold">{volumeWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              value={volumeWeight}
              onChange={(e) => setVolumeWeight(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-zinc-300">Historical Analog Pattern Analysis</span>
              <span className="text-white font-bold">{historicalWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              value={historicalWeight}
              onChange={(e) => setHistoricalWeight(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={totalWeight !== 100}
            className="px-4 py-2 rounded-md bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold font-mono flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(40,123,255,0.3)] disabled:opacity-50"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'Weights Saved' : 'Save Scoring Model Weights'}
          </button>
        </form>
      </div>

      {/* Backend LLM & Provider info */}
      <div className="p-5 rounded-lg bg-card border border-subtleBorder flex flex-col gap-3 font-mono text-xs">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-accent-blue" /> Institutional Feed Architecture
        </h3>
        <div className="space-y-2 text-zinc-400">
          <p>
            • Primary Exchange Feeds: <span className="text-white">NSE India / BSE India</span>
          </p>
          <p>
            • Development Provider: <span className="text-white">yfinance (with fallback to synthetic quantitative demo engine)</span>
          </p>
          <p>
            • Explainable AI Engine: <span className="text-white">Confluence Rule-Based Summarizer + OpenAI-compatible API</span>
          </p>
          <p>
            • Security: <span className="text-emerald-400">All external keys strictly isolated on Python FastAPI backend</span>
          </p>
        </div>
      </div>
    </div>
  );
};
