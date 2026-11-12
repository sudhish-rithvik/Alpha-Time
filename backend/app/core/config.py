import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AlphaTime"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "alphatime-super-secret-jwt-key-2026-institutional-trading"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database: Defaults to local SQLite if PostgreSQL is not specified
    DATABASE_URL: str = "sqlite:///./alphatime.db"
    
    # LLM configuration (Optional / Configurable)
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # Data Provider configuration: "auto", "yfinance", "mock"
    DATA_PROVIDER: str = "auto"
    
    # Scoring weights (Configurable defaults sum to 100)
    WEIGHT_TECHNICAL: float = 0.30
    WEIGHT_SENTIMENT: float = 0.20
    WEIGHT_NEWS: float = 0.20
    WEIGHT_VOLUME: float = 0.15
    WEIGHT_HISTORICAL: float = 0.15

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
