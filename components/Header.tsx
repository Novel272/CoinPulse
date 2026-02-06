"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SearchModal } from "./SearchModal";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/coingecko.actions";

const Header = () => {
  const pathname = usePathname();
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const data = await fetcher<{ coins: TrendingCoin[] }>(
          "/search/trending",
          undefined,
          300,
        );
        setTrendingCoins(data?.coins || []);
      } catch {
        setTrendingCoins([]);
      }
    }
    fetchTrending();
  }, []);

  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image src="/logo.svg" alt="CoinPulse logo" width={132} height={40} />
        </Link>

        <nav>
          <Link
            href="/"
            className={cn("nav-link", {
              "is-active": pathname === "/",
              "is-home": true,
            })}
          >
            Home
          </Link>

          <SearchModal initialTrendingCoins={trendingCoins} />

          <Link
            href="/coins"
            className={cn("nav-link", {
              "is-active": pathname === "/coins",
            })}
          >
            All Coins
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
