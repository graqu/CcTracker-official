import { CryptoType } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CoinGeckoContext } from "@/store/CoinsDataStore";
import { useContext, useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import emptyPhoto from "../assets/nothing.jpg";

/////COMPONENT DEFINITION

const DetailsPage = () => {
  ///STATE and context
  const params = useParams();
  const ctx = useContext(CoinGeckoContext);
  const coinIsFav = ctx.favouritesList.coinsList.some(
    (coin) => coin.id === params.currencyId
  );

  type ChartName = "prices" | "market_caps" | "total_volumes";
  type PriceEntry =
    | {
        date: string;
        price: number | never;
      }
    | undefined;

  const [chartType, setChartType] = useState<ChartName>("prices");
  const [chartTable, setChartTable] = useState<PriceEntry[]>([]);

  ///Values
  const currencyId = params.currencyId;
  const coinData: CryptoType | undefined = ctx.marketData?.find(
    (coin) => coin.id === currencyId
  );
  const loadingCoinsDataStatus = ctx.loadingDataState.mainList;
  const loadingChartsDataStatus = ctx.loadingDataState.chartsList;

  const heading = (() => {
    if (chartType === "prices") {
      return "Price";
    } else if (chartType === "market_caps") {
      return "Market cap";
    } else if (chartType === "total_volumes") {
      return "Total volume";
    } else {
      return "";
    }
  })();
  let holdingsAmount = 0;

  if (coinIsFav) {
    const arr = [...ctx.favouritesList.coinsList];
    const data = arr.find((coin) => coin.id === params.currencyId);
    holdingsAmount = data ? data.amount : 0;
  }

  type ChartInfo = {
    id: string;
    market_caps?: [];
    prices?: [];
    total_volumes?: [];
  };

  useEffect(() => {
    async function setData() {
      if (currencyId) {
        const data = await ctx.getChart(currencyId);

        if (data) {
          const coinInfo: ChartInfo = { id: data ? data.id : null, ...data };
          const chartData = coinInfo[chartType]?.map((dataPoint) => ({
            date: new Date(dataPoint[0]).toLocaleDateString("pl-PL"),
            price: dataPoint[1],
          }));
          setChartTable(chartData);
        }
      }
    }
    setData();
  }, [chartType]);

  //Functions

  const dataTypeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosenValue: ChartName | string = e.target.value;

    if (chosenValue) {
      setChartType(chosenValue);
    }
  };
  ////COIN INFO CONTENT
  let coinDataContent;

  if (loadingCoinsDataStatus.isLoading) {
    coinDataContent = (
      <>
        <div className="info-bar">
          <Skeleton className="w-[40px] h-[40px] mb-[6px]" />
          <div>
            <Skeleton className="w-[150px] h-[32px] mb-[6px] mx-auto" />
          </div>
        </div>
        <div>
          Current Price:{" "}
          <Skeleton className="w-[40px] h-[24px] m-0 inline-block" />
        </div>
        <div>
          Market Cap:{" "}
          <Skeleton className="w-[40px] h-[24px] m-0 inline-block" />
        </div>
      </>
    );
  }
  if (!loadingCoinsDataStatus.isLoading && loadingCoinsDataStatus.isError) {
    coinDataContent = (
      <p>Something went wrong and we can't find all information</p>
    );
  }
  if (
    !loadingCoinsDataStatus.isLoading &&
    !loadingCoinsDataStatus.isError &&
    coinData
  ) {
    coinDataContent = (
      <>
        <div className="info-bar">
          <img src={coinData?.icon} alt={`${coinData?.id} logo`} width="40px" />
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {`${coinData?.name} (${coinData?.shortcut})`}
          </h3>
        </div>
        <p>
          Current Price: {coinData?.price} {coinData?.increased}
        </p>
        <p>Market Cap: {coinData?.marketcap}</p>
      </>
    );
  }
  if (
    !loadingCoinsDataStatus.isLoading &&
    !loadingCoinsDataStatus.isError &&
    !coinData
  ) {
    coinDataContent = (
      <>
        <div className="info-bar mb-[36px]">
          <Skeleton className="w-[40px] h-[40px] mb-[6px]" />
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[tomato]">
            Warning
          </h3>
          <p>{`I can't find more information about ${currencyId}`}</p>
        </div>
        <div className="max-w-[700px] text-left mx-auto">
          <p>
            <span className="font-bold">1.</span> If you see only chart, the
            reason is that beta version of this app load only list of 100 most
            popular coin in current time. For rest of them and by this time you
            can see only chart for rest of them. <br />{" "}
            <span className="font-bold">2.</span> If You see no data, there is
            an server error or you typed wrong address
          </p>
        </div>
      </>
    );
  }

  ///CHART CONTENT
  let chartContent;

  if (!chartTable && loadingChartsDataStatus.isLoading) {
    chartContent = <Skeleton className="w-[600px] h-[300px]" />;
  }
  if (
    !chartTable &&
    !loadingChartsDataStatus.isLoading &&
    loadingChartsDataStatus.isError
  ) {
    chartContent = (
      <>
        <img
          src={emptyPhoto}
          alt="desert of emptiness photo"
          width={600}
          className="w-[600px] h-[300px] opacity-50 grayscale"
        />
      </>
    );
  }
  if (
    chartTable &&
    !loadingChartsDataStatus.isLoading &&
    !loadingChartsDataStatus.isError
  ) {
    chartContent = (
      <LineChart width={600} height={300} data={chartTable}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis unit="$" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    );
  }

  //RESULT

  return (
    <>
      {coinDataContent}
      <h2 className="mt-5 text-[28px] font-bold">{heading} chart</h2>
      <label htmlFor="charts">Choose type:</label>
      <select
        name="charts"
        id="charts"
        onChange={dataTypeHandler}
        defaultValue={chartType}
      >
        <option value="prices">Price</option>
        <option value="market_caps">Market cap</option>
        <option value="total_volumes">Volume</option>
      </select>
      <div className="flex justify-center my-[24px]">{chartContent}</div>

      {coinData &&
        (coinIsFav ? (
          <>
            <div className="m-[5px]">
              <Link
                to="/user-portfolio"
                className={`${buttonVariants({
                  variant: "outline",
                })} block cursor-pointer`}
              >
                Amount: {holdingsAmount}
              </Link>
            </div>

            <Button
              onClick={() => ctx.onFavRemove(coinData?.id)}
              className="m-[10px]"
            >
              Remove from favourites
            </Button>
          </>
        ) : (
          <Button
            className="m-[10px]"
            onClick={() => ctx.onFavAdd(coinData?.id)}
          >
            Add to Favourites
          </Button>
        ))}

      <Link
        className={`${buttonVariants({ variant: "default" })} m-[10px]`}
        to="../"
      >
        Go back
      </Link>
    </>
  );
};

export default DetailsPage;
