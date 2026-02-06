"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { searchCoins } from "@/lib/coingecko.actions";
import { Search as SearchIcon, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn, formatPercentage } from "@/lib/utils";
import useSWR from "swr";
import { useDebounce, useKey } from "react-use";

const TRENDING_LIMIT = 8;
const SEARCH_LIMIT = 10;

const SearchItem = ({ coin, onSelect, isActiveName }: SearchItemProps) => {
  const isSearchCoin =
    typeof coin.data?.price_change_percentage_24h === "number";
  const change = isSearchCoin
    ? ((coin as SearchCoin).data?.price_change_percentage_24h ?? 0)
    : ((coin as TrendingCoin["item"]).data.price_change_percentage_24h?.usd ??
      0);
  return (
    <li
      tabIndex={0}
      onClick={() => onSelect(coin.id)}
      className={cn(
        "search-item flex items-center justify-between cursor-pointer p-3 hover:bg-gray-800",
        isActiveName && "bg-gray-900",
      )}
      style={{ outline: "none" }}
    >
      <div className="coin-info flex gap-4 items-center">
        <Image src={coin.thumb} alt={coin.name} width={40} height={40} />
        <div>
          <p className={cn("font-bold", isActiveName && "text-white")}>
            {coin.name}
          </p>
          <p className="coin-symbol text-sm text-purple-100 uppercase">
            {coin.symbol}
          </p>
        </div>
      </div>
      <div
        className={cn("coin-change flex gap-1 items-center font-medium", {
          "text-green-500": change > 0,
          "text-red-500": change < 0,
        })}
      >
        {change > 0 ? (
          <TrendingUp size={14} className="text-green-500" />
        ) : (
          <TrendingDown size={14} className="text-red-500" />
        )}
        <span>{formatPercentage(Math.abs(change))}</span>
      </div>
    </li>
  );
};

export const SearchModal = ({
  initialTrendingCoins = [],
}: {
  initialTrendingCoins: TrendingCoin[];
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useDebounce(
    () => {
      setDebouncedQuery(searchQuery.trim());
    },
    300,
    [searchQuery],
  );

  const { data: searchResults = [], isValidating: isSearching } = useSWR<
    SearchCoin[]
  >(
    debouncedQuery ? ["coin-search", debouncedQuery] : null,
    ([, query]) => searchCoins(query as string),
    {
      revalidateOnFocus: false,
    },
  );

  useKey(
    (event) =>
      event.key?.toLowerCase() === "k" && (event.metaKey || event.ctrlKey),
    (event) => {
      event.preventDefault();
      setOpen((prev) => !prev);
    },
    {},
    [setOpen],
  );

  const handleSelect = (coinId: string) => {
    setOpen(false);
    setSearchQuery("");
    setDebouncedQuery("");
    router.push(`/coins/${coinId}`);
  };

  const hasQuery = debouncedQuery.length > 0;
  const trendingCoins = initialTrendingCoins.slice(0, TRENDING_LIMIT);
  const showTrending = !hasQuery && trendingCoins.length > 0;

  const isSearchEmpty = !isSearching && !hasQuery && !showTrending;
  const isTrendingListVisible = !isSearching && showTrending;

  const isNoResults = !isSearching && hasQuery && searchResults.length === 0;
  const isResultsVisible = !isSearching && hasQuery && searchResults.length > 0;

  return (
    <div id="search-modal">
      <Button variant="ghost" onClick={() => setOpen(true)} className="trigger">
        <SearchIcon size={18} />
        Search
        <kbd className="kbd">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div
            className="dialog bg-gray-900 rounded-lg shadow-lg w-full max-w-lg p-4"
            data-search-modal
          >
            <div className="cmd-input mb-4">
              <input
                className="w-full p-2 rounded bg-gray-800 text-white outline-none"
                placeholder="Search for a token by name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <ul className="list custom-scrollbar max-h-96 overflow-y-auto">
              {isSearching && (
                <li className="empty py-6 text-center text-sm text-gray-400">
                  Searching...
                </li>
              )}
              {isSearchEmpty && (
                <li className="empty py-6 text-center text-sm text-gray-400">
                  Type to search for coins...
                </li>
              )}
              {isTrendingListVisible &&
                trendingCoins.map(({ item }) => (
                  <SearchItem
                    key={item.id}
                    coin={item}
                    onSelect={handleSelect}
                    isActiveName={false}
                  />
                ))}
              {isNoResults && (
                <li className="empty py-6 text-center text-sm text-gray-400">
                  No coins found.
                </li>
              )}
              {isResultsVisible && (
                <>
                  <li className="heading px-2 py-1 text-xs text-gray-400">
                    Search Results
                  </li>
                  {searchResults.slice(0, SEARCH_LIMIT).map((coin) => (
                    <SearchItem
                      key={coin.id}
                      coin={coin}
                      onSelect={handleSelect}
                      isActiveName
                    />
                  ))}
                </>
              )}
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
