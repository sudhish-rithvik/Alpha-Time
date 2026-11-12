export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface MarketIndex {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  status: 'UP' | 'DOWN' | 'CALM';
}

export interface MarketOverviewData {
  status: string;
  indices: MarketIndex[];
  market_breadth: {
    advances: number;
    declines: number;
    unchanged: number;
  };
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  sector?: string;
  current_price: number;
  change_percent: number;
}

export interface PricePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
}

export interface StockDetail {
  symbol: string;
  name: string;
  sector?: string;
  exchange: string;
  current_price: number;
  change_percent: number;
  high_52w: number;
  low_52w: number;
  volume: number;
  avg_volume: number;
  market_cap?: number;
  pe_ratio?: number;
  vwap: number;
  rsi_14: number;
  macd: {
    macd: number;
    signal: number;
    hist: number;
  };
  sma_20: number;
  sma_50: number;
  ema_20: number;
  ema_50: number;
  atr_14: number;
  data_provider: string;
  is_demo: boolean;
  last_updated: string;
  history: PricePoint[];
}

export interface ReasoningFactor {
  category: 'Technical' | 'Sentiment' | 'News' | 'Volume' | 'Historical';
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface EntryScoreData {
  symbol: string;
  entry_score: number;
  recommendation: 'BUY' | 'WAIT' | 'AVOID';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  current_price: number;
  vwap: number;
  preferred_entry_zone: {
    lower: number;
    upper: number;
  };
  technical_score: number;
  sentiment_score: number;
  news_score: number;
  volume_score: number;
  historical_score: number;
  reasoning: ReasoningFactor[];
  risk_factors: string[];
  ai_summary: string;
  data_timestamp: string;
  data_quality: string;
  is_demo: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  published_at: string;
  summary?: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  sentiment_score: number;
  category: string;
  related_symbols: string[];
  sector?: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name?: string;
  current_price?: number;
  change_percent?: number;
  entry_score?: number;
  recommendation?: string;
  added_at: string;
}

export interface WatchlistData {
  id: string;
  name: string;
  items: WatchlistItem[];
}

export interface MonitoringAlert {
  id: string;
  title: string;
  message: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING';
  created_at: string;
}

export interface MonitoringSession {
  id: string;
  symbol: string;
  investment_intent: number;
  target_strategy: string;
  status: 'Evaluating' | 'Monitoring' | 'Entry conditions met' | 'Expired' | 'Paused';
  lower_zone?: number;
  upper_zone?: number;
  current_price?: number;
  last_score?: number;
  created_at: string;
  updated_at: string;
  alerts: MonitoringAlert[];
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name?: string;
  quantity: number;
  average_price: number;
  current_price: number;
  current_value: number;
  invested_value: number;
  unrealized_pnl: number;
  pnl_percent: number;
}

export interface OpportunityItem {
  symbol: string;
  name: string;
  sector?: string;
  current_price: number;
  vwap: number;
  entry_score: number;
  recommendation: 'BUY' | 'WAIT' | 'AVOID';
  confidence: string;
  preferred_entry_zone: {
    lower: number;
    upper: number;
  };
  primary_reason: string;
}

export interface BacktestResult {
  symbol: string;
  strategy: string;
  period: string;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  avg_return: number;
  max_drawdown: number;
  profit_factor: number;
  disclaimer: string;
  equity_curve: { date: string; equity: number }[];
}
