export async function getData() {
  setMainListState((prev) => {
    return { ...prev, isError: false, isLoading: true };
  });
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&price_change_percentage=24h',
      {
        method: 'GET',
      },
    );

    if (response.ok) {
      const data = await response.json();
      const array: CryptoType[] = [];
      setMainListState((prev) => {
        return { ...prev, isLoading: false };
      });

      data.forEach(
        (item: {
          name: string;
          id: string;
          current_price: number;
          price_change_24h: number;
          symbol: string;
          image: string;
          market_cap: number;
        }) => {
          const itemChange = (() => {
            const change = item.price_change_24h;
            if (change > 0) {
              return true;
            } else if (change < 0) {
              return false;
            } else {
              return null;
            }
          })();
          const newItem: CryptoType = {
            id: item.id,
            name: item.name,
            icon: item.image,
            shortcut: item.symbol,
            price: item.current_price,
            marketcap: item.market_cap,
            increased: itemChange,
          };

          if (
            favourites.coinsList.filter(
              (coin: CryptoType) => coin.id === item.id,
            ).length === 1
          ) {
            updateFavCoinData({ ...newItem, price: item.current_price });
          }
          array.push(newItem);
        },
      );

      setCoinsData(array);
      calculateFullAmount();
      // console.log(array);
    }
  } catch (error) {
    setMainListState((prev) => {
      return { ...prev, isError: true, isLoading: false };
    });
    console.warn('Problem with data loading');
    console.log(error);
  }
}

export async function fetchCharts(id: string) {
  console.log('fetching');
  setChartsLoadingState((prev) => {
    return { ...prev, isLoading: true, isError: false };
  });

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily&precision=2`;
    const response = await fetch(url, {
      method: 'GET',
    });

    if (response.ok) {
      setChartsLoadingState((prev) => {
        return { ...prev, isLoading: false, isError: false };
      });
      const data = await response.json();
      const newItem: ChartsDataT = { id: id, ...data };
      const newArray: ChartsDataT[] = [];
      newArray.push(newItem);
      setCoinsChartCoinsData((prev: ChartsDataT[]) => {
        return [...prev, ...newArray];
      });
      return newItem;
    }
    if (!response.ok) {
      setChartsLoadingState((prev) => {
        return { ...prev, isLoading: false, isError: true };
      });
    }
  } catch (error) {
    setChartsLoadingState((prev) => {
      return { ...prev, isLoading: false, isError: true };
    });
    console.warn('Something went wrong loading chart data');
  }
}
