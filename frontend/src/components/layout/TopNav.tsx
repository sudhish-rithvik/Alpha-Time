import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Shield, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { marketService } from '../../services/api';
import { StockSearchResult } from '../../types';

export const TopNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 1) {
      setIsSearching(true);
      try {
        const results = await marketService.searchStocks(query);
        setSearchResults(results);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectStock = (symbol: string) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/stocks/${symbol}`);
  };

  return (
    <header className="h-14 border-b border-subtleBorder bg-background px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Market Status indicator */}
      <div className="flex items-center gap-6">
        <div onClick={() => navigate('/dashboard')} className="cursor-pointer">
          <Logo size={28} />
        </div>

        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#141821] border border-subtleBorder text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-300 font-medium">NSE/BSE</span>
          <span className="text-emerald-400 font-semibold">OPEN</span>
          <span className="text-brand-muted text-[11px]">Delayed 15m / Demo Active</span>
        </div>
      </div>

      {/* Instant Stock Search */}
      <div className="relative flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowDropdown(true)}
            placeholder="Search Indian stocks (e.g. RELIANCE, TCS, INFY)..."
            className="w-full bg-[#141821] border border-subtleBorder rounded-md pl-9 pr-4 py-1.5 text-xs text-white placeholder-brand-muted focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors font-sans"
          />
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-[#141821] border border-subtleBorder rounded-md shadow-2xl z-50 overflow-hidden divide-y divide-subtleBorder">
            {searchResults.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => handleSelectStock(stock.symbol)}
                className="px-3 py-2.5 flex items-center justify-between hover:bg-[#1B212D] cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs">{stock.symbol}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded">
                      {stock.exchange}
                    </span>
                  </div>
                  <div className="text-[11px] text-brand-muted truncate max-w-[220px]">
                    {stock.name} • {stock.sector}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-white font-semibold">₹{stock.current_price.toFixed(2)}</div>
                  <div
                    className={`text-[10px] ${
                      stock.change_percent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {stock.change_percent >= 0 ? '+' : ''}
                    {stock.change_percent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User profile & quick actions */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-[#141821] border border-transparent hover:border-subtleBorder transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent-blue to-indigo-700 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                {user?.full_name || 'Trader'}
              </span>
              <span className="text-[10px] text-brand-muted font-mono leading-tight">
                PRO Member
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-brand-muted" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-48 bg-[#141821] border border-subtleBorder rounded-md shadow-xl py-1 z-50">
              <div className="px-3 py-2 border-b border-subtleBorder text-xs text-brand-muted truncate">
                {user?.email || 'quant@alphatime.trade'}
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-[#1B212D]"
              >
                Settings & Weights
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-[#1B212D]"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
