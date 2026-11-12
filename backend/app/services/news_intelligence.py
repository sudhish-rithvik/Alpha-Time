from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

NEWS_DATABASE = [
    {
        "id": "news-1",
        "title": "Government advances 20% ethanol blending target: Major boost for sugar and biofuels ecosystem",
        "source": "Financial Express",
        "published_at": datetime.utcnow() - timedelta(hours=2),
        "summary": "The Ministry of Petroleum announced accelerated procurement schedules for grain-based and sugarcane-based ethanol, prompting aggressive capex investments across the renewable energy and distillery sectors.",
        "sentiment": "POSITIVE",
        "sentiment_score": 0.85,
        "category": "Government policies",
        "related_symbols": ["RELIANCE", "ITC", "BALRAMCHIN"],
        "sector": "Energy & Conglomerate"
    },
    {
        "id": "news-2",
        "title": "IT Giants report robust cloud transformation orders amid steady US tech budget expansion",
        "source": "Economic Times",
        "published_at": datetime.utcnow() - timedelta(hours=4),
        "summary": "TCS and Infosys bag key sovereign digital infrastructure mandates across EMEA and North America, indicating sustained resilience in enterprise AI and application modernization pipelines.",
        "sentiment": "POSITIVE",
        "sentiment_score": 0.72,
        "category": "Quarterly earnings",
        "related_symbols": ["TCS", "INFY", "WIPRO"],
        "sector": "Information Technology"
    },
    {
        "id": "news-3",
        "title": "RBI maintains repo rate at 6.5%, signals balanced liquidity and prudent credit-deposit ratio monitoring",
        "source": "Business Standard",
        "published_at": datetime.utcnow() - timedelta(hours=6),
        "summary": "The Monetary Policy Committee decided unanimously to keep benchmark rates steady, underscoring resilient domestic growth while urging private and public banks to guard against unsecured retail lending growth.",
        "sentiment": "NEUTRAL",
        "sentiment_score": 0.15,
        "category": "Interest rate changes",
        "related_symbols": ["HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK"],
        "sector": "Banking & Financial Services"
    },
    {
        "id": "news-4",
        "title": "Commercial vehicle dispatches register 14% YoY increase driven by heavy industrial freight demand",
        "source": "Mint",
        "published_at": datetime.utcnow() - timedelta(hours=9),
        "summary": "Tata Motors and Ashok Leyland post higher medium and heavy commercial vehicle sales, backed by robust national highway construction activity and expanding mining logistics.",
        "sentiment": "POSITIVE",
        "sentiment_score": 0.68,
        "category": "Industry-specific changes",
        "related_symbols": ["TATAMOTORS", "MARUTI"],
        "sector": "Automobile"
    },
    {
        "id": "news-5",
        "title": "Global crude oil prices fluctuate near $74/bbl following OPEC+ supply calibration meeting",
        "source": "Reuters India",
        "published_at": datetime.utcnow() - timedelta(hours=14),
        "summary": "Brent crude witnessed modest intraday consolidation as voluntary output curbs balanced mixed demand forecasts from Asian refining hubs, easing margin pressure on downstream petrochemical players.",
        "sentiment": "NEUTRAL",
        "sentiment_score": 0.05,
        "category": "Commodity price movements",
        "related_symbols": ["RELIANCE", "ONGC", "BPCL"],
        "sector": "Energy & Conglomerate"
    },
    {
        "id": "news-6",
        "title": "Telecom tariff hikes drive 18% improvement in average revenue per user (ARPU)",
        "source": "NDTV Profit",
        "published_at": datetime.utcnow() - timedelta(days=1),
        "summary": "Bharti Airtel and peers report enhanced free cash flow yields and accelerating 5G monetisation across Tier-1 and Tier-2 clusters.",
        "sentiment": "POSITIVE",
        "sentiment_score": 0.79,
        "category": "Regulatory announcements",
        "related_symbols": ["BHARTIARTL"],
        "sector": "Telecommunications"
    },
    {
        "id": "news-7",
        "title": "L&T secures mega multi-billion international infrastructure EPC contract in Middle East",
        "source": "BloombergQuint",
        "published_at": datetime.utcnow() - timedelta(days=1, hours=4),
        "summary": "Larsen & Toubro's hydrocarbon and transmission grid divisions bagged comprehensive turn-key orders, boosting the consolidated order backlog to an all-time record high.",
        "sentiment": "POSITIVE",
        "sentiment_score": 0.88,
        "category": "Product launches",
        "related_symbols": ["LT"],
        "sector": "Infrastructure & Capital Goods"
    }
]

class NewsIntelligenceService:
    @classmethod
    def get_latest_news(cls, limit: int = 15, symbol: Optional[str] = None) -> List[Dict[str, Any]]:
        news_list = NEWS_DATABASE.copy()
        if symbol:
            clean_sym = symbol.strip().upper()
            news_list = [n for n in news_list if clean_sym in n.get("related_symbols", [])]
            # If no direct match, return general sector or top news
            if not news_list:
                news_list = NEWS_DATABASE[:3]
        return news_list[:limit]

    @classmethod
    def analyze_news_sentiment_for_stock(cls, symbol: str) -> Dict[str, Any]:
        clean_sym = symbol.strip().upper()
        matched = [n for n in NEWS_DATABASE if clean_sym in n.get("related_symbols", [])]
        
        if not matched:
            return {
                "sentiment": "NEUTRAL",
                "score": 50, # 0 to 100 scale
                "article_count": 0,
                "latest_headline": "No major breaking regulatory or company-specific news in the past 24 hours.",
                "event_type": "Quiet Newsflow"
            }
            
        avg_raw_score = sum(n["sentiment_score"] for n in matched) / len(matched)
        # Scale -1.0..1.0 to 0..100
        scaled_score = int(max(0, min(100, (avg_raw_score + 1.0) * 50)))
        
        dominant_sentiment = "NEUTRAL"
        if scaled_score >= 65:
            dominant_sentiment = "POSITIVE"
        elif scaled_score <= 35:
            dominant_sentiment = "NEGATIVE"
            
        return {
            "sentiment": dominant_sentiment,
            "score": scaled_score,
            "article_count": len(matched),
            "latest_headline": matched[0]["title"],
            "event_type": matched[0]["category"]
        }
