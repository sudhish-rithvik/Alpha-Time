import math
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import pandas as pd
import yfinance as yf
from app.services.technical_indicators import TechnicalIndicatorEngine
from app.core.config import settings

POPULAR_INDIAN_STOCKS = [
    {"symbol": "RELIANCE", "name": "Reliance Industries Ltd", "sector": "Energy & Conglomerate", "base_price": 1415.50},
    {"symbol": "TCS", "name": "Tata Consultancy Services Ltd", "sector": "Information Technology", "base_price": 4120.00},
    {"symbol": "INFY", "name": "Infosys Ltd", "sector": "Information Technology", "base_price": 1890.25},
    {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd", "sector": "Banking & Financial Services", "base_price": 1720.80},
    {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd", "sector": "Banking & Financial Services", "base_price": 1265.40},
    {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd", "sector": "Automobile", "base_price": 965.10},
    {"symbol": "ITC", "name": "ITC Ltd", "sector": "FMCG", "base_price": 482.30},
    {"symbol": "SBIN", "name": "State Bank of India", "sector": "Banking & Financial Services", "base_price": 815.00},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd", "sector": "Telecommunications", "base_price": 1640.00},
    {"symbol": "LT", "name": "Larsen & Toubro Ltd", "sector": "Infrastructure & Capital Goods", "base_price": 3610.00},
    {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank", "sector": "Banking & Financial Services", "base_price": 1795.00},
    {"symbol": "WIPRO", "name": "Wipro Ltd", "sector": "Information Technology", "base_price": 540.20},
    {"symbol": "MARUTI", "name": "Maruti Suzuki India", "sector": "Automobile", "base_price": 11850.00},
    {"symbol": "BAJFINANCE", "name": "Bajaj Finance Ltd", "sector": "Financial Services", "base_price": 6920.00},
    {"symbol": "ADANIENT", "name": "Adani Enterprises Ltd", "sector": "Metals & Mining / Energy", "base_price": 2840.00}
]

class MarketDataProvider:
    @staticmethod
    def get_stock_universe() -> List[Dict[str, Any]]:
        return POPULAR_INDIAN_STOCKS

    @classmethod
    def search_stocks(cls, query: str) -> List[Dict[str, Any]]:
        q = query.strip().upper()
        results = []
        for stock in POPULAR_INDIAN_STOCKS:
            if q in stock["symbol"].upper() or q in stock["name"].upper() or q in stock["sector"].upper():
                # Random realistic intraday wiggle
                change = round(random.uniform(-2.2, 2.8), 2)
                price = round(stock["base_price"] * (1 + change / 100), 2)
                results.append({
                    "symbol": stock["symbol"],
                    "name": stock["name"],
                    "exchange": "NSE",
                    "sector": stock["sector"],
                    "current_price": price,
                    "change_percent": change
                })
        return results

    @classmethod
    def generate_synthetic_history(cls, symbol: str, days: int = 120, base_price: float = 1000.0) -> pd.DataFrame:
        random.seed(sum(ord(c) for c in symbol)) # Deterministic per symbol
        records = []
        price = base_price
        
        now = datetime.now()
        start_date = now - timedelta(days=days)
        
        current_date = start_date
        while current_date <= now:
            # Skip weekends
            if current_date.weekday() < 5:
                drift = 0.0004
                volatility = 0.016
                shock = random.gauss(drift, volatility)
                
                open_p = price * (1 + random.uniform(-0.005, 0.005))
                close_p = price * (1 + shock)
                high_p = max(open_p, close_p) * (1 + random.uniform(0.002, 0.012))
                low_p = min(open_p, close_p) * (1 - random.uniform(0.002, 0.012))
                volume = random.randint(300000, 2500000)
                
                records.append({
                    "Date": current_date.strftime("%Y-%m-%d"),
                    "Open": round(open_p, 2),
                    "High": round(high_p, 2),
                    "Low": round(low_p, 2),
                    "Close": round(close_p, 2),
                    "Volume": volume
                })
                price = close_p
            current_date += timedelta(days=1)
            
        df = pd.DataFrame(records)
        return df

    @classmethod
    def get_stock_data(cls, symbol: str, period: str = "6mo") -> Dict[str, Any]:
        clean_symbol = symbol.strip().upper().replace(".NS", "").replace(".BO", "")
        stock_meta = next((s for s in POPULAR_INDIAN_STOCKS if s["symbol"] == clean_symbol), None)
        name = stock_meta["name"] if stock_meta else f"{clean_symbol} Ltd"
        sector = stock_meta["sector"] if stock_meta else "Industrial"
        base_price = stock_meta["base_price"] if stock_meta else 1250.0

        is_demo = False
        data_provider = "Yahoo Finance (NSE)"
        df = None

        if settings.DATA_PROVIDER != "mock":
            try:
                ticker_symbol = f"{clean_symbol}.NS"
                ticker = yf.Ticker(ticker_symbol)
                hist = ticker.history(period=period)
                if not hist.empty and len(hist) > 10:
                    hist = hist.reset_index()
                    hist["Date"] = hist["Date"].dt.strftime("%Y-%m-%d")
                    df = hist[["Date", "Open", "High", "Low", "Close", "Volume"]]
                else:
                    is_demo = True
                    data_provider = "AlphaTime Demo Engine"
            except Exception:
                is_demo = True
                data_provider = "AlphaTime Demo Engine"
        else:
            is_demo = True
            data_provider = "AlphaTime Demo Engine"

        if df is None or is_demo or len(df) < 10:
            is_demo = True
            data_provider = "AlphaTime Demo Engine (Simulated)"
            df = cls.generate_synthetic_history(clean_symbol, days=180, base_price=base_price)

        enriched_df = TechnicalIndicatorEngine.enrich_dataframe(df)
        
        last_row = enriched_df.iloc[-1]
        prev_row = enriched_df.iloc[-2] if len(enriched_df) > 1 else last_row
        
        current_price = float(round(last_row["Close"], 2))
        prev_close = float(round(prev_row["Close"], 2))
        change_pct = float(round(((current_price - prev_close) / prev_close) * 100, 2)) if prev_close else 0.0
        
        high_52w = float(round(enriched_df["High"].max(), 2))
        low_52w = float(round(enriched_df["Low"].min(), 2))
        avg_vol = float(round(enriched_df["VOL_AVG_20"].iloc[-1], 0))
        
        # Prepare history list for candlestick / area chart
        history_list = []
        for _, row in enriched_df.iterrows():
            history_list.append({
                "time": str(row["Date"]),
                "open": float(round(row["Open"], 2)),
                "high": float(round(row["High"], 2)),
                "low": float(round(row["Low"], 2)),
                "close": float(round(row["Close"], 2)),
                "volume": float(row["Volume"]),
                "vwap": float(round(row["VWAP"], 2)) if "VWAP" in row else None
            })

        return {
            "symbol": clean_symbol,
            "name": name,
            "sector": sector,
            "exchange": "NSE",
            "current_price": current_price,
            "change_percent": change_pct,
            "high_52w": high_52w,
            "low_52w": low_52w,
            "volume": float(last_row["Volume"]),
            "avg_volume": avg_vol,
            "market_cap": round(current_price * 125000000, 2), # Sample Indian market cap
            "pe_ratio": round(random.uniform(18.0, 36.0), 1),
            "vwap": float(round(last_row["VWAP"], 2)),
            "rsi_14": float(round(last_row["RSI_14"], 2)),
            "macd": {
                "macd": float(round(last_row["MACD"], 2)),
                "signal": float(round(last_row["MACD_SIGNAL"], 2)),
                "hist": float(round(last_row["MACD_HIST"], 2))
            },
            "sma_20": float(round(last_row["SMA_20"], 2)),
            "sma_50": float(round(last_row["SMA_50"], 2)),
            "ema_20": float(round(last_row["EMA_20"], 2)),
            "ema_50": float(round(last_row["EMA_50"], 2)),
            "atr_14": float(round(last_row["ATR_14"], 2)),
            "data_provider": data_provider,
            "is_demo": is_demo,
            "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "history": history_list,
            "_raw_df": enriched_df
        }

    @classmethod
    def get_market_indices(cls) -> Dict[str, Any]:
        """Returns major Indian indices: NIFTY 50, SENSEX, NIFTY BANK"""
        return {
            "status": "OPEN",
            "indices": [
                {
                    "symbol": "NIFTY 50",
                    "price": 24345.60,
                    "change": 142.30,
                    "change_percent": 0.59,
                    "status": "UP"
                },
                {
                    "symbol": "BSE SENSEX",
                    "price": 79820.15,
                    "change": 418.50,
                    "change_percent": 0.53,
                    "status": "UP"
                },
                {
                    "symbol": "NIFTY BANK",
                    "price": 52110.80,
                    "change": -65.20,
                    "change_percent": -0.12,
                    "status": "DOWN"
                },
                {
                    "symbol": "INDIA VIX",
                    "price": 14.25,
                    "change": -0.45,
                    "change_percent": -3.06,
                    "status": "CALM"
                }
            ],
            "market_breadth": {
                "advances": 1380,
                "declines": 890,
                "unchanged": 78
            }
        }
