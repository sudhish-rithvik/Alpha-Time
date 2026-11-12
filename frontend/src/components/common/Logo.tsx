import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 28 }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-[#1E293B] to-[#0E131F] border border-[#287BFF]/40 shadow-[0_0_15px_rgba(40,123,255,0.25)]"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4/5 h-4/5"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle clock circle */}
          <circle cx="12" cy="12" r="9.5" stroke="#287BFF" strokeWidth="1.5" strokeOpacity="0.4" />
          {/* Stylized geometric 'A' & Clock hand */}
          <path
            d="M6.5 17.5L12 5.5L17.5 17.5"
            stroke="#287BFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crossbar as precision horizontal axis */}
          <path
            d="M8.5 13.5H15.5"
            stroke="#10B981"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Clock focal point */}
          <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-bold tracking-tight text-white font-sans text-base leading-none">
          Alpha<span className="text-accent-blue">Time</span>
        </span>
        <span className="text-[9px] uppercase tracking-widest text-brand-muted font-mono mt-0.5">
          Entry Intelligence
        </span>
      </div>
    </div>
  );
};
