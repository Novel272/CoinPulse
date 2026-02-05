"use server";

import qs from "query-string";

// Public CoinGecko API base URL (no API key required)
const BASE_URL = "https://api.coingecko.com/api/v3";

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
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
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
