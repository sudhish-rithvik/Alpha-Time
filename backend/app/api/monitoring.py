from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import User, MonitoringSession, MonitoringAlert
from app.api.auth import get_current_user
from app.schemas.schemas import MonitoringCreate, MonitoringResponse, MonitoringAlertResponse
from app.services.market_data import MarketDataProvider
from app.services.entry_scoring import EntryScoringEngine

router = APIRouter(prefix="/monitoring", tags=["Entry Monitor"])

@router.get("", response_model=List[MonitoringResponse])
def get_monitoring_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(MonitoringSession).filter(MonitoringSession.user_id == current_user.id).order_by(MonitoringSession.created_at.desc()).all()
    
    # Refresh live evaluation state on read
    for s in sessions:
        if s.status in ["Monitoring", "Evaluating"]:
            try:
                stock_data = MarketDataProvider.get_stock_data(s.symbol)
                eval_data = EntryScoringEngine.evaluate_entry(stock_data)
                s.current_price = eval_data["current_price"]
                s.last_score = eval_data["entry_score"]
                
                # Check if current price is within preferred entry zone
                if s.lower_zone and s.upper_zone:
                    if s.lower_zone <= s.current_price <= s.upper_zone:
                        if s.status != "Entry conditions met":
                            s.status = "Entry conditions met"
                            # Create entry alert
                            alert = MonitoringAlert(
                                session_id=s.id,
                                title=f"🎯 Entry Trigger Met for {s.symbol}",
                                message=f"Current price ₹{s.current_price:.2f} entered target zone [₹{s.lower_zone:.2f} - ₹{s.upper_zone:.2f}] with AI Entry Score {s.last_score}/100.",
                                level="SUCCESS"
                            )
                            db.add(alert)
                db.commit()
            except Exception:
                pass
                
    return sessions

@router.post("", response_model=MonitoringResponse)
def create_monitoring_session(data_in: MonitoringCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    clean_sym = data_in.symbol.strip().upper()
    stock_data = MarketDataProvider.get_stock_data(clean_sym)
    eval_data = EntryScoringEngine.evaluate_entry(stock_data)
    
    session = MonitoringSession(
        user_id=current_user.id,
        symbol=clean_sym,
        investment_intent=data_in.investment_intent,
        target_strategy=data_in.target_strategy,
        status="Monitoring",
        lower_zone=eval_data["preferred_entry_zone"]["lower"],
        upper_zone=eval_data["preferred_entry_zone"]["upper"],
        current_price=eval_data["current_price"],
        last_score=eval_data["entry_score"]
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # Add initial advisory alert
    initial_alert = MonitoringAlert(
        session_id=session.id,
        title=f"Monitoring Activated for {clean_sym}",
        message=f"Session initiated. Preferred entry zone: ₹{session.lower_zone} – ₹{session.upper_zone}. AI will monitor price action and VWAP alignment.",
        level="INFO"
    )
    db.add(initial_alert)
    db.commit()
    db.refresh(session)
    
    return session

@router.patch("/{session_id}/status")
def update_monitoring_status(session_id: str, new_status: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(MonitoringSession).filter(MonitoringSession.id == session_id, MonitoringSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Monitoring session not found")
        
    session.status = new_status
    db.commit()
    return {"status": "success", "session_status": session.status}

@router.delete("/{session_id}")
def delete_monitoring_session(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(MonitoringSession).filter(MonitoringSession.id == session_id, MonitoringSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Monitoring session not found")
        
    db.delete(session)
    db.commit()
    return {"status": "success", "message": "Monitoring session removed"}
