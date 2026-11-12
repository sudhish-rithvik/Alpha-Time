import React from 'react';
import { EntryScoreData } from '../../types';
import { ScoreBadge } from '../common/ScoreBadge';
import { CheckCircle2, AlertTriangle, Info, ShieldCheck, Target, Layers } from 'lucide-react';

interface EntryScoreCardProps {
  scoreData: EntryScoreData;
}

export const EntryScoreCard: React.FC<EntryScoreCardProps> = ({ scoreData }) => {
  return (
    <div className="bg-card border border-subtleBorder rounded-lg p-5 flex flex-col gap-5">
      {/* Header with recommendation & scores */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-subtleBorder">
        <div className="flex items-center gap-3">
          <ScoreBadge
            score={scoreData.entry_score}
            recommendation={scoreData.recommendation}
            size="lg"
            showBar
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">AlphaTime AI Entry Score</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C2333] text-accent-blue border border-[#287BFF]/30">
                Confidence: {scoreData.confidence}
              </span>
            </div>
            <span className="text-xs text-brand-muted font-mono">
              Data Quality: {scoreData.data_quality} • {scoreData.data_timestamp}
            </span>
          </div>
        </div>

        {/* Preferred Entry Zone */}
        <div className="bg-[#0F131C] border border-subtleBorder/80 px-4 py-2.5 rounded-lg flex items-center gap-4 font-mono">
          <div className="flex items-center gap-2 text-accent-blue">
            <Target className="w-4 h-4" />
            <span className="text-xs uppercase font-medium">Optimal Entry Zone:</span>
          </div>
          <div className="text-emerald-400 font-bold text-sm tracking-wide">
            ₹{scoreData.preferred_entry_zone.lower.toFixed(2)} – ₹{scoreData.preferred_entry_zone.upper.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Five Pillars Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3 bg-[#0F131C] rounded border border-subtleBorder flex flex-col">
          <span className="text-[10px] uppercase font-mono text-brand-muted">Technical (30%)</span>
          <span className="text-base font-bold font-mono text-white mt-1">
            {scoreData.technical_score}/100
          </span>
          <div className="w-full bg-zinc-800 h-1 rounded mt-2 overflow-hidden">
            <div className="bg-accent-blue h-full" style={{ width: `${scoreData.technical_score}%` }} />
          </div>
        </div>

        <div className="p-3 bg-[#0F131C] rounded border border-subtleBorder flex flex-col">
          <span className="text-[10px] uppercase font-mono text-brand-muted">Sentiment (20%)</span>
          <span className="text-base font-bold font-mono text-white mt-1">
            {scoreData.sentiment_score}/100
          </span>
          <div className="w-full bg-zinc-800 h-1 rounded mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${scoreData.sentiment_score}%` }} />
          </div>
        </div>

        <div className="p-3 bg-[#0F131C] rounded border border-subtleBorder flex flex-col">
          <span className="text-[10px] uppercase font-mono text-brand-muted">News Catalyst (20%)</span>
          <span className="text-base font-bold font-mono text-white mt-1">
            {scoreData.news_score}/100
          </span>
          <div className="w-full bg-zinc-800 h-1 rounded mt-2 overflow-hidden">
            <div className="bg-indigo-400 h-full" style={{ width: `${scoreData.news_score}%` }} />
          </div>
        </div>

        <div className="p-3 bg-[#0F131C] rounded border border-subtleBorder flex flex-col">
          <span className="text-[10px] uppercase font-mono text-brand-muted">Volume & VWAP (15%)</span>
          <span className="text-base font-bold font-mono text-white mt-1">
            {scoreData.volume_score}/100
          </span>
          <div className="w-full bg-zinc-800 h-1 rounded mt-2 overflow-hidden">
            <div className="bg-amber-400 h-full" style={{ width: `${scoreData.volume_score}%` }} />
          </div>
        </div>

        <div className="p-3 bg-[#0F131C] rounded border border-subtleBorder flex flex-col col-span-2 md:col-span-1">
          <span className="text-[10px] uppercase font-mono text-brand-muted">Historical Sim (15%)</span>
          <span className="text-base font-bold font-mono text-white mt-1">
            {scoreData.historical_score}/100
          </span>
          <div className="w-full bg-zinc-800 h-1 rounded mt-2 overflow-hidden">
            <div className="bg-teal-400 h-full" style={{ width: `${scoreData.historical_score}%` }} />
          </div>
        </div>
      </div>

      {/* Explainable AI Executive Summary */}
      <div className="p-4 rounded-lg bg-[#111622] border border-[#287BFF]/30 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-blue" />
          <h4 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
            Explainable AI Reasoning Summary
          </h4>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          {scoreData.ai_summary}
        </p>
      </div>

      {/* Factor by factor Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Confluence Signals */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold font-mono text-zinc-300 uppercase tracking-wide">
            Detailed Decision Factors
          </span>
          <div className="space-y-2">
            {scoreData.reasoning.map((factor, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-[#0F131C] border border-subtleBorder text-xs flex items-start gap-2.5"
              >
                {factor.signal === 'BULLISH' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : factor.signal === 'BEARISH' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-semibold text-white text-[11px]">
                      [{factor.category}]
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1 rounded uppercase ${
                        factor.signal === 'BULLISH'
                          ? 'bg-emerald-950 text-emerald-400'
                          : factor.signal === 'BEARISH'
                          ? 'bg-rose-950 text-rose-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {factor.signal}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk & Limitations */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold font-mono text-zinc-300 uppercase tracking-wide">
            Key Risk Disclosures & Limitations
          </span>
          <div className="space-y-2">
            {scoreData.risk_factors.map((risk, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-rose-950/20 border border-rose-900/40 text-xs flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300 text-[11px] leading-relaxed">{risk}</p>
              </div>
            ))}
            <div className="p-2.5 rounded bg-[#0F131C] border border-subtleBorder text-[10px] text-brand-muted leading-relaxed font-mono">
              DISCLAIMER: AlphaTime generated recommendations are probabilistic quantitative indicators designed for entry timing assistance and do not constitute registered investment advice or guaranteed return forecasts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
