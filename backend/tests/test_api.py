import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_market_overview():
    response = client.get("/api/v1/market/overview")
    assert response.status_code == 200
    data = response.json()
    assert "indices" in data
    assert len(data["indices"]) >= 3

def test_stock_search():
    response = client.get("/api/v1/stocks/search?q=RELIANCE")
    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0
    assert results[0]["symbol"] == "RELIANCE"

def test_entry_score_evaluation():
    response = client.get("/api/v1/analysis/entry-score/RELIANCE")
    assert response.status_code == 200
    score_data = response.json()
    assert "entry_score" in score_data
    assert 0 <= score_data["entry_score"] <= 100
    assert score_data["recommendation"] in ["BUY", "WAIT", "AVOID"]
    assert "preferred_entry_zone" in score_data
    assert "reasoning" in score_data

def test_news_endpoint():
    response = client.get("/api/v1/news")
    assert response.status_code == 200
    news = response.json()
    assert len(news) > 0
