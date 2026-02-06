import React from "react";
import { fetcher } from "@/lib/coingecko.actions";
import DataTable from "./DataTable";
import { cn, formatCurrency } from "@/lib/utils";

type Exchange = {
  id: string;
  name: string;
  trust_score_rank?: number;
  trade_volume_24h_btc?: number;
};

const ExchangeList = async () => {
  const exchanges = await fetcher<Exchange[]>("exchanges");
  const topExchanges = exchanges.slice(0, 10);

  const columns: DataTableColumn<Exchange>[] = [
    {
      header: "Rank",
      cellClassName: "rank-cell",
      cell: (exchange) => exchange.trust_score_rank ?? "-",
    },
    {
      header: "Exchange",
      cellClassName: "exchange-cell",
      cell: (exchange) => exchange.name,
    },
    {
      header: "24h Volume (BTC)",
      cellClassName: "volume-cell",
      cell: (exchange) =>
        exchange.trade_volume_24h_btc
          ? formatCurrency(exchange.trade_volume_24h_btc, 2, "BTC", false)
          : "-",
    },
  ];

  return (
    <div id="exchanges" className="custom-scrollBar">
      <h4>Top Exchanges</h4>
      <DataTable
        columns={columns}
        data={topExchanges}
        rowKey={(row) => row.id}
        tableClassName="mt-3"
      />
    </div>
  );
};

export default ExchangeList;
