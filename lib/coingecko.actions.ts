"use server";

import qs from "query-string";

// Public CoinGecko API base URL (no API key required)
const BASE_URL = "https://api.coingecko.com/api/v3";
const DEMO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Generic fetcher for CoinGecko public API
 */
export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60, // ISR revalidation (Next.js)
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    {
      skipEmptyString: true,
      skipNull: true,
    },
  );

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: { error?: string } = await response
      .json()
      .catch(() => ({}));
    throw new Error(
      `API Error: ${response.status}: ${errorBody.error || response.statusText}`,
    );
  }

  return response.json();
}

/**
 * getPools stub for Free Plan
 * On-chain endpoints are not available in the free API, so we just return empty data
 */
export async function getPools(
  _id: string,
  _network?: string | null,
  _contractAddress?: string | null,
): Promise<PoolData> {
  void _id;
  void _network;
  void _contractAddress;
  return {
    id: "",
    address: "",
    name: "",
    network: "",
  };
}

// Types
export interface PoolData {
  id: string;
  address: string;
  name: string;
  network: string;
}

export interface CoinGeckoErrorBody {
  error?: string;
}

interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

interface MarketData {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank?: number;
  image: string; // large image
}

/**
 * Search coins with price data (two-step merge)
 */
export const searchCoins = async (
  query: string,
  limit = 10,
): Promise<SearchCoin[]> => {
  if (!query) return [];

  // 1️⃣ Search endpoint
  const searchRes = await fetch(
    `${BASE_URL}/search?query=${encodeURIComponent(query)}`,
    {
      headers: DEMO_API_KEY ? { "x-cg-demo-api-key": DEMO_API_KEY } : undefined,
    },
  );

  if (!searchRes.ok) throw new Error("Failed to search coins");

  const searchData: { coins: CoinSearchResult[] } = await searchRes.json();

  const coins = (searchData.coins || []).slice(0, limit);

  if (coins.length === 0) return [];

  // 2️⃣ Market data endpoint
  const ids = coins.map((coin) => coin.id).join(",");

  const marketRes = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`,
    {
      headers: DEMO_API_KEY ? { "x-cg-demo-api-key": DEMO_API_KEY } : undefined,
    },
  );

  if (!marketRes.ok) throw new Error("Failed to fetch market data");

  const marketData: MarketData[] = await marketRes.json();

  // 3️⃣ Merge search + price data
  const marketMap = new Map(marketData.map((coin) => [coin.id, coin]));

  return coins.map((coin) => {
    const market = marketMap.get(coin.id);
    const market_cap_rank: number | null =
      market && typeof market.market_cap_rank === "number"
        ? market.market_cap_rank
        : null;
    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      thumb: coin.thumb,
      market_cap_rank: market_cap_rank ?? null,
      large: market ? market.image : coin.thumb, // fallback to thumb
      data: {
        ...(market ? { price: market.current_price } : {}),
        price_change_percentage_24h: market
          ? market.price_change_percentage_24h
          : 0,
      },
    };
  });
};
