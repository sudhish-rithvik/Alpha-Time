import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    watchlists = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    monitoring_sessions = relationship("MonitoringSession", back_populates="user", cascade="all, delete-orphan")
    portfolio_holdings = relationship("PortfolioHolding", back_populates="user", cascade="all, delete-orphan")

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    symbol = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    sector = Column(String(100), nullable=True)
    exchange = Column(String(20), default="NSE")
    current_price = Column(Float, nullable=True)
    change_percent = Column(Float, nullable=True)
    volume = Column(Float, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow)

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), default="Default Watchlist")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watchlists")
    items = relationship("WatchlistItem", back_populates="watchlist", cascade="all, delete-orphan")

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    watchlist_id = Column(String(36), ForeignKey("watchlists.id"), nullable=False)
    symbol = Column(String(50), index=True, nullable=False)
    name = Column(String(255), nullable=True)
    added_at = Column(DateTime, default=datetime.utcnow)

    watchlist = relationship("Watchlist", back_populates="items")

class MonitoringSession(Base):
    __tablename__ = "monitoring_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    symbol = Column(String(50), nullable=False, index=True)
    investment_intent = Column(Float, default=20000.0) # INR amount
    target_strategy = Column(String(50), default="VWAP-based zone")
    status = Column(String(50), default="Monitoring") # Evaluating, Monitoring, Entry conditions met, Expired, Paused
    lower_zone = Column(Float, nullable=True)
    upper_zone = Column(Float, nullable=True)
    current_price = Column(Float, nullable=True)
    last_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="monitoring_sessions")
    alerts = relationship("MonitoringAlert", back_populates="session", cascade="all, delete-orphan")

class MonitoringAlert(Base):
    __tablename__ = "monitoring_alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("monitoring_sessions.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    level = Column(String(20), default="INFO") # INFO, SUCCESS, WARNING
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("MonitoringSession", back_populates="alerts")

class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    symbol = Column(String(50), nullable=False)
    name = Column(String(255), nullable=True)
    quantity = Column(Float, nullable=False)
    average_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="portfolio_holdings")

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(500), nullable=False)
    source = Column(String(100), nullable=False)
    published_at = Column(DateTime, default=datetime.utcnow)
    summary = Column(Text, nullable=True)
    sentiment = Column(String(20), default="NEUTRAL") # POSITIVE, NEGATIVE, NEUTRAL
    sentiment_score = Column(Float, default=0.0) # -1.0 to 1.0
    category = Column(String(100), default="General") # Government policies, Quarterly earnings, M&A, etc.
    related_symbols = Column(JSON, default=list) # e.g. ["RELIANCE", "TCS"]
    sector = Column(String(100), nullable=True)

class BacktestRun(Base):
    __tablename__ = "backtest_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    symbol = Column(String(50), nullable=False)
    strategy = Column(String(100), nullable=False)
    period = Column(String(20), default="6M")
    total_trades = Column(Integer, default=0)
    win_rate = Column(Float, default=0.0)
    avg_return = Column(Float, default=0.0)
    max_drawdown = Column(Float, default=0.0)
    profit_factor = Column(Float, default=0.0)
    metrics = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
