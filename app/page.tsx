import React, { Suspense } from "react";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoins";
import {
  CoinOverviewFallBack,
  TrendingCoinFallBack,
} from "@/components/FallBack";

const page = async () => {
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
