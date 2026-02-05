import Converter from "@/components/Converter";
import LiveDataWrapper from "@/components/LiveDataWrapper";
import { fetcher, getPools } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import ExchangeList from "@/components/ExchangeList";
const page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  // Fix: fetcher for OHLC data should return OHLCData[] (array of tuples), not a single tuple
  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      dex_pair_format: "contract_address",
    }),
    fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
      vs_currency: "usd",
      days: 1,
      precision: "full",
    }),
  ]);

  const platform = coinData.asset_platform_id
    ? coinData.detail_platforms?.[coinData.asset_platform_id]
    : null;
  const network = platform?.geckoterminal_url.split("/")[3] || null;

  const contractaddress = platform?.contract_address || null;

  const pool = await getPools(id, network, contractaddress);

  const coinDetails = [
    {
      label: "market cap",
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: "market cap rank",
      value: ` # ${coinData.market_cap_rank}`,
    },
    {
      label: "total volume",
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: "Website",
      value: "-",
      link: coinData.links.homepage[0],
      linktext: "HomePage",
    },
    {
      label: "Explorer",
      value: "-",
      link: coinData.links.blockchain_site[0],
      linktext: "Explorer",
    },
    {
      label: "Community",
      value: "-",
      link: coinData.links.subreddit_url,
      linktext: "Community",
    },
  ];

  return (
    <main id="coins-details-page">
      <section className="primary">
        {/*
          Fix: coinOHLCData is now always an array (OHLCData[]), matching the expected prop type
        */}
        <LiveDataWrapper
          coinId={id}
          poolId={pool.id}
          coin={coinData}
          coinOHLCData={coinOHLCData}
        >
          <h4>Exchange Listing</h4>
          <ExchangeList />
        </LiveDataWrapper>
      </section>

      <section className="secondary">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />

        <div className="details">
          <h4> Coin Details</h4>
          <ul className="details-grid">
            {coinDetails.map(({ label, value, link, linktext }, index) => (
              <li key={index}>
                <p className={label}>{label}</p>
                {link ? (
                  <div className="link">
                    <Link href={link} target="_blank">
                      {linktext || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default page;
