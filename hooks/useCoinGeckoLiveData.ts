"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Base URL for free CoinGecko API
const API_BASE =
  process.env.NEXT_PUBLIC_COINGECKO_BASE_URL ||
  "https://api.coingecko.com/api/v3";

/**
 * Free-plan hook to fetch live price and last OHLC candle
 * Trades and WebSocket are not available on free plan
 */
export const useCoinGeckoLiveData = ({
  coinId,
  liveInterval = "30s", // default to 30s polling for free API
}: UseCoinGeckoLiveDataProps): UseCoinGeckoLiveDataReturn => {
  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

  const isFetching = useRef(false);

  // Fetch latest price data
  const fetchPrice = useCallback(async () => {
    try {
      const url = `${API_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch price");

      const data = await res.json();
      const coin = data[coinId];

      if (!coin) throw new Error("Invalid coin ID");

      setPrice({
        usd: coin.usd,
        price: coin.usd,
        change24h: coin.usd_24h_change,
        marketCap: coin.usd_market_cap,
        volume24h: coin.usd_24h_vol,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("useCoinGeckoLiveData fetchPrice error:", err);
    }
  }, [coinId]);

  // Fetch latest OHLC candle (last candle only)
  const fetchOHLC = useCallback(async () => {
    try {
      const url = `${API_BASE}/coins/${coinId}/ohlc?vs_currency=usd&days=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch OHLC");

      const data: OHLCData[] = await res.json();

      // Set only the last candle for free API live display
      setOhlcv(data.length > 0 ? data[data.length - 1] : null);
    } catch (err) {
      console.error("useCoinGeckoLiveData fetchOHLC error:", err);
    }
  }, [coinId]);

  // Convert liveInterval string to milliseconds for setInterval
  const intervalMs = (() => {
    switch (liveInterval) {
      case "1m":
        return 60000;
      case "10s":
        return 10000;
      case "30s":
      default:
        return 30000;
    }
  })();

  useEffect(() => {
    if (!coinId) return;

    const fetchAll = async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      try {
        await Promise.all([fetchPrice(), fetchOHLC()]);
      } finally {
        isFetching.current = false;
      }
    };

    // Initial fetch
    fetchAll();

    // Polling loop
    const intervalId = setInterval(fetchAll, intervalMs);

    return () => clearInterval(intervalId);
  }, [coinId, fetchPrice, fetchOHLC, intervalMs]);

  return {
    price,
    ohlcv,
    trades: [], // Free API cannot fetch trades
    isConnected: true, // REST API is stateless
  };
};
