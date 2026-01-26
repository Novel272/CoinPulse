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
