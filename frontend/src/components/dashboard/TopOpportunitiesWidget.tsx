import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OpportunityItem } from '../../types';
import { ScoreBadge } from '../common/ScoreBadge';
import { ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

interface TopOpportunitiesWidgetProps {
  opportunities: OpportunityItem[];
}

export const TopOpportunitiesWidget: React.FC<TopOpportunitiesWidgetProps> = ({ opportunities }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-subtleBorder rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent-blue" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Prime AI Entry Opportunities
          </h3>
        </div>
        <span className="text-[11px] font-mono text-brand-muted">
          Dynamic VWAP & Momentum Screening
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {opportunities.slice(0, 6).map((opp) => (
          <div
            key={opp.symbol}
            onClick={() => navigate(`/stocks/${opp.symbol}`)}
            className="p-3 rounded-md bg-[#0F131C] border border-subtleBorder hover:border-accent-blue/50 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-white text-sm group-hover:text-accent-blue transition-colors">
                      {opp.symbol}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-brand-muted group-hover:text-accent-blue transition-colors" />
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate max-w-[150px]">
                    {opp.name}
                  </div>
                </div>
                <ScoreBadge score={opp.entry_score} recommendation={opp.recommendation} size="sm" />
              </div>

              <div className="mt-3 flex items-baseline justify-between font-mono text-xs">
                <div>
                  <span className="text-brand-muted text-[10px] block uppercase">Current</span>
                  <span className="font-semibold text-white">₹{opp.current_price.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-brand-muted text-[10px] block uppercase">Entry Zone</span>
                  <span className="text-emerald-400 font-medium">
                    ₹{opp.preferred_entry_zone.lower} – ₹{opp.preferred_entry_zone.upper}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-subtleBorder/60 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
              {opp.primary_reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
