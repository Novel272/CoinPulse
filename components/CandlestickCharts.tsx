"use client";

import {
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
  getCandlestickConfig,
} from "@/constants";
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { useState, useRef, useTransition, useEffect } from "react";
import { fetcher } from "@/lib/coingecko.actions";
import { convertOHLCData } from "@/lib/utils";
import { ChartCandlestick } from "lucide-react";
import { useCoinGeckoLiveData } from "@/hooks/useCoinGeckoLiveData";
const CandlestickCharts = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = "daily",
  mode = "historical",
}: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const prevOhlcDataLength = useRef<number>(data?.length || 0);

  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [isPending, startTransition] = useTransition();

  const { price, ohlcv: liveOhlcv } = useCoinGeckoLiveData({
    coinId,
    liveInterval: "1m", // free API supports "1m" polling
  });

  const fetchOHLCData = async (SelectedPeriod: Period) => {
    try {
      const { days } = PERIOD_CONFIG[SelectedPeriod];

      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: "usd",
        days,
        precision: "full",
      });

      startTransition(() => {
        setOhlcData(newData ?? []);
      });
    } catch (e) {
      console.error("Error fetching OHLC data:", e);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    setPeriod(newPeriod);
    fetchOHLCData(newPeriod);
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ["daily", "weekly", "monthly"].includes(period);
    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });

    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    const converted = convertOHLCData(
      ohlcData.map(
        (item) => [Math.floor(item[0] / 1000), ...item.slice(1)] as OHLCData,
      ),
    );

    series.setData(converted);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;

      chart.applyOptions({ width: entries[0].contentRect.width });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height]);

  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current) return;

    const allData: OHLCData[] = [...ohlcData];
    if (liveOhlcv) {
      allData.push(liveOhlcv);
    }

    // Convert timestamps to seconds
    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData,
    );

    let merged: OHLCData[];

    if (liveOhlcv) {
      const liveTimestamp = liveOhlcv[0];

      const lastHistoricalCandle =
        convertedToSeconds[convertedToSeconds.length - 1];

      if (lastHistoricalCandle && lastHistoricalCandle[0] === liveTimestamp) {
        merged = [...convertedToSeconds.slice(0, -1), liveOhlcv];
      } else {
        merged = [...convertedToSeconds, liveOhlcv];
      }
    } else {
      merged = convertedToSeconds;
    }

    merged.sort((a, b) => a[0] - b[0]);

    const converted = convertOHLCData(merged);
    candleSeriesRef.current.setData(converted);

    const dataChange = prevOhlcDataLength.current !== ohlcData.length;
    if (dataChange || mode === "historical") {
      chartRef.current?.timeScale().fitContent();
      prevOhlcDataLength.current = ohlcData.length;
    }
  }, [ohlcData, liveOhlcv, mode, liveOhlcv]);

  return (
    <div id="candlestick-charts">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/5">
            period
          </span>
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={
                period === value ? "config-button-active" : "config-button"
              }
              onClick={() => handlePeriodChange(value)}
              disabled={isPending}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Live interval - disabled for free API */}
        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">
            Update Frequency:
          </span>
          <button className="config-button-active" disabled>
            1m
          </button>
        </div>
      </div>
      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  );
};

export default CandlestickCharts;
