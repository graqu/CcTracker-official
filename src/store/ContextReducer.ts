import { ReducerAction, favouritesStateType } from '@/lib/types';

const syncWithLocalStorage = (value: object) => {
  localStorage.setItem('coinsTracker-portfolio', JSON.stringify(value));
};

export function portfolioReducer(
  state: favouritesStateType,
  action: ReducerAction,
) {
  const newState = { ...state };

  switch (action.type) {
    case 'UPDATE_AMOUNT': {
      let newAmount = 0;
      newState.coinsList.forEach(
        (coin) => (newAmount += coin.amount * coin.marketData.price),
      );
      syncWithLocalStorage({ ...newState, totalAmount: newAmount });
      return { ...newState, totalAmount: newAmount };
    }
    case 'EDIT_AMOUNT': {
      const coinTochange = newState.coinsList.find(
        (coin) => coin.id === action.payload?.id,
      );
      coinTochange.amount = action.payload?.amount;
      syncWithLocalStorage({ ...state, ...newState });
      return { ...state, ...newState };
    }
    case 'UPDATE_DATA': {
      const newCoinData = action.payload;
      const coinToChangeData = newState.coinsList.find(
        (coin) => coin.id === newCoinData?.id,
      );
      coinToChangeData.marketData = newCoinData;
      return newState;
    }
    case 'ADD_NEW': {
      const newCoinData = action.payload;
      if (!state.coinsList.some((coin) => coin.id === newCoinData?.id)) {
        newState.coinsList.push(newCoinData);
      }
      syncWithLocalStorage({ ...state, ...newState });
      return { ...state, ...newState };
    }
    case 'REMOVE': {
      const idToRemove = action.payload;
      const newFavArray = state.coinsList.filter(
        (coin) => coin.id !== idToRemove,
      );
      newState.coinsList = newFavArray;
      syncWithLocalStorage(newState);
      return newState;
    }
    case 'LOAD_LOCAL_DATA': {
      return { ...state, ...action.payload };
    }

    case 'RESET': {
      return { ...state, coinsList: [], totalAmount: 0 };
    }

    default:
      {alert('non-recorgnized action');
      return state;}
  }
}
