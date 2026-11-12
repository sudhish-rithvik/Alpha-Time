import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  Newspaper,
  Compass,
  ListOrdered,
  History,
  Briefcase,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Stock Analysis', to: '/stocks/RELIANCE', icon: Activity },
    { label: 'News Intelligence', to: '/news', icon: Newspaper },
    { label: 'Entry Monitor', to: '/monitoring', icon: Compass },
    { label: 'Watchlist', to: '/watchlist', icon: ListOrdered },
    { label: 'Historical Analysis', to: '/backtest', icon: History },
    { label: 'Portfolio', to: '/portfolio', icon: Briefcase },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-56 border-r border-subtleBorder bg-background flex flex-col justify-between py-4 select-none shrink-0">
      <div className="flex flex-col gap-1 px-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-brand-muted px-3 py-1 font-semibold">
          Trading Terminal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#182132] text-accent-blue border border-[#287BFF]/30 shadow-[0_0_12px_rgba(40,123,255,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-[#141821]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Institutional Philosophy footer */}
      <div className="px-4 py-3 mx-3 rounded bg-[#141821] border border-subtleBorder flex flex-col gap-1">
        <div className="text-[10px] font-mono text-accent-blue uppercase tracking-wider font-semibold">
          Alpha Principle
        </div>
        <p className="text-[11px] text-zinc-400 italic leading-snug">
          "You choose the stock. AI helps you choose the moment."
        </p>
      </div>
    </aside>
  );
};
