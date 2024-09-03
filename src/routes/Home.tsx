import { DataTable } from '@/components/cryptocurrencies/DataTable';
import { Columns } from '@/components/cryptocurrencies/Columns';
import { useContext } from 'react';
import { CoinGeckoContext } from '@/store/CoinsDataStore';
import { skeletonData } from '@/lib/SkeletonTableData';
import { ColumnsSkeleton } from '@/components/ui/ColumnsSkeleton';

const HomePage = () => {
  const coinsData = useContext(CoinGeckoContext).marketData;
  const loadingDataState =
    useContext(CoinGeckoContext).loadingDataState.mainList;

  let content;

  if (!coinsData && loadingDataState.isLoading && !loadingDataState.isError) {
    content = <DataTable columns={ColumnsSkeleton} data={skeletonData} />;
  }
  if (!coinsData && !loadingDataState.isLoading && loadingDataState.isError) {
    content = <p className='text-[tomato]'>🤨 Error Loading Data 😒</p>;
  }
  if (coinsData && coinsData.length === 0) {
    content = <p>No coins to show</p>;
  }
  if (coinsData && coinsData.length > 0) {
    content = <DataTable columns={Columns} data={coinsData} />;
  }
  return <>{content}</>;
};

export default HomePage;
