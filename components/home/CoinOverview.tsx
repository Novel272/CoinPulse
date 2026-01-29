import React from "react";
import Image from "next/image";
import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import { CoinOverviewFallBack } from "../FallBack";
import CandlestickCharts from "../CandlestickCharts";

const CoinOverview = async () => {
  let coin;
  let coinOHLCData;
  try {
    [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol",
      }),
      fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: 1,
        interval: "hourly",
        precision: "full",
      }),
    ]);
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return <CoinOverviewFallBack />;
  }
  if (!coin) return <CoinOverviewFallBack />;
  return (
    <div id="coin-overview">
      <CandlestickCharts data={coinOHLCData} coinId="bitcoin">
        <div className="header pt-2">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={56}
            height={56}
          />
          <div className="info">
            <p>
              {coin.name}/{coin.symbol.toUpperCase()}
            </p>
            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandlestickCharts>
    </div>
  );
};

export default CoinOverview;
