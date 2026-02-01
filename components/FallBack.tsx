// Categories fallback skeleton using DataTable

import React from "react";
import DataTable from "@/components/DataTable";

// CoinOverview fallback skeleton
export function CoinOverviewFallBack() {
  return (
    <div id="coin-overview" className="skeleton coin-overview-fallback">
      <div className="header pt-2 flex items-center gap-4 animate-pulse">
        <div className="rounded-full bg-gray-300 w-14 h-14" />
        <div className="info flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-8 w-40 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}

// TrendingCoins fallback skeleton using DataTable
export function TrendingCoinFallBack() {
  // Define columns to match the trending table
  const columns = [
    {
      header: "Name",
      cell: () => <div className="h-4 w-24 bg-gray-300 rounded" />,
    },
    {
      header: "24h Change",
      cell: () => <div className="h-4 w-16 bg-gray-300 rounded" />,
    },
    {
      header: "price",
      cell: () => <div className="h-4 w-20 bg-gray-300 rounded" />,
    },
  ];
  // Create dummy rows for skeleton
  const data = Array.from({ length: 5 }, (_, i) => ({ id: i }));

  return (
    <div id="trending-coins" className="skeleton trending-coins-fallback">
      <DataTable
        data={data}
        columns={columns}
        rowKey={(row) => row.id}
        tableClassName="trending-coins-table animate-pulse"
      />
    </div>
  );
}

export function CategoriesFallBack() {
  const columns = [
    {
      header: "Category",
      cell: () => <div className="h-4 w-28 bg-gray-300 rounded" />,
    },
    {
      header: "Top Gainers",
      cell: () => (
        <div className="flex gap-1">
          <div className="w-7 h-7 bg-gray-300 rounded-full" />
          <div className="w-7 h-7 bg-gray-200 rounded-full" />
          <div className="w-7 h-7 bg-gray-100 rounded-full" />
        </div>
      ),
    },
    {
      header: "24h Change",
      cell: () => <div className="h-4 w-16 bg-gray-300 rounded" />,
    },
    {
      header: "Market Cap",
      cell: () => <div className="h-4 w-24 bg-gray-300 rounded" />,
    },
  ];
  const data = Array.from({ length: 6 }, (_, i) => ({ id: i }));

  return (
    <div id="categories" className="skeleton categories-fallback">
      <DataTable
        data={data}
        columns={columns}
        rowKey={(row) => row.id}
        tableClassName="categories-table animate-pulse"
      />
    </div>
  );
}
