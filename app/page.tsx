import DataTable from "@/components/DataTable";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { fetcher } from "@/lib/coingecko.actions";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoins";
import {
  CoinOverviewFallBack,
  TrendingCoinFallBack,
} from "@/components/FallBack";

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: "Name",
    cellClassName: "name-cell",
    cell: (coin) => {
      const item = coin.item;
      return (
        <Link href={`/coins/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link>
      );
    },
  },
  {
    header: "24h Change",
    cellClassName: "change-cell",
    cell: (coin) => {
      const item = coin.item;
      const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

      return (
        <div
          className={cn(
            "price-change",
            isTrendingUp ? "text-green-500" : "text-red-500",
          )}
        >
          <p>
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
            {Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%
          </p>
        </div>
      );
    },
  },
  {
    header: "price",
    cellClassName: "price-name",
    cell: (coin) => coin.item.data.price,
  },
];

const page = async () => {
  const trendingCoins = await fetcher<{ coin: TrendingCoin[] }>(
    "/search/trending",
    undefined,
    300,
  );

  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewFallBack />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinFallBack />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>categories</p>
      </section>
    </main>
  );
};

export default page;
