import { formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const CoinHeader = ({
  livePriceChangePercentage24h,
  priceChange24h,
  priceChangePercentage30d,
  livePrice,
  name,
  image,
}: LiveCoinHeaderProps) => {
  const isTrendingUp = livePriceChangePercentage24h > 0;
  const isPriceChangeUP = priceChange24h > 0;
  const isThirtyDaysUp = priceChangePercentage30d > 0;

  const stats = [
    {
      label: "Today",
      value: livePriceChangePercentage24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "30 Days",
      value: priceChangePercentage30d,
      isUp: isThirtyDaysUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "Price Change in (24h)",
      value: priceChange24h,
      isUp: isPriceChangeUP,
      formatter: formatCurrency,
      showIcon: false,
    },
  ];

  return (
    <div id="coin-header">
      <h3>{name}</h3>

      <div className="info">
        <Image src={image} alt={name} width={77} height={77} />

        <div className="price-row">
          <h1>{formatCurrency(livePrice)}</h1>
          <Badge
            className={cn("badge", isTrendingUp ? "badge-up" : "badge-down")}
          >
            {formatCurrency(livePriceChangePercentage24h)}
            {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
            (24h)
          </Badge>
        </div>
      </div>

      <ul className="stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <p className="label">{stat.label}</p>
            <div
              className={cn("value", {
                "text-green-500": stat.isUp,
                "text-red-500": !stat.isUp,
              })}
            >
              <p>{stat.formatter(stat.value)}</p>
              {stat.showIcon && stat.isUp ? (
                <TrendingUp width={17} height={17} />
              ) : (
                <TrendingDown width={17} height={17} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinHeader;
