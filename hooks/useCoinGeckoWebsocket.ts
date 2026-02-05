import { useRef, useState, useEffect, useCallback } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_COINGECKO_BASE_URL ||
  "https://api.coingecko.com/api/v3";

export const useCoinGeckoWebsocket = ({
  coinId,
  /* poolId, */ // poolId is defined but never used, so it's commented out to fix the unused variable error
  liveInterval,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null); // Fix: ohlcv should be OHLCData | null, not array
  // Removed isLoading and error state, not used in return type

  const isFetching = useRef(false);
  //fetchPrice will be in charge of getting the data when called using useEffect after it
  const fetchPrice = useCallback(async () => {
    const url =
      `${API_BASE}/simple/price` +
      `?ids=${coinId}` +
      `&vs_currencies=usd` +
      `&include_24hr_change=true` +
      `&include_market_cap=true` +
      `&include_24hr_vol=true`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch price");

    const data = await res.json();
    const coin = data[coinId];

    if (!coin) throw new Error("Invalid coin id");

    setPrice({
      usd: coin.usd,
      price: coin.usd,
      change24h: coin.usd_24h_change,
      marketCap: coin.usd_market_cap,
      volume24h: coin.usd_24h_vol,
      timestamp: Date.now(),
    });
  }, [coinId]);

  const fetchOHLC = useCallback(async () => {
    const url = `${API_BASE}/coins/${coinId}/ohlc` + `?vs_currency=usd&days=1`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch OHLC");

    const data: OHLCData[] = await res.json();
    setOhlcv(data.length > 0 ? data[data.length - 1] : null); // Fix: set last OHLCData or null
  }, [coinId]);

  useEffect(() => {
    if (!coinId) return;

    // Fix: Convert liveInterval (string) to ms for setInterval
    const intervalMs =
      liveInterval === "1s" ? 1000 : liveInterval === "1m" ? 60000 : 10000;

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
    const intervalId: NodeJS.Timeout = setInterval(fetchAll, intervalMs);

    return () => clearInterval(intervalId);
  }, [coinId, liveInterval, fetchOHLC, fetchPrice]);

  return {
    price,
    ohlcv,
    trades: [], // Added to match UseCoinGeckoWebSocketReturn type
    isConnected: true, // REST is stateless
  };
};

// ---
// Error Fix Summary:
// 1. liveInterval was a string ("1s" | "1m"), but setInterval expects ms (number). Fixed by converting to ms.
// 2. ohlcv state and return type expected OHLCData | null, but was set as array. Fixed to store last OHLCData or null.
// 3. poolId was unused, so commented out to avoid TS error.
// 4. Added fetchOHLC and fetchPrice to useEffect deps to satisfy React Hook rules.
// 5. Used const for intervalId as it is never reassigned.
