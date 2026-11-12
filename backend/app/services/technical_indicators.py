import numpy as np
import pandas as pd
from typing import Dict, Any, List

class TechnicalIndicatorEngine:
    @staticmethod
    def calculate_rsi(prices: pd.Series, period: int = 14) -> pd.Series:
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        
        rs = gain / (loss + 1e-9)
        rsi = 100 - (100 / (1 + rs))
        return rsi.fillna(50.0)

    @staticmethod
    def calculate_macd(prices: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> Dict[str, pd.Series]:
        ema_fast = prices.ewm(span=fast, adjust=False).mean()
        ema_slow = prices.ewm(span=slow, adjust=False).mean()
        macd_line = ema_fast - ema_slow
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        hist = macd_line - signal_line
        return {
            "macd": macd_line,
            "signal": signal_line,
            "hist": hist
        }

    @staticmethod
    def calculate_vwap(df: pd.DataFrame) -> pd.Series:
        # Typical price = (High + Low + Close) / 3
        typical_price = (df["High"] + df["Low"] + df["Close"]) / 3
        vwap = (typical_price * df["Volume"]).cumsum() / (df["Volume"].cumsum() + 1e-9)
        return vwap

    @staticmethod
    def calculate_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
        high = df["High"]
        low = df["Low"]
        close = df["Close"].shift(1)
        
        tr1 = high - low
        tr2 = (high - close).abs()
        tr3 = (low - close).abs()
        
        tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
        atr = tr.rolling(window=period).mean().fillna(tr)
        return atr

    @classmethod
    def enrich_dataframe(cls, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        if len(df) == 0:
            return df
            
        df["SMA_20"] = df["Close"].rolling(window=min(20, len(df))).mean().bfill()
        df["SMA_50"] = df["Close"].rolling(window=min(50, len(df))).mean().bfill()
        df["EMA_20"] = df["Close"].ewm(span=min(20, len(df)), adjust=False).mean()
        df["EMA_50"] = df["Close"].ewm(span=min(50, len(df)), adjust=False).mean()
        
        df["RSI_14"] = cls.calculate_rsi(df["Close"], period=min(14, len(df)))
        
        macd_dict = cls.calculate_macd(df["Close"])
        df["MACD"] = macd_dict["macd"]
        df["MACD_SIGNAL"] = macd_dict["signal"]
        df["MACD_HIST"] = macd_dict["hist"]
        
        df["VWAP"] = cls.calculate_vwap(df)
        df["ATR_14"] = cls.calculate_atr(df, period=min(14, len(df)))
        df["VOL_AVG_20"] = df["Volume"].rolling(window=min(20, len(df))).mean().bfill()
        
        return df
