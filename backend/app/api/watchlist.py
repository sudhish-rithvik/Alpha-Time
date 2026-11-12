from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import User, Watchlist, WatchlistItem
from app.api.auth import get_current_user
from app.schemas.schemas import WatchlistResponse, WatchlistItemAdd, WatchlistItemResponse
from app.services.market_data import MarketDataProvider
from app.services.entry_scoring import EntryScoringEngine

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

@router.get("", response_model=WatchlistResponse)
def get_user_watchlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wl = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).first()
    if not wl:
        wl = Watchlist(user_id=current_user.id, name="My Alpha Watchlist")
        db.add(wl)
        db.commit()
        db.refresh(wl)
        
    # Enrich watchlist items with live/latest price and entry score
    enriched_items = []
    for item in wl.items:
        try:
            stock_data = MarketDataProvider.get_stock_data(item.symbol)
            score_data = EntryScoringEngine.evaluate_entry(stock_data)
            enriched_items.append({
                "id": item.id,
                "symbol": item.symbol,
                "name": stock_data.get("name") or item.name,
                "current_price": stock_data.get("current_price"),
                "change_percent": stock_data.get("change_percent"),
                "entry_score": score_data.get("entry_score"),
                "recommendation": score_data.get("recommendation"),
                "added_at": item.added_at
            })
        except Exception:
            enriched_items.append({
                "id": item.id,
                "symbol": item.symbol,
                "name": item.name,
                "current_price": None,
                "change_percent": None,
                "entry_score": None,
                "recommendation": None,
                "added_at": item.added_at
            })

    return {
        "id": wl.id,
        "name": wl.name,
        "items": enriched_items
    }

@router.post("/items", response_model=WatchlistItemResponse)
def add_watchlist_item(item_in: WatchlistItemAdd, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wl = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).first()
    if not wl:
        wl = Watchlist(user_id=current_user.id, name="My Alpha Watchlist")
        db.add(wl)
        db.commit()
        db.refresh(wl)
        
    clean_sym = item_in.symbol.strip().upper()
    existing = db.query(WatchlistItem).filter(WatchlistItem.watchlist_id == wl.id, WatchlistItem.symbol == clean_sym).first()
    if existing:
        raise HTTPException(status_code=400, detail="Stock already exists in your watchlist")
        
    stock_data = MarketDataProvider.get_stock_data(clean_sym)
    score_data = EntryScoringEngine.evaluate_entry(stock_data)

    new_item = WatchlistItem(
        watchlist_id=wl.id,
        symbol=clean_sym,
        name=stock_data.get("name") or item_in.name
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "id": new_item.id,
        "symbol": new_item.symbol,
        "name": new_item.name,
        "current_price": stock_data.get("current_price"),
        "change_percent": stock_data.get("change_percent"),
        "entry_score": score_data.get("entry_score"),
        "recommendation": score_data.get("recommendation"),
        "added_at": new_item.added_at
    }

@router.delete("/items/{item_id}")
def delete_watchlist_item(item_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wl = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).first()
    if not wl:
        raise HTTPException(status_code=404, detail="Watchlist not found")
        
    item = db.query(WatchlistItem).filter(WatchlistItem.id == item_id, WatchlistItem.watchlist_id == wl.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db.delete(item)
    db.commit()
    return {"status": "success", "message": "Item removed from watchlist"}
