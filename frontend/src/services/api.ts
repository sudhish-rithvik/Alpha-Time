import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('alphatime_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication APIs
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (data: { email: string; password: string; full_name?: string }) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// Market & Stocks APIs
export const marketService = {
  getOverview: async () => {
    const res = await api.get('/market/overview');
    return res.data;
  },
  searchStocks: async (query: string) => {
    const res = await api.get(`/stocks/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
  getStockUniverse: async () => {
    const res = await api.get('/stocks/universe');
    return res.data;
  },
  getStockDetail: async (symbol: string, period: string = '6mo') => {
    const res = await api.get(`/stocks/${symbol}?period=${period}`);
    return res.data;
  },
  getEntryScore: async (symbol: string) => {
    const res = await api.get(`/analysis/entry-score/${symbol}`);
    return res.data;
  },
  getTopOpportunities: async () => {
    const res = await api.get('/analysis/opportunities');
    return res.data;
  },
  runBacktest: async (payload: { symbol: string; strategy: string; period: string }) => {
    const res = await api.post('/analysis/backtest', payload);
    return res.data;
  },
};

// News APIs
export const newsService = {
  getNews: async (symbol?: string, limit: number = 20) => {
    const query = symbol ? `?symbol=${symbol}&limit=${limit}` : `?limit=${limit}`;
    const res = await api.get(`/news${query}`);
    return res.data;
  },
  getNewsSentiment: async (symbol: string) => {
    const res = await api.get(`/news/sentiment/${symbol}`);
    return res.data;
  },
};

// Watchlist APIs
export const watchlistService = {
  getWatchlist: async () => {
    const res = await api.get('/watchlist');
    return res.data;
  },
  addItem: async (item: { symbol: string; name?: string }) => {
    const res = await api.post('/watchlist/items', item);
    return res.data;
  },
  removeItem: async (itemId: string) => {
    const res = await api.delete(`/watchlist/items/${itemId}`);
    return res.data;
  },
};

// Monitoring APIs
export const monitoringService = {
  getSessions: async () => {
    const res = await api.get('/monitoring');
    return res.data;
  },
  createSession: async (session: { symbol: string; investment_intent: number; target_strategy?: string }) => {
    const res = await api.post('/monitoring', session);
    return res.data;
  },
  updateStatus: async (sessionId: string, newStatus: string) => {
    const res = await api.patch(`/monitoring/${sessionId}/status?new_status=${encodeURIComponent(newStatus)}`);
    return res.data;
  },
  deleteSession: async (sessionId: string) => {
    const res = await api.delete(`/monitoring/${sessionId}`);
    return res.data;
  },
};

// Portfolio APIs
export const portfolioService = {
  getHoldings: async () => {
    const res = await api.get('/portfolio');
    return res.data;
  },
  addHolding: async (holding: { symbol: string; name?: string; quantity: number; average_price: number }) => {
    const res = await api.post('/portfolio', holding);
    return res.data;
  },
  deleteHolding: async (holdingId: string) => {
    const res = await api.delete(`/portfolio/${holdingId}`);
    return res.data;
  },
};
