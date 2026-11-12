# AlphaTime — AI-Powered Stock Market Entry Assistant

> **"You choose the stock. AI helps you choose the moment."**

AlphaTime is an institutional-grade financial intelligence platform. It does NOT predict random stock direction; instead, it determines **WHEN** to enter high-conviction positions through quantitative VWAP alignment, news catalysts, volume spikes, and technical momentum indicators.

---

## 🏛️ System Architecture

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Dark institutional trading terminal theme)
- **Visuals & Charts**: Recharts & TradingView Lightweight Charts
- **State & Networking**: TanStack React Query + Axios + React Router
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Data Engineering**: Pandas, NumPy, Scikit-learn
- **Market Data Feeds**: Yahoo Finance (`yfinance`) with fallback to AlphaTime Simulated Quantitative Engine
- **Database & ORM**: SQLAlchemy + SQLite / PostgreSQL
- **Security**: JWT tokens, OAuth2 Bearer, BCrypt password hashing

---

## ⚡ Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt email-validator
python -m uvicorn app.main:app --reload --port 8000
```
- API Documentation is live at: `http://localhost:8000/api/v1/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Terminal application will launch at: `http://localhost:5173`

### 3. Automated Tests
```bash
cd backend
venv\Scripts\python -m pytest
```

---

## 📊 Core Features

1. **AI Entry Score (0–100)**: Transparent 5-pillar scoring framework (Technical 30%, Sentiment 20%, News 20%, Volume/VWAP 15%, Historical Pattern 15%).
2. **Preferred Entry Zone**: Automated institutional VWAP and ATR boundary calculation for limit order positioning.
3. **SmartEntry Monitor**: Live advisory surveillance sessions tracking target accumulation zones without executing brokerage orders.
4. **News Intelligence**: Event categorization (Government policies, earnings, interest rates) mapped to listed Indian stocks.
5. **Backtesting Engine**: Quantitative historical trade simulation preventing look-ahead bias with full survivorship and slippage disclosures.
6. **Watchlist & Portfolio**: Persisted in SQLite/PostgreSQL with instant price and P&L calculations.

---

## 🔒 Security & Reliability
- External secrets and API keys are strictly maintained on the backend.
- Full input validation via Pydantic schemas.
- CORS policy configured for secure local and production origins.
- Demo mode enabled whenever external market data is delayed or unavailable.
