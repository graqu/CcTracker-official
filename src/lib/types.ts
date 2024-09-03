import { ColumnDef } from '@tanstack/react-table';
import { ReactNode } from 'react';

export type CryptoType = {
  id?: string;
  rank?: number;
  name: string;
  icon: string;
  shortcut: string;
  price: number;
  marketcap: number;
  increased: null | boolean;
  favourite?: boolean;
};

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface FavColumnRowType extends favItemType {
  amountChanger: (id: string, value: number) => void;
  onRemove: (id: string) => void;
}

export interface ButtonContentInputT {
  style: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
  text: string;
  disabled: boolean;
}

export interface ChildrenProp {
  children: ReactNode;
}
export interface ReducerAction {
  type: string;
  payload?: { id: string; amount: number; marketData?: object } | string;
}

export interface ChartsDataT {
  id?: string;
  prices: Array<number[]>;
  market_caps: Array<number[]>;
  total_volumes: Array<number[]>;
}
export interface ContextType {
  loadingDataState: {
    mainList: { isLoading: boolean; isError: boolean };
    chartsList: { isLoading: boolean; isError: boolean };
  };
  marketData: CryptoType[] | null;
  getChart: (id: string | Promise<string>) => object | Promise<object> | void;
  chartsData: ChartsDataT[];
  favouritesList: favouritesStateType;
  onAmountUpdate: () => void;
  onFavDataUpdate: (coin: CryptoType) => void;
  onFavAdd: (coinID: string, amount?: number) => void;
  onFavRemove: (id: string) => void;
  onFavChangeAmount: (id: string, value: number) => void;
  onReset: () => void;
}

export interface favItemType {
  id: string;
  amount: number;
  marketData: {
    id?: string;
    price: number;
    name?: string;
    icon?: string;
    increased?: boolean;
  };
}

export interface favouritesStateType {
  coinsList: favItemType[];
  totalAmount: 0;
}

export type ChartTypeT = 'prices' | 'market_caps' | 'total_volumes';
