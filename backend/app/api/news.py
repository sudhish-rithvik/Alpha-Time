from fastapi import APIRouter, Query
from typing import List, Optional
from app.services.news_intelligence import NewsIntelligenceService
from app.schemas.schemas import NewsItem

router = APIRouter(prefix="/news", tags=["News Intelligence"])

@router.get("", response_model=List[NewsItem])
def get_news(symbol: Optional[str] = None, limit: int = Query(20, le=50)):
    return NewsIntelligenceService.get_latest_news(limit=limit, symbol=symbol)

@router.get("/sentiment/{symbol}")
def get_symbol_news_sentiment(symbol: str):
    return NewsIntelligenceService.analyze_news_sentiment_for_stock(symbol)
