import React from "react";
import { fetcher } from "@/lib/coingecko.actions";

type Exchange = {
  id: string;
  name: string;
  trust_score_rank?: number;
  trade_volume_24h_btc?: number;
};
const ExchangeList = async () => {
  const exchanges = await fetcher<Exchange[]>("exchanges");

  // Limit results so the page stays light
  const topExchanges = exchanges.slice(0, 10);

  return (
    <div className="exchange-list">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Exchange</th>
            <th>24h Volume (BTC)</th>
          </tr>
        </thead>

        <tbody>
          {topExchanges.map((exchange) => (
            <tr key={exchange.id}>
              <td>{exchange.trust_score_rank ?? "-"}</td>
              <td>{exchange.name}</td>
              <td>
                {exchange.trade_volume_24h_btc
                  ? exchange.trade_volume_24h_btc.toFixed(2)
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExchangeList;
