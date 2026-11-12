import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import {
  Compass,
  TrendingUp,
  BrainCircuit,
  Newspaper,
  Shield,
  ArrowRight,
  Target,
  BarChart3,
  Clock,
  Layers,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();

  const handleDemoAccess = () => {
    demoLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-brand-text flex flex-col font-sans selection:bg-accent-blue selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-subtleBorder/80 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size={32} />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={handleDemoAccess}
            className="bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold px-4 py-2 rounded-md transition-all shadow-[0_0_15px_rgba(40,123,255,0.3)] flex items-center gap-1.5"
          >
            Explore Terminal <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141B2D] border border-[#287BFF]/40 text-accent-blue text-xs font-mono font-medium mb-6 shadow-[0_0_15px_rgba(40,123,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
          NEXT-GEN AI STOCK ENTRY ASSISTANT
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          The Right Stock. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-indigo-400 to-emerald-400">
            The Right Moment.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
          AlphaTime does not predict unpredictable stock targets. It calculates the optimal moment
          to enter high-conviction positions through quantitative VWAP alignment, news catalysts,
          and technical indicators.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleDemoAccess}
            className="w-full sm:w-auto px-7 py-3 rounded-lg bg-accent-blue hover:bg-accent-blueHover text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(40,123,255,0.4)] flex items-center justify-center gap-2"
          >
            Launch Interactive Dashboard <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-card hover:bg-[#1B212D] border border-subtleBorder text-zinc-300 font-semibold text-sm transition-all"
          >
            Create Institutional Account
          </button>
        </div>

        {/* Core Philosophy Banner */}
        <div className="mt-12 p-4 rounded-lg bg-[#0F131C] border border-subtleBorder max-w-xl text-center">
          <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            AlphaTime Core Philosophy
          </div>
          <p className="text-sm font-medium text-white italic mt-1">
            "You choose the stock. AI helps you choose the moment."
          </p>
        </div>
      </section>

      {/* Live Sample AI Entry Score Preview Card */}
      <section className="py-8 px-6 max-w-4xl mx-auto w-full">
        <div className="bg-card border border-subtleBorder rounded-xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-subtleBorder">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xl text-white">RELIANCE</span>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                  NSE: Energy & Conglomerate
                </span>
              </div>
              <div className="text-xs text-brand-muted font-mono mt-0.5">
                Current: ₹1,415.50 • VWAP: ₹1,410.20 (+0.37% extension)
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 font-mono font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                BUY | 84/100
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-brand-muted block uppercase">Preferred Zone</span>
                <span className="text-emerald-400 font-semibold text-xs">₹1,405 – ₹1,412</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
            <div className="p-2.5 bg-[#0F131C] rounded border border-subtleBorder font-mono text-xs">
              <span className="text-brand-muted block text-[10px]">Technical Score</span>
              <span className="text-white font-bold text-sm">85/100</span>
            </div>
            <div className="p-2.5 bg-[#0F131C] rounded border border-subtleBorder font-mono text-xs">
              <span className="text-brand-muted block text-[10px]">News Sentiment</span>
              <span className="text-white font-bold text-sm">82/100</span>
            </div>
            <div className="p-2.5 bg-[#0F131C] rounded border border-subtleBorder font-mono text-xs">
              <span className="text-brand-muted block text-[10px]">Volume & VWAP</span>
              <span className="text-white font-bold text-sm">80/100</span>
            </div>
            <div className="p-2.5 bg-[#0F131C] rounded border border-subtleBorder font-mono text-xs">
              <span className="text-brand-muted block text-[10px]">Historical Sim</span>
              <span className="text-white font-bold text-sm">86/100</span>
            </div>
          </div>

          <div className="p-3 bg-[#111622] rounded border border-[#287BFF]/30 text-xs text-zinc-300 leading-relaxed font-sans">
            <strong className="text-accent-blue font-mono">Explainable AI Verdict:</strong> Favorable technical confluence detected for RELIANCE. Current price ₹1,415.50 is anchored closely near institutional VWAP (₹1,410.20) with disciplined momentum indicators (RSI 48.6). Favorable ethanol procurement policy catalyst provides supportive sector tailwinds.
          </div>
        </div>
      </section>

      {/* How it Works / 3-Step Flow */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          How AlphaTime Intelligence Operates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-card border border-subtleBorder hover:border-[#323B4C] transition-all flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-accent-blue">
              <Newspaper className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">1. News & Event Intelligence</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Scans economic policies, quarterly results, and commodity shifts. Mappable directly to NSE/BSE listed tickers and supplier ecosystems.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-subtleBorder hover:border-[#323B4C] transition-all flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">2. Multi-Factor Entry Scoring</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Synthesizes VWAP proximity, RSI momentum, moving average alignments, ATR volatility, and historical analog patterns into a 0–100 score.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-subtleBorder hover:border-[#323B4C] transition-all flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">3. SmartEntry Advisory Monitor</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tracks your target entry zone in real-time. Signals immediately when price action and volume conditions confirm institutional entry.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="mt-auto border-t border-subtleBorder py-8 px-6 text-center text-xs text-brand-muted font-mono">
        <p className="max-w-3xl mx-auto leading-relaxed">
          AlphaTime is an educational and quantitative entry-timing research platform.
          It does not guarantee market returns or execute automated brokerage orders. Always conduct independent financial due diligence before investing.
        </p>
        <p className="mt-3 text-[11px] text-zinc-500">
          © {new Date().getFullYear()} AlphaTime Institutional Intelligence. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
