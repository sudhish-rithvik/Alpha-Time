import React from 'react';

interface ScoreBadgeProps {
  score: number;
  recommendation: 'BUY' | 'WAIT' | 'AVOID' | string;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  recommendation,
  size = 'md',
  showBar = false,
}) => {
  const getColors = () => {
    if (score >= 80 || recommendation === 'BUY') {
      return {
        bg: 'bg-emerald-950/40',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        badgeBg: 'bg-emerald-500',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      };
    }
    if (score >= 60 || recommendation === 'WAIT') {
      return {
        bg: 'bg-amber-950/40',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      };
    }
    return {
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      badgeBg: 'bg-rose-500',
      glow: 'shadow-[0_0_12px_rgba(239,68,68,0.25)]',
    };
  };

  const colors = getColors();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3.5 py-1.5 text-base',
  };

  return (
    <div className="flex flex-col gap-1 inline-flex">
      <div
        className={`inline-flex items-center gap-2 rounded border font-mono font-medium ${sizeClasses[size]} ${colors.bg} ${colors.border} ${colors.text} ${colors.glow}`}
      >
        <span className="font-bold tracking-wider">{recommendation}</span>
        <span className="opacity-40">|</span>
        <span className="font-semibold">{score}</span>
      </div>
      {showBar && (
        <div className="w-full bg-[#1F2633] h-1.5 rounded-full overflow-hidden mt-0.5">
          <div
            className={`h-full ${colors.badgeBg} transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      )}
    </div>
  );
};
