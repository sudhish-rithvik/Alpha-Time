from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any, Optional
from app.services.market_data import MarketDataProvider
from app.services.entry_scoring import EntryScoringEngine
from app.services.historical_analysis import BacktestingEngine
from app.schemas.schemas import (
    StockSearchResult,
    StockDetailResponse,
    EntryScoreResponse,
    BacktestRequest,
    BacktestResponse
)

router = APIRouter(tags=["Stocks & Market Intelligence"])

@router.get("/market/overview")
def get_market_overview():
    return MarketDataProvider.get_market_indices()

@router.get("/stocks/search", response_model=List[StockSearchResult])
def search_stocks(q: str = Query(..., min_length=1)):
    return MarketDataProvider.search_stocks(q)

@router.get("/stocks/universe", response_model=List[Dict[str, Any]])
def get_stock_universe():
    return MarketDataProvider.get_stock_universe()

@router.get("/stocks/{symbol}", response_model=StockDetailResponse)
def get_stock_detail(symbol: str, period: str = "6mo"):
    data = MarketDataProvider.get_stock_data(symbol, period=period)
    # Remove raw dataframe from final response model
    if "_raw_df" in data:
        del data["_raw_df"]
    return data

@router.get("/analysis/entry-score/{symbol}", response_model=EntryScoreResponse)
def get_entry_score(symbol: str):
    stock_data = MarketDataProvider.get_stock_data(symbol)
    score_result = EntryScoringEngine.evaluate_entry(stock_data)
    return score_result

@router.get("/analysis/opportunities")
def get_top_opportunities():
    """Returns curated opportunities with entry score calculations"""
    symbols = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "TATAMOTORS", "ITC"]
    opportunities = []
    
    for sym in symbols:
        try:
            data = MarketDataProvider.get_stock_data(sym)
            res = EntryScoringEngine.evaluate_entry(data)
            opportunities.append({
                "symbol": sym,
                "name": data["name"],
                "sector": data["sector"],
                "current_price": res["current_price"],
                "vwap": res["vwap"],
                "entry_score": res["entry_score"],
                "recommendation": res["recommendation"],
                "confidence": res["confidence"],
                "preferred_entry_zone": res["preferred_entry_zone"],
                "primary_reason": res["reasoning"][0]["description"] if res["reasoning"] else "Solid risk-reward parameters."
            })
        except Exception:
            continue
            
    # Sort by entry score descending
    opportunities.sort(key=lambda x: x["entry_score"], reverse=True)
    return opportunities

@router.post("/analysis/backtest", response_model=BacktestResponse)
def run_backtest(req: BacktestRequest):
    stock_data = MarketDataProvider.get_stock_data(req.symbol)
    df = stock_data.get("_raw_df")
    result = BacktestingEngine.run_strategy_backtest(df, req.symbol, req.strategy)
    return result
