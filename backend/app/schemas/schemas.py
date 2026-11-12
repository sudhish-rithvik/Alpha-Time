from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Stock & Market Schemas
class StockSearchResult(BaseModel):
    symbol: str
    name: str
    exchange: str = "NSE"
    sector: Optional[str] = None
    current_price: float
    change_percent: float

class PricePoint(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: float
    vwap: Optional[float] = None

class StockDetailResponse(BaseModel):
    symbol: str
    name: str
    sector: Optional[str] = None
    exchange: str = "NSE"
    current_price: float
    change_percent: float
    high_52w: float
    low_52w: float
    volume: float
    avg_volume: float
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    vwap: float
    rsi_14: float
    macd: Dict[str, float] # {"macd": 0.0, "signal": 0.0, "hist": 0.0}
    sma_20: float
    sma_50: float
    ema_20: float
    ema_50: float
    atr_14: float
    data_provider: str
    is_demo: bool
    last_updated: str
    history: List[PricePoint]

# Intelligence Scoring Schemas
class EntryZone(BaseModel):
    lower: float
    upper: float

class ReasoningFactor(BaseModel):
    category: str # "Technical", "Sentiment", "News", "Volume", "Historical"
    signal: str # "BULLISH", "BEARISH", "NEUTRAL"
    impact: str # "HIGH", "MEDIUM", "LOW"
    description: str

class EntryScoreResponse(BaseModel):
    symbol: str
    entry_score: int # 0 to 100
    recommendation: str # "BUY", "WAIT", "AVOID"
    confidence: str # "HIGH", "MEDIUM", "LOW"
    current_price: float
    vwap: float
    preferred_entry_zone: EntryZone
    technical_score: int
    sentiment_score: int
    news_score: int
    volume_score: int
    historical_score: int
    reasoning: List[ReasoningFactor]
    risk_factors: List[str]
    ai_summary: str
    data_timestamp: str
    data_quality: str # "HIGH", "DELAYED", "DEMO"
    is_demo: bool

# News Schemas
class NewsItem(BaseModel):
    id: str
    title: str
    source: str
    published_at: datetime
    summary: Optional[str] = None
    sentiment: str
    sentiment_score: float
    category: str
    related_symbols: List[str]
    sector: Optional[str] = None

# Watchlist Schemas
class WatchlistCreate(BaseModel):
    name: str = "Default Watchlist"

class WatchlistItemAdd(BaseModel):
    symbol: str
    name: Optional[str] = None

class WatchlistItemResponse(BaseModel):
    id: str
    symbol: str
    name: Optional[str]
    current_price: Optional[float] = None
    change_percent: Optional[float] = None
    entry_score: Optional[int] = None
    recommendation: Optional[str] = None
    added_at: datetime

    class Config:
        from_attributes = True

class WatchlistResponse(BaseModel):
    id: str
    name: str
    items: List[WatchlistItemResponse]

# Monitoring Schemas
class MonitoringCreate(BaseModel):
    symbol: str
    investment_intent: float = 20000.0
    target_strategy: str = "VWAP-based zone"

class MonitoringAlertResponse(BaseModel):
    id: str
    title: str
    message: str
    level: str
    created_at: datetime

class MonitoringResponse(BaseModel):
    id: str
    symbol: str
    investment_intent: float
    target_strategy: str
    status: str
    lower_zone: Optional[float]
    upper_zone: Optional[float]
    current_price: Optional[float]
    last_score: Optional[float]
    created_at: datetime
    updated_at: datetime
    alerts: List[MonitoringAlertResponse] = []

    class Config:
        from_attributes = True

# Portfolio Schemas
class PortfolioHoldingCreate(BaseModel):
    symbol: str
    name: Optional[str] = None
    quantity: float
    average_price: float

class PortfolioHoldingResponse(BaseModel):
    id: str
    symbol: str
    name: Optional[str]
    quantity: float
    average_price: float
    current_price: float
    current_value: float
    invested_value: float
    unrealized_pnl: float
    pnl_percent: float

# Backtest Schemas
class BacktestRequest(BaseModel):
    symbol: str
    strategy: str = "AlphaTime Momentum & VWAP"
    period: str = "6M"

class BacktestResponse(BaseModel):
    symbol: str
    strategy: str
    period: str
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    avg_return: float
    max_drawdown: float
    profit_factor: float
    disclaimer: str
    equity_curve: List[Dict[str, Any]]
