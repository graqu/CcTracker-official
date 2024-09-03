import { createContext } from 'react';
import { useEffect, useState, useReducer } from 'react';
import {
  CryptoType,
  ContextType,
  ChildrenProp,
  ChartsDataT,
} from '@/lib/types';
import { portfolioReducer } from './ContextReducer';

export const CoinGeckoContext = createContext<ContextType>({
  loadingDataState: {
    mainList: {
      isLoading: false,
      isError: false,
    },
    chartsList: {
      isLoading: false,
      isError: false,
    },
  },
  marketData: [],
  getChart: () => {},
  chartsData: [],
  favouritesList: { coinsList: [], totalAmount: 0 },
  onAmountUpdate: () => {},
  onFavDataUpdate: () => {},
  onFavAdd: () => {},
  onFavRemove: () => {},
  onFavChangeAmount: () => {},
  onReset: () => {},
});

export const CoinGeckoContextProvider = ({ children }: ChildrenProp) => {
  const [coinsData, setCoinsData] = useState<CryptoType[] | null>(null);
  const [coinsChartData, setCoinsChartCoinsData] = useState([]);
  const [mainListState, setMainListState] = useState({
    isLoading: false,
    isError: false,
  });
  const [chartsLoadingState, setChartsLoadingState] = useState({
    isLoading: false,
    isError: false,
  });
  const [favourites, favDispath] = useReducer(portfolioReducer, {
    coinsList: [],
    totalAmount: 0,
  });
  const calculateFullAmount = () => {
    favDispath({ type: 'UPDATE_AMOUNT' });
  };
  const syncUserData = (data: string) => {
    favDispath({ type: 'LOAD_LOCAL_DATA', payload: data });
  };
  const coinChangeHandler = (id: string, value: number) => {
    if (value >= 0) {
      favDispath({ type: 'EDIT_AMOUNT', payload: { amount: value, id: id } });
    } else {
      alert('New Amount must be positive number or 0');
    }
    calculateFullAmount();
  };
  const updateFavCoinData = (coin: CryptoType) => {
    favDispath({
      type: 'UPDATE_DATA',
      payload: coin,
    });
  };
  const addFavCoin = (coinID: string, amount = 0) => {
    favDispath({
      type: 'ADD_NEW',
      payload: { id: coinID, amount: amount, marketData: { price: null } },
    });
    downloadMarkedData(coinID);
  };
  const removeFavCoin = (id: string) => {
    const favCopy = [...favourites.coinsList];
    const currentAmount = favCopy.find((coin) => coin.id === id).amount;

    if (currentAmount > 0) {
      const confirmation = confirm(
        'Your amount of this coin is more than 0, this action is not possible to Undo. You sure you want to delete it from favourites ?',
      );
      if (confirmation) {
        favDispath({
          type: 'REMOVE',
          payload: id,
        });
      } else {
        alert('SAVED: coin is still in your favourites');
      }
    } else {
      favDispath({
        type: 'REMOVE',
        payload: id,
      });
    }

    calculateFullAmount();
  };

  const downloadMarkedData = (id: string) => {
    const coinData = coinsData?.find((coin) => coin.id === id);

    updateFavCoinData({
      ...coinData,
      price: coinData?.price,
    });
  };

  const resetFavCoins = () => {
    favDispath({
      type: 'RESET',
    });
  };

  useEffect(() => {
    const localData = localStorage.getItem('coinsTracker-portfolio');

    if (localData) {
      syncUserData(JSON.parse(localData));
    } else {
      console.log('no-data');
    }
  }, []);

  useEffect(
    () =>
      async function getData() {
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
      },
    [],
  );

  async function fetchCharts(id: string) {
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
        setCoinsChartCoinsData((prev: Promise[]) => {
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

  async function getChartData(id: string) {
    const coinsChartCopy = [...coinsChartData];
    if (coinsChartCopy.some((item) => item.id === id)) {
      return coinsChartCopy.find((item) => item.id === id);
    } else {
      return await fetchCharts(id);
    }
  }

  const value = {
    marketData: coinsData,
    loadingDataState: {
      mainList: mainListState,
      chartsList: chartsLoadingState,
    },
    getChart: getChartData,
    chartsData: coinsChartData,
    favouritesList: favourites,
    onAmountUpdate: calculateFullAmount,
    onFavDataUpdate: updateFavCoinData,
    onFavAdd: addFavCoin,
    onFavRemove: removeFavCoin,
    onFavChangeAmount: coinChangeHandler,
    onReset: resetFavCoins,
  };

  return (
    <CoinGeckoContext.Provider value={value}>
      {children}
    </CoinGeckoContext.Provider>
  );
};

export default CoinGeckoContextProvider;
