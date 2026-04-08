const FINNHUB_BASE = "https://finnhub.io/api/v1";

/** 인메모리 캐시 */
const cache = new Map<string, { data: unknown; expiresAt: number }>();

const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
};

const setCache = (key: string, data: unknown, ttlMs: number) => {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
};

const getApiKey = () => {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY is not configured");
  return key;
};

const fetchFinnhub = async <T>(path: string, ttlMs: number): Promise<T> => {
  const cacheKey = `finnhub:${path}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${FINNHUB_BASE}${path}&token=${getApiKey()}`);
  if (!res.ok) {
    throw new Error(`Finnhub API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as T;
  setCache(cacheKey, data, ttlMs);
  return data;
};

// --- 타입 정의 ---

export interface TickerResult {
  symbol: string;
  name: string;
}

export interface NewsItem {
  id: number;
  headline: string;
  source: string;
  url: string;
  image: string;
  summary: string;
  datetime: number;
  category: string;
}

export interface CompanyProfile {
  ticker: string;
  name: string;
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  shareOutstanding: number;
  logo: string;
  finnhubIndustry: string;
  weburl: string;
}

export interface Quote {
  c: number; // 현재가
  d: number; // 변동
  dp: number; // 변동률 (%)
  h: number; // 고가
  l: number; // 저가
  o: number; // 시가
  pc: number; // 전일 종가
  t: number; // 타임스탬프
}

// --- API 함수 ---

/** 티커 검색 (캐시 60초) */
export const searchTickers = async (query: string): Promise<TickerResult[]> => {
  interface FinnhubSearchResult {
    result: { symbol: string; description: string; type: string }[];
  }

  const data = await fetchFinnhub<FinnhubSearchResult>(
    `/search?q=${encodeURIComponent(query)}`,
    60 * 1000
  );

  return (data.result ?? [])
    .filter((item) => item.type === "Common Stock")
    .slice(0, 10)
    .map((item) => ({
      symbol: item.symbol,
      name: item.description,
    }));
};

/** 종목 뉴스 조회 (캐시 5분) */
export const getCompanyNews = async (
  symbol: string,
  days: number = 7
): Promise<NewsItem[]> => {
  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const toStr = now.toISOString().split("T")[0];
  const fromStr = from.toISOString().split("T")[0];

  const data = await fetchFinnhub<NewsItem[]>(
    `/company-news?symbol=${symbol}&from=${fromStr}&to=${toStr}`,
    5 * 60 * 1000
  );

  return (data ?? []).slice(0, 20);
};

/** 기업 프로필 조회 (캐시 1시간) */
export const getCompanyProfile = async (
  symbol: string
): Promise<CompanyProfile | null> => {
  const data = await fetchFinnhub<CompanyProfile>(
    `/stock/profile2?symbol=${symbol}`,
    60 * 60 * 1000
  );

  return data?.ticker ? data : null;
};

/** 실시간 시세 조회 (캐시 15초) */
export const getQuote = async (symbol: string): Promise<Quote> => {
  return fetchFinnhub<Quote>(`/quote?symbol=${symbol}`, 15 * 1000);
};

/** 마켓 전체 뉴스 조회 (캐시 5분) */
export const getMarketNews = async (
  category: string = "general"
): Promise<NewsItem[]> => {
  const data = await fetchFinnhub<NewsItem[]>(
    `/news?category=${category}`,
    5 * 60 * 1000
  );

  return (data ?? []).slice(0, 20);
};
