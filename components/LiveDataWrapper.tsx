"use client";

import React from "react";
import { Separator } from "./ui/separator";
import CandlestickCharts from "./CandlestickCharts";
import { useState } from "react";
import { useCoinGeckoLiveData } from "@/hooks/useCoinGeckoLiveData";
import CoinHeader from "./CoinHeader";

const LiveDataWrapper = ({
  children,
  coinId,
  poolId,
  coin,
  coinOHLCData,
}: LiveDataProps) => {
  /* didn't use this part because i am using demo API that don't have the access to recent trending 
   const { trades, ohlcv, price } = useCoinGeckoWebSocket({ coinId, poolId, liveInterval });

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : '-'),
    },
    {
      header: 'Amount',
      cellClassName: 'amount-cell',
      cell: (trade) => trade.amount?.toFixed(4) ?? '-',
    },
    {
      header: 'Value',
      cellClassName: 'value-cell',
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : '-'),
    },
    {
      header: 'Buy/Sell',
      cellClassName: 'type-cell',
      cell: (trade) => (
        <span className={trade.type === 'b' ? 'text-green-500' : 'text-red-500'}>
          {trade.type === 'b' ? 'Buy' : 'Sell'}
        </span>
      ),
    },
    {
      header: 'Time',
      cellClassName: 'time-cell',
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : '-'),
    },
  ];
*/
  const [liveInterval, setLiveInterval] = useState<LiveInterval>("30s");
  const { price, ohlcv } = useCoinGeckoLiveData({
    coinId,
    liveInterval,
  });

  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          price?.change24h ??
          coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={
          coin.market_data.price_change_percentage_30d_in_currency.usd
        }
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />

      <Separator className="divider" />

      <div className="trend">
        <CandlestickCharts
          coinId={coinId}
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          mode="live"
          initialPeriod="daily"
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandlestickCharts>
      </div>

      <Separator className="divider" />

      {/* 
        Trades are NOT available on CoinGecko free plan.
        This section is intentionally omitted.
      */}

      {children}
    </section>
  );
};

export default LiveDataWrapper;
