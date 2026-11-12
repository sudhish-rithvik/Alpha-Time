from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import User, PortfolioHolding
from app.api.auth import get_current_user
from app.schemas.schemas import PortfolioHoldingCreate, PortfolioHoldingResponse
from app.services.market_data import MarketDataProvider

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

@router.get("", response_model=List[PortfolioHoldingResponse])
def get_portfolio(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    holdings = db.query(PortfolioHolding).filter(PortfolioHolding.user_id == current_user.id).all()
    results = []
    
    for h in holdings:
        try:
            stock_data = MarketDataProvider.get_stock_data(h.symbol)
            cur_price = stock_data["current_price"]
        except Exception:
            cur_price = h.average_price
            
        cur_value = round(cur_price * h.quantity, 2)
        inv_value = round(h.average_price * h.quantity, 2)
        unrealized_pnl = round(cur_value - inv_value, 2)
        pnl_pct = round((unrealized_pnl / (inv_value + 1e-9)) * 100, 2)
        
        results.append({
            "id": h.id,
            "symbol": h.symbol,
            "name": h.name or h.symbol,
            "quantity": h.quantity,
            "average_price": h.average_price,
            "current_price": cur_price,
            "current_value": cur_value,
            "invested_value": inv_value,
            "unrealized_pnl": unrealized_pnl,
            "pnl_percent": pnl_pct
        })
        
    return results

@router.post("", response_model=PortfolioHoldingResponse)
def add_portfolio_holding(holding_in: PortfolioHoldingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    clean_sym = holding_in.symbol.strip().upper()
    stock_data = MarketDataProvider.get_stock_data(clean_sym)
    
    new_holding = PortfolioHolding(
        user_id=current_user.id,
        symbol=clean_sym,
        name=stock_data.get("name") or holding_in.name,
        quantity=holding_in.quantity,
        average_price=holding_in.average_price
    )
    db.add(new_holding)
    db.commit()
    db.refresh(new_holding)
    
    cur_price = stock_data["current_price"]
    cur_value = round(cur_price * new_holding.quantity, 2)
    inv_value = round(new_holding.average_price * new_holding.quantity, 2)
    unrealized_pnl = round(cur_value - inv_value, 2)
    pnl_pct = round((unrealized_pnl / (inv_value + 1e-9)) * 100, 2)
    
    return {
        "id": new_holding.id,
        "symbol": new_holding.symbol,
        "name": new_holding.name,
        "quantity": new_holding.quantity,
        "average_price": new_holding.average_price,
        "current_price": cur_price,
        "current_value": cur_value,
        "invested_value": inv_value,
        "unrealized_pnl": unrealized_pnl,
        "pnl_percent": pnl_pct
    }

@router.delete("/{holding_id}")
def delete_holding(holding_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    holding = db.query(PortfolioHolding).filter(PortfolioHolding.id == holding_id, PortfolioHolding.user_id == current_user.id).first()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
        
    db.delete(holding)
    db.commit()
    return {"status": "success", "message": "Holding deleted"}
